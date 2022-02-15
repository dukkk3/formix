import { useCallback, useMemo } from "react";

import { useLocalStore } from "@core/hooks";
import { formSchema } from "@core/helpers";
import {
	FieldSchemaFieldsKey,
	FieldSchemaGroupsKey,
	FIELD_SCHEMA_FIELDS_IDENTIFIER_KEY,
	FIELD_SCHEMA_GROUPS_IDENTIFIER_KEY,
} from "@core/config";
import type { Schema, SchemaBase, SchemaFormKind, Utils, UseFormix } from "@core/types";

export function useFormix<
	T extends SchemaBase.Form,
	B extends Schema.Form<T>,
	F extends B[FieldSchemaFieldsKey],
	E extends B[FieldSchemaGroupsKey],
	K extends keyof F,
	G extends keyof E
>(schema: SchemaFormKind<T> | T): UseFormix<T, B, F, E, K, G> {
	const preparedSchema = useMemo(() => formSchema(schema) as B, [schema]);
	const fields = useMemo(() => preparedSchema[FIELD_SCHEMA_FIELDS_IDENTIFIER_KEY], [preparedSchema]);
	const groups = useMemo(() => preparedSchema[FIELD_SCHEMA_GROUPS_IDENTIFIER_KEY], [preparedSchema]);
	const names = useMemo(
		() => ({
			fields: Object.keys(fields) as K[],
			groups: Object.keys(groups) as G[],
		}),
		[preparedSchema]
	);

	const reduceFieldNames = useCallback(
		<Z>(callback: (acc: Record<K, Z>, name: K) => Record<K, Z>) => {
			return names.fields.reduce((acc, name) => callback(acc, name), {} as Record<K, Z>);
		},
		[names]
	);

	const initialValues = useMemo(() => {
		return reduceFieldNames<string | boolean>((acc, name) => ({
			...acc,
			[name]: fields[name]?.defaultValue || "",
		}));
	}, [fields, reduceFieldNames]);

	const initialProps = useMemo(() => {
		return reduceFieldNames<any>((acc, name) => ({ ...acc, [name]: fields[name]?.props || {} }));
	}, [fields, reduceFieldNames]);

	const initialErrors = useMemo(() => {
		return reduceFieldNames<string>((acc, name) => ({ ...acc, [name]: "" }));
	}, [reduceFieldNames]);

	const customRules = useMemo(() => {
		return reduceFieldNames<any>((acc, name) => {
			const rules = fields[name]?.customRules;

			if (rules) {
				return { ...acc, [name]: rules };
			}

			return acc;
		});
	}, []);

	const rules = useMemo(() => {
		return reduceFieldNames<any>((acc, name) => {
			const rules = fields[name]?.rules;

			if (rules) {
				return { ...acc, [name]: rules };
			}

			return acc;
		});
	}, [fields, reduceFieldNames]);

	const errorsStore = useLocalStore(initialErrors);
	const valuesStore = useLocalStore(initialValues);
	const propsStore = useLocalStore(initialProps);

	const setProps = useCallback(
		<N extends K>(
			name: N,
			props:
				| ((
						prevProps: Partial<CheckForObject<F[N]["props"]>>
				  ) => Partial<CheckForObject<F[N]["props"]>>)
				| Partial<CheckForObject<F[N]["props"]>>
		) => {
			const prevProps = propsStore[name].value;
			const nextProps = typeof props === "function" ? props(prevProps) : props;

			propsStore[name].set(nextProps);
		},
		[propsStore]
	);

	const setProp = useCallback(
		<N extends K, O extends CheckForObject<F[N]["props"]>, I extends keyof O>(
			name: N,
			propName: I,
			value: ((prevValue: O[I]) => O[I]) | O[I]
		) => {
			setProps(
				name,
				(prevProps) =>
					({
						...prevProps,
						[propName]: typeof value === "function" ? (value as any)(prevProps[propName]) : value,
					} as any)
			);
		},
		[setProps]
	);

	const validate = useCallback(<N extends Utils.Paths<T>>(name: N) => {
		return null as any as boolean;
	}, []);

	const $ = useCallback(
		<N extends K>(name: N) => {
			return {
				setProps: (
					props:
						| ((
								prevProps: Partial<CheckForObject<F[N]["props"]>>
						  ) => Partial<CheckForObject<F[N]["props"]>>)
						| Partial<CheckForObject<F[N]["props"]>>
				) => setProps(name, props),
				setProp: <O extends CheckForObject<F[N]["props"]>, I extends keyof O>(
					propName: I,
					value: ((prevValue: O[I]) => O[I]) | O[I]
				) => setProp(name, propName, value),
			};
		},
		[setProps]
	);

	return { $, setProps, setProp };
}

type CheckForObject<T> = T extends Record<string, any> ? T : any;

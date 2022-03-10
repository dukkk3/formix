import React, { useCallback, useMemo } from "react";
import { useLocalObservable } from "mobx-react-lite";

import {
	FIELD_SCHEMA_SYMBOL,
	FORM_SCHEMA_FIELDS_SYMBOL,
	FORM_SCHEMA_GROUPS_SYMBOL,
	FORM_SCHEMA_SYMBOL,
} from "../config";
import { fieldSchema, formSchema, storeSchema, defaultValidate } from "./helpers";
import { pickProperties } from "./utils";
import type {
	Alias,
	FormSchema,
	FieldSchema,
	FormSchemaKey,
	FormSchemaBase,
	FieldSchemaBase,
	UseFieldReturnType,
	UseFormixReturnType,
	FormValuePrimitive,
	FormSchemaFieldsKey,
	FormSchemaGroupsKey,
	CustomFormValidateFn,
	CustomFieldValidateFn,
	FieldSchemaKey,
} from "./types";

function useLocalStore<T extends Record<string, any>>(base: T) {
	return useLocalObservable(() => storeSchema(base));
}

type GetFormSchemaBase<T extends FormSchemaBase | FormSchema<any>> = T extends FormSchema<infer R>
	? R
	: T extends FormSchemaBase
	? T
	: never;

type FormPrimitiveElement = HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement | null;

interface Options<T extends string> {
	validate?: CustomFormValidateFn<T>;
	// powerMode?: boolean;
}

export function useFormix<
	T extends FormSchemaBase | FormSchema<any>,
	B extends GetFormSchemaBase<T>,
	F extends FormSchema<B>,
	NF extends keyof F[FormSchemaKey][FormSchemaFieldsKey],
	NG extends keyof F[FormSchemaKey][FormSchemaGroupsKey]
>(
	schema: T,
	{ validate = defaultValidate }: Options<NF> = {}
): UseFormixReturnType<GetFormSchemaBase<T>> {
	const formElements = useMemo(() => ({} as Record<NF, FormPrimitiveElement>), []);
	const compiledSchema = useMemo(() => formSchema(schema), [schema]);

	const formSchemaContent = useMemo(() => compiledSchema[FORM_SCHEMA_SYMBOL], [compiledSchema]);
	const fieldsSchemaContent = useMemo(
		() => formSchemaContent[FORM_SCHEMA_FIELDS_SYMBOL],
		[formSchemaContent]
	);
	const groupsSchemaContent = useMemo(
		() => formSchemaContent[FORM_SCHEMA_GROUPS_SYMBOL],
		[formSchemaContent]
	);
	const fieldsSchemaContentKeys = useMemo(
		() => Object.keys(fieldsSchemaContent) as NF[],
		[fieldsSchemaContent]
	);

	const reduceFields = useCallback(
		<T>(callback: (acc: Record<NF, T>, name: NF) => Record<NF, T>) => {
			return fieldsSchemaContentKeys.reduce((acc, key) => callback(acc, key), {} as Record<NF, T>);
		},
		[fieldsSchemaContentKeys]
	);

	const getFieldSchema = useCallback(
		(name: NF) => {
			return fieldsSchemaContent[name][FIELD_SCHEMA_SYMBOL];
		},
		[fieldsSchemaContent]
	);

	const getGroupSchema = useCallback(
		(name: NG) => {
			return groupsSchemaContent[name];
		},
		[groupsSchemaContent]
	);

	const initialValues = useMemo(() => {
		return reduceFields<FormValuePrimitive>((acc, name) => ({
			...acc,
			[name]: getFieldSchema(name)["initialValue"] || "",
		}));
	}, [reduceFields, getFieldSchema]);

	const initialErrors = useMemo(() => {
		return reduceFields<string>((acc, name) => ({ ...acc, [name]: "" }));
	}, [reduceFields]);

	const initialProps = useMemo(() => {
		return reduceFields<any>((acc, name) => ({
			...acc,
			[name]: getFieldSchema(name)["props"] || {},
		}));
	}, [reduceFields, getFieldSchema]);

	const rulesSchema = useMemo(() => {
		return reduceFields<any>((acc, name) => ({
			...acc,
			[name]: getFieldSchema(name)["rules"] || null,
		}));
	}, [reduceFields, getFieldSchema]);

	const valuesStore = useLocalStore(initialValues);
	const errorsStore = useLocalStore(initialErrors);
	const propsStore = useLocalStore(initialProps);

	const getValues = useCallback(() => {
		return reduceFields<FormValuePrimitive>((acc, name) => ({
			...acc,
			[name]: valuesStore[name].value,
		}));
	}, [reduceFields, valuesStore]);

	const getValue = useCallback(
		(name: NF) => {
			return valuesStore[name].value;
		},
		[valuesStore]
	);

	const getErrors = useCallback(() => {
		return reduceFields<string>((acc, name) => ({ ...acc, [name]: errorsStore[name].value }));
	}, [reduceFields, errorsStore]);

	const getError = useCallback(
		(name: NF) => {
			return errorsStore[name].value;
		},
		[errorsStore]
	);

	const setErrors = useCallback(
		(errors: Partial<Record<NF, string>>) => {
			fieldsSchemaContentKeys.forEach((name) => {
				if (typeof errors[name] === "string") {
					errorsStore[name].set(errors[name] as string);
				}
			});
		},
		[errorsStore, fieldsSchemaContentKeys]
	);

	const setError = useCallback(
		(name: NF, error: string) => {
			setErrors({ [name]: error } as any);
		},
		[setErrors]
	);

	const setProps = useCallback(
		<N extends NF, P extends F[FormSchemaKey][FormSchemaFieldsKey][N][FieldSchemaKey]["props"]>(
			name: N,
			props: ((prevProps: P) => P) | P
		) => {
			const newProps =
				typeof props === "function"
					? // @ts-ignore
					  props(propsStore[name].value)
					: props;

			propsStore[name].set(newProps);
		},
		[propsStore]
	);

	const setProp = useCallback(
		<
			N extends NF,
			P extends F[FormSchemaKey][FormSchemaFieldsKey][N][FieldSchemaKey]["props"],
			PN extends keyof P
		>(
			name: N,
			propName: PN,
			prop: ((prevValue: P[PN]) => P[PN]) | P[PN]
		) => {
			const newProp =
				typeof prop === "function"
					? // @ts-ignore
					  prop(propsStore[name].value[propName])
					: prop;

			// @ts-ignore
			setProps(name, (prevProps) => ({ ...prevProps, [propName]: newProp }));
		},
		[propsStore, setProps]
	);

	const setValues = useCallback(
		(values: Partial<Record<NF, FormValuePrimitive>>) => {
			fieldsSchemaContentKeys.forEach((name) => {
				if (typeof values[name] !== "undefined") {
					valuesStore[name].set(values[name] as any);
				}
			});
		},
		[fieldsSchemaContentKeys, valuesStore]
	);

	const setValue = useCallback(
		(
			name: NF,
			value: ((prevValue: FormValuePrimitive) => FormValuePrimitive) | FormValuePrimitive
		) => {
			const newValue = typeof value === "function" ? value(valuesStore[name].value) : value;

			valuesStore[name].set(newValue);
		},
		[valuesStore]
	);

	const getDataForValidate = useCallback(
		<N extends NG | NF>(target?: N) => {
			const targets = [] as NF[];
			const targetIsForm = !target;
			const targetIsGroup = target?.includes("*");

			switch (true) {
				case targetIsForm:
					targets.push(...fieldsSchemaContentKeys);
					break;
				case targetIsGroup:
					targets.push(...(getGroupSchema(target as any) as NF[]));
					break;
				default:
					targets.push(target as any);
			}

			const values = pickProperties(getValues(), ...targets);
			const rules = pickProperties(rulesSchema, ...targets);

			return { values, rules };
		},
		[fieldsSchemaContentKeys, getGroupSchema, getValues, rulesSchema]
	);

	const validateTarget = useCallback(
		async <N extends NG | NF>(target?: N) => {
			const { rules, values } = getDataForValidate(target);

			const errors = await Promise.resolve(validate(values as any, rules as any));
			const haveErrors = Object.values(errors).some((error) => error);

			if (haveErrors) {
				setErrors(errors);
			}

			return !haveErrors;
		},
		[getDataForValidate, setErrors, validate]
	);

	const isValid = useCallback(
		async <N extends NG | NF>(target?: N) => {
			const { rules, values } = getDataForValidate(target);

			const errors = await Promise.resolve(validate(values as any, rules as any));
			const haveErrors = Object.values(errors).some((error) => error);

			return !haveErrors;
		},
		[getDataForValidate, validate]
	);

	// const createRefHandler = useCallback(
	// 	(name: NF) => (element: FormPrimitiveElement) => {
	// 		formElements[name] = element;

	// 		if (element) {
	// 			const value = { ...valuesStore }[name].value;

	// 			if (typeof value === "boolean") {
	// 				(element as HTMLInputElement).checked = value;
	// 			} else {
	// 				element.value = value as any;
	// 			}
	// 		}
	// 	},
	// 	[formElements, valuesStore]
	// );

	const getNewValue = useCallback(
		(target: NonNullable<FormPrimitiveElement>, currentValue: FormValuePrimitive) => {
			const value = target.value;
			console.log(target, value, currentValue);
			if (Array.isArray(currentValue)) {
				if ("selectedOptions" in target) {
					return [...target.selectedOptions].map((item) => item.value);
				} else if ("checked" in target) {
					const checked = Boolean(target.checked);
					console.log("ok", currentValue, [...new Set([...currentValue, value])]);
					return checked
						? [...new Set([...currentValue, value])]
						: currentValue.filter((item) => item !== value);
				} else {
					return [...new Set([...currentValue, value])];
				}
			} else if (typeof currentValue === "boolean") {
				return Boolean((target as any).checked);
			} else {
				return target.value;
			}
		},
		[]
	);

	const createChangeHandler = useCallback(
		(name: NF) => (event: React.ChangeEvent<NonNullable<FormPrimitiveElement>>) => {
			const targetElement = event.target;
			const newValue = getNewValue(targetElement, initialValues[name]);

			valuesStore[name].set(newValue);
		},
		[getNewValue, initialValues, valuesStore]
	);

	const bind = useCallback(
		(name: NF) => {
			const onChange = createChangeHandler(name);
			// const ref = powerMode ? createRefHandler(name) : undefined;
			const value = valuesStore[name].value;
			const props = propsStore[name].value;

			return {
				...props,
				...(typeof value === "boolean" ? { checked: value } : { value }),
				as: getFieldSchema(name).as,
				onChange,
			};
		},
		[createChangeHandler, getFieldSchema, propsStore, valuesStore]
	);

	const $ = useCallback(
		<N extends NF>(name: N) => {
			return {
				bind: () => bind(name),
				isValid: () => isValid(name),
				validate: () => validateTarget(name),
				getError: () => getError(name),
				setError: (error: string) => setError(name, error),
				setValue: (value: any) => setValue(name, value),
				setProp: (propName: any, prop: any) => setProp(name, propName, prop),
				setProps: (props: any) => setProps(name, props),
				getValue: () => getValue(name),
			};
		},
		[bind, getError, getValue, isValid, setError, setProp, setProps, setValue, validateTarget]
	);

	return {
		// @ts-ignore
		bind,
		// @ts-ignore
		validate: validateTarget,
		// @ts-ignore
		isValid,
		// @ts-ignore
		getValues,
		// @ts-ignore
		getErrors,
		// @ts-ignore
		setError,
		// @ts-ignore
		setErrors,
		// @ts-ignore
		setProp,
		// @ts-ignore
		setProps,
		// @ts-ignore
		setValues,
		// switchDisabled,
		// @ts-ignore
		getError,
		// getProp,
		// getProps,
		// getTouched,
		// getMeta,
		// @ts-ignore
		getValue,
		// isValid:
		// @ts-ignore
		$,
	};
}

export function useField<T extends keyof Alias>(
	base: Partial<FieldSchemaBase<T>> | FieldSchema<T> | FormValuePrimitive
): UseFieldReturnType<T> {
	const form = useFormix({ field: base });
	// @ts-ignore
	return form.$("field");
}

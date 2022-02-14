import { useCallback, useMemo } from "react";

import { FieldSchemaFieldsKey, FORM_SCHEMA_IDENTIFIER_KEY } from "@core/config";
import type { Alias, Schema, SchemaBase, SchemaFormKind, Utils } from "@core/types";

export function useFormix<
	T extends SchemaBase.Form,
	B extends Schema.Form<T>,
	F extends B[FieldSchemaFieldsKey],
	K extends keyof F
>(schema: SchemaFormKind<T> | T | (() => B)) {
	const setProps = useCallback(
		<N extends K>(
			name: N,
			props:
				| ((
						prevProps: Partial<CheckForObject<F[N]["props"]>>
				  ) => Partial<CheckForObject<F[N]["props"]>>)
				| Partial<CheckForObject<F[N]["props"]>>
		) => {},
		[]
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
			};
		},
		[setProps]
	);

	return { $, setProps, validate };
}

type CheckForObject<T> = T extends Record<string, any> ? T : any;

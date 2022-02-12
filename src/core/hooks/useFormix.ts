import { useCallback, useMemo } from "react";

import { FORM_SCHEMA_IDENTIFIER_KEY } from "@core/config";
import type { Alias, Schema, SchemaBase } from "@core/types";

export function useFormix<
	T extends { [k: string]: Schema.Field<any, any> },
	K extends keyof Omit<T, typeof FORM_SCHEMA_IDENTIFIER_KEY>
>(schema: () => T) {
	const setProps = useCallback(<N extends K>(name: N, props: T[N]["props"]) => {}, []);

	return { setProps };
}

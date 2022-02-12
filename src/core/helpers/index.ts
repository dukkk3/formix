import { deepObjectEntries } from "@core/utils";
import {
	NATIVE_ALIAS,
	ALIAS_IDENTIFIER_KEY,
	FORM_SCHEMA_IDENTIFIER_KEY,
	FIELD_SCHEMA_IDENTIFIER_KEY,
} from "@core/config";
import type { Alias, Schema, SchemaBase } from "@core/types";

const FIELD_SCHEMA_SYMBOL = Symbol();
const FORM_SCHEMA_SYMBOL = Symbol();

export function aliasSchema<T extends Alias.Base>(
	alias: ((nativeAlias: Alias.Native) => Readonly<T>) | Readonly<T>
) {
	return typeof alias === "function" ? alias({ ...NATIVE_ALIAS }) : alias;
}

export function fieldSchema<
	T extends Alias.Base = Alias.Native,
	C extends keyof T = keyof Alias.Native
>(base: SchemaBase.Field<T, C>, alias: T = NATIVE_ALIAS as unknown as T): Schema.Field<T, C> {
	return {
		...base,
		// @ts-ignore
		[ALIAS_IDENTIFIER_KEY]: alias,
		[FIELD_SCHEMA_IDENTIFIER_KEY]: FIELD_SCHEMA_SYMBOL,
	};
}

type FormSchemaBase<T extends SchemaBase.Form, C extends Alias.Base = Alias.Native> =
	| ((helpers: {
			fieldSchema: <H extends keyof C>(base: SchemaBase.Field<C, H>) => Schema.Field<C, H>;
	  }) => T)
	| T;

export function formSchema<T extends SchemaBase.Form, C extends Alias.Base = Alias.Native>(
	base: FormSchemaBase<T, C>,
	alias?: C
): () => Schema.Form<T> {
	const pickedBase =
		typeof base === "function" ? base({ fieldSchema: (base) => fieldSchema(base, alias) }) : base;

	if (
		pickedBase[FORM_SCHEMA_IDENTIFIER_KEY] &&
		(pickedBase[FORM_SCHEMA_IDENTIFIER_KEY] as any) === FORM_SCHEMA_SYMBOL
	) {
		return () => pickedBase as unknown as Schema.Form<T>;
	}

	return () =>
		({
			...deepObjectEntries(pickedBase).filter(
				([_, value]) =>
					typeof value === "object" &&
					value[FIELD_SCHEMA_IDENTIFIER_KEY] &&
					value[FIELD_SCHEMA_IDENTIFIER_KEY] === FORM_SCHEMA_SYMBOL
			),
			[FORM_SCHEMA_IDENTIFIER_KEY]: FORM_SCHEMA_SYMBOL,
		} as any);
}

type StoreSchema<S extends Record<string, any>> = {
	[K in keyof S]: {
		value: S[K];
		set: (value: S[K]) => void;
	};
};

export function storeSchema<S extends Record<string, any>>(object: S) {
	const entries = Object.entries(object);

	return entries.reduce(
		(acc, [key, defaultValue]) => ({
			...acc,
			[key]: {
				value: defaultValue,
				set: function (value) {
					this.value = value;
				},
			},
		}),
		{} as StoreSchema<S>
	);
}

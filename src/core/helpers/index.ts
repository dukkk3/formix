import { deepObjectEntries } from "@core/utils";
import {
	FORM_SCHEMA_IDENTIFIER_KEY,
	FIELD_SCHEMA_IDENTIFIER_KEY,
	FIELD_SCHEMA_FIELDS_IDENTIFIER_KEY,
	FIELD_SCHEMA_GROUPS_IDENTIFIER_KEY,
} from "@core/config";
import type { Alias, Schema, SchemaBase, SchemaFormKind } from "@core/types";

function isFieldSchema(value: any) {
	return typeof value === "object" && value[FIELD_SCHEMA_IDENTIFIER_KEY];
}

export function fieldSchema<T extends keyof Alias>(
	base: Partial<SchemaBase.Field<T>>
): Schema.Field<T> {
	return {
		props: {} as any,
		customRules: null,
		defaultValue: "" as any,
		...base,
		[FIELD_SCHEMA_IDENTIFIER_KEY]: true,
	} as Schema.Field<T>;
}

export function formSchema<T extends SchemaBase.Form>(base: SchemaFormKind<T> | T): Schema.Form<T> {
	const pickedBase = typeof base === "function" ? base({ fieldSchema: fieldSchema as any }) : base;

	if ((pickedBase as any)[FORM_SCHEMA_IDENTIFIER_KEY]) {
		return pickedBase as unknown as Schema.Form<T>;
	}

	const entries = deepObjectEntries(pickedBase, (_, value) => !isFieldSchema(value));

	const compiledSchemas = entries.filter(([_, value]) => isFieldSchema(value));
	const primitivesSchemas = entries
		.filter(([_, value]) => ["string", "boolean"].includes(typeof value))
		.map(([key, value]) => [key, fieldSchema({ ...({ defaultValue: value } as any) })]);

	const fieldSchemas = [...compiledSchemas, ...primitivesSchemas];
	const groups = entries
		.filter(([key]) => fieldSchemas.every(([targetKey]) => key !== targetKey))
		.map(([key]) => [
			key,
			fieldSchemas.filter(([targetKey]) => (targetKey as string).includes(key)).map(([key]) => key),
		]);

	return {
		[FIELD_SCHEMA_IDENTIFIER_KEY]: true,
		[FIELD_SCHEMA_FIELDS_IDENTIFIER_KEY]: [...compiledSchemas, ...primitivesSchemas].reduce(
			(acc, [key, value]) => ({ ...acc, [key as string]: value }),
			{} as any
		),
		[FIELD_SCHEMA_GROUPS_IDENTIFIER_KEY]: groups.reduce(
			(acc, [key, value]) => ({ ...acc, [`${key as string}.*`]: value }),
			{} as any
		),
	} as any;
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

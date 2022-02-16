import {
	FORM_SCHEMA_SYMBOL,
	FIELD_SCHEMA_SYMBOL,
	FORM_SCHEMA_FIELDS_SYMBOL,
	FORM_SCHEMA_GROUPS_SYMBOL,
} from "@config";
import { deepObjectEntries } from "@core/utils";
import type {
	Alias,
	FormSchema,
	FieldSchema,
	StoreSchema,
	FormSchemaKey,
	FormSchemaBase,
	FieldSchemaKey,
	FieldSchemaBase,
} from "@core/types";

export function fieldSchema<T extends keyof Alias, P extends FieldSchemaBase<T> | FieldSchema<T>>(
	base: Partial<FieldSchemaBase<T>>
): P extends { [key in FieldSchemaKey]: any }
	? P
	: T extends FieldSchemaBase<any>
	? FieldSchema<T>
	: never {
	if ((base as any)[FIELD_SCHEMA_SYMBOL]) {
		return base as any;
	}

	return {
		[FIELD_SCHEMA_SYMBOL]: {
			as: "" as any,
			props: {} as any,
			initialValue: "",
			rules: "",
			...base,
		},
	} as any;
}

export function formSchema<T extends FormSchemaBase | FormSchema<any>>(
	base: T
): T extends { [key in FormSchemaKey]: any }
	? T
	: T extends FormSchemaBase
	? FormSchema<T>
	: never {
	if ((base as any)[FORM_SCHEMA_SYMBOL]) {
		return base as any;
	}

	const baseEntries = deepObjectEntries(
		base as any,
		(_, value) => !(typeof value === "object" && value[FIELD_SCHEMA_SYMBOL])
	);

	const rawFields = baseEntries.filter(([_, value]) => ["string", "boolean"].includes(typeof value));
	const preparedFields = baseEntries.filter(
		([_, value]) => typeof value === "object" && value[FIELD_SCHEMA_SYMBOL]
	);

	const fields = [...preparedFields, ...rawFields].map(([key, value]) => [
		key,
		["string", "boolean"].includes(typeof value) ? fieldSchema({ initialValue: value }) : value,
	]);

	const groups = baseEntries
		.filter(([baseEntryKey]) => fields.every(([key]) => key !== baseEntryKey))
		.map(([baseEntryKey]) => [
			`${baseEntryKey}.*`,
			fields.filter(([key]) => key.includes(baseEntryKey)),
		]);

	return {
		[FORM_SCHEMA_SYMBOL]: {
			[FORM_SCHEMA_FIELDS_SYMBOL]: fields as any,
			[FORM_SCHEMA_GROUPS_SYMBOL]: groups as any,
		},
	} as any;
}

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

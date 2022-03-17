import { FIELD_SCHEMA_SYMBOL, FORM_SCHEMA_SYMBOL } from "../constants";

export type FieldSchemaSymbol = typeof FIELD_SCHEMA_SYMBOL;
export type FormSchemaSymbol = typeof FORM_SCHEMA_SYMBOL;

export type FieldSchemaBase<T extends any> = {
	defaultValue: T;
	validate?: ValidateFn;
};

export type ValidateFn = (
	value: FormValuePrimitive,
	meta: {
		name: string;
		getFlattenValues: <T>() => T;
		getUnflattenValues: <T>() => T;
	}
	// error?: string
) => Promise<string> | string;
export type FormSchemaBase = Record<string, any>;

export type FormElementPrimitive = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
export type FormSchemaPrimitive = FormValuePrimitive | FieldSchema<any>;
export type FormValuePrimitive = string | boolean | string[];

export type ConvertToFormPrimitiveValue<T extends any> = T extends any[]
	? string[]
	: T extends FormValuePrimitive
	? T extends string
		? string
		: T extends boolean
		? boolean
		: T
	: never;

export type ConvertFieldToFormPrimitiveValue<T extends FieldSchema<any>> =
	ConvertToFormPrimitiveValue<T[FieldSchemaSymbol]["defaultValue"]>;

export type FieldSchema<T extends any> = {
	[FIELD_SCHEMA_SYMBOL]: FieldSchemaBase<T>;
};

export type FormSchema<T extends FormSchemaBase> = {
	[FORM_SCHEMA_SYMBOL]: {
		fields: {
			[K in FormFieldPaths<T>]: DeepPropType<T, K> extends FieldSchema<any>
				? DeepPropType<T, K>
				: FieldSchema<DeepPropType<T, K>>;
		};
		groups: {
			[K in FormGroupPaths<T>]: string[];
		};
	};
};

export type StoreSchemaBase = Record<string, any>;

export type StoreSchema<T extends StoreSchemaBase> = {
	[K in keyof T]: {
		value: T[K];
		set: (value: T[K]) => void;
	};
};

export type RecordFields<T extends FormSchemaBase> = {
	[K in keyof FormSchema<T>[FormSchemaSymbol]["fields"]]: ConvertToFormPrimitiveValue<
		FormSchema<T>[FormSchemaSymbol]["fields"][K][FieldSchemaSymbol]["defaultValue"]
	>;
};

export type AliasBase = Record<string, React.FC<any>>;

type DeepSchemaConvertToPrimitiveValue<T> = T extends FormValuePrimitive
	? ConvertToFormPrimitiveValue<T>
	: T extends FieldSchema<infer R>
	? ConvertToFormPrimitiveValue<R>
	: T extends object
	? { [K in keyof T]: DeepSchemaConvertToPrimitiveValue<T[K]> }
	: never;

export type PickUnflattenSchema<T> = T extends FormSchema<infer R>
	? DeepSchemaConvertToPrimitiveValue<R>
	: T extends FormSchemaBase
	? DeepSchemaConvertToPrimitiveValue<T>
	: never;

export type PickFlattenSchema<T> = T extends FormSchema<any>
	? {
			[K in keyof T[FormSchemaSymbol]["fields"]]: ConvertFieldToFormPrimitiveValue<
				T[FormSchemaSymbol]["fields"][K]
			>;
	  }
	: T extends FormSchemaBase
	? PickFlattenSchema<FormSchema<T>>
	: never;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ArrayShift<T extends any[]> = T extends [infer _, ...infer Tail] ? Tail : never;

export type FormGroupPaths<T, D extends number = 3> = [D] extends [never]
	? never
	: T extends FormSchemaPrimitive
	? ""
	: T extends object
	? {
			[K in keyof T]-?: K extends string | number
				?
						| `${K}${T[K] extends FormSchemaPrimitive ? "" : ".*"}`
						| JoinKeys<K, FormGroupPaths<T[K], Prev[D]>>
				: never;
	  }[keyof T]
	: "";

export type FormFieldPaths<T, D extends number = 3> = [D] extends [never]
	? never
	: T extends FormSchemaPrimitive
	? ""
	: T extends object
	? { [K in keyof T]-?: JoinKeys<K, FormFieldPaths<T[K], Prev[D]>> }[keyof T]
	: "";

export type DeepPropType<T, P extends string> = string extends P
	? unknown
	: P extends keyof T
	? T[P]
	: P extends `${infer K}.${infer R}`
	? K extends keyof T
		? DeepPropType<T[K], R>
		: unknown
	: unknown;

type JoinKeys<K, U> = K extends string | number
	? U extends string | number
		? `${K}${"" extends U ? "" : "."}${U}`
		: never
	: never;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, ...0[]];

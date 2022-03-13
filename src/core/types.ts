import { FIELD_SCHEMA_SYMBOL, FORM_SCHEMA_SYMBOL } from "../constants";

export type FieldSchemaSymbol = typeof FIELD_SCHEMA_SYMBOL;
export type FormSchemaSymbol = typeof FORM_SCHEMA_SYMBOL;

export type FieldSchemaBase<T extends any> = {
	defaultValue: T;
	validate?: ValidateFn;
};

export type ValidateFn = (
	value: FormValuePrimitive,
	fieldName: string
	// error?: string
) => Promise<string> | string;
export type FormSchemaBase = Record<string, any>;

export type FormElementPrimitive = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
export type FormSchemaPrimitive = FormValuePrimitive | FieldSchema<any>;
export type FormValuePrimitive = string | boolean | string[];

export type ConvertToFormPrimitiveValue<T extends any> = T extends any[]
	? string[]
	: T extends FormValuePrimitive
	? T
	: never;

export type ConvertFieldToFormPrimitiveValue<T extends FieldSchema<any>> =
	ConvertToFormPrimitiveValue<T["FIELD_SCHEMA"]["defaultValue"]>;

export type FieldSchema<T extends any> = {
	[key in FieldSchemaSymbol]: FieldSchemaBase<T>;
};

export type FormSchema<T extends FormSchemaBase> = {
	[key in FormSchemaSymbol]: {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ArrayShift<T extends any[]> = T extends [infer _, ...infer Tail] ? Tail : never;

type FormGroupPaths<T, D extends number = 5> = [D] extends [never]
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

type FormFieldPaths<T, D extends number = 5> = [D] extends [never]
	? never
	: T extends FormSchemaPrimitive
	? ""
	: T extends object
	? { [K in keyof T]-?: JoinKeys<K, FormFieldPaths<T[K], Prev[D]>> }[keyof T]
	: "";

type DeepPropType<T, P extends string> = string extends P
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

import {
	FORM_SCHEMA_FIELDS_SYMBOL,
	FORM_SCHEMA_GROUPS_SYMBOL,
	FIELD_SCHEMA_SYMBOL,
	FORM_SCHEMA_SYMBOL,
	DEFAULT_ALIAS,
} from "../config";

export type Alias = typeof DEFAULT_ALIAS;

export type FormSchemaFieldsKey = typeof FORM_SCHEMA_FIELDS_SYMBOL;
export type FormSchemaGroupsKey = typeof FORM_SCHEMA_GROUPS_SYMBOL;
export type FieldSchemaKey = typeof FIELD_SCHEMA_SYMBOL;
export type FormSchemaKey = typeof FORM_SCHEMA_SYMBOL;

export type FormPrimitives = FormValuePrimitive | FieldSchema<any>;
export type FormValuePrimitive = string | boolean | string[];
export type FormPrimitiveElement =
	| HTMLInputElement
	| HTMLSelectElement
	| HTMLTextAreaElement
	| null;

export type FieldSchemaBase<K extends keyof Alias> = {
	as: K;
	rules: any;
	initialValue: FormValuePrimitive;
};

export type CustomFieldValidateFn = (
	value: FormValuePrimitive,
	schema: any
) => CustomValidateFnReturnType<string>;

export type CustomFormValidateFn<T extends string> = (
	values: Partial<Record<T, FormValuePrimitive>>,
	schema: Partial<Record<T, any>>
) => CustomValidateFnReturnType<Partial<Record<T, string>>>;

type CustomValidateFnReturnType<T> = Promise<T> | T;

export type FieldSchema<K extends keyof Alias> = {
	[key in FieldSchemaKey]: FieldSchemaBase<K>;
};

export type FormSchemaBase = { [k: string]: any };

export type FormSchema<T extends FormSchemaBase> = {
	[key in FormSchemaKey]: {
		[key in FormSchemaFieldsKey]: {
			[K in FormFieldPaths<T>]: DeepPropType<T, K> extends FieldSchema<any>
				? DeepPropType<T, K>
				: FieldSchema<any>;
		};
	} & {
		[key in FormSchemaGroupsKey]: {
			[K in FormGroupPaths<T>]: string[];
		};
	};
};

export type UseFormixReturnType<
	T extends FormSchemaBase,
	F extends FormSchema<T> = FormSchema<T>,
	TF extends F[FormSchemaKey][FormSchemaFieldsKey] = F[FormSchemaKey][FormSchemaFieldsKey],
	TG extends F[FormSchemaKey][FormSchemaGroupsKey] = F[FormSchemaKey][FormSchemaGroupsKey],
	TFK extends keyof TF = keyof TF,
	TGK extends keyof TG = keyof TG
> = {
	getValue: (name: TFK) => FormValuePrimitive;
	getError: (name: TFK) => string;
	// getTouched: <N extends TFK>(name: N) => boolean;
	setValues: (values: Partial<Record<TFK, FormValuePrimitive>>) => void;
	setError: (name: TFK, error: string) => void;
	setErrors: (errors: Partial<Record<TFK, string>>) => void;
	// getMeta: () => Record<TFK, { touched: boolean; error: string }>;
	getValues: () => Record<TFK, FormValuePrimitive>;
	getErrors: () => Record<TFK, string>;
	bind: <N extends TFK>(name: N) => { as: TF[N][FieldSchemaKey]["as"] };
	// switchDisabled: (disabled: boolean) => void;
	// disabled: <N extends TFK>(name?: N) => boolean;
	isValid: (name?: TFK | TGK) => Promise<boolean>;
	validate: (name?: TFK | TGK) => Promise<boolean>;
	$: <N extends TFK>(
		name: N
	) => {
		[K in keyof Omit<
			UseFormixReturnType<T, F, TF, TG, N, TGK>,
			"$" | "getValues" | "getErrors" | "getMeta" | "setErrors" | "setValues"
		>]: (
			...params: ArrayShift<Parameters<UseFormixReturnType<T, F, TF, TG, N, TGK>[K]>>
		) => ReturnType<UseFormixReturnType<T, F, TF, TG, N, TGK>[K]>;
	};
};

export type UseFieldReturnType<P extends keyof Alias> = {
	[K in keyof ReturnType<UseFormixReturnType<any>["$"]>]: ReturnType<
		UseFormixReturnType<{ field: FieldSchema<P> }>["$"]
	>[K];
};

export type StoreSchema<S extends Record<string, any>> = {
	[K in keyof S]: {
		value: S[K];
		set: (value: S[K]) => void;
	};
};

export type ArrayShift<T extends any[]> = T extends [infer _, ...infer Tail] ? Tail : never;

type FormGroupPaths<T, D extends number = 5> = [D] extends [never]
	? never
	: T extends FormPrimitives
	? ""
	: T extends object
	? {
			[K in keyof T]-?: K extends string | number
				? `${K}${T[K] extends FormPrimitives ? "" : ".*"}` | JoinKeys<K, FormGroupPaths<T[K], Prev[D]>>
				: never;
	  }[keyof T]
	: "";

type FormFieldPaths<T, D extends number = 5> = [D] extends [never]
	? never
	: T extends FormPrimitives
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

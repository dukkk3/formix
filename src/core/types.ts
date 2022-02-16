import {
	FORM_SCHEMA_FIELDS_SYMBOL,
	FORM_SCHEMA_GROUPS_SYMBOL,
	FIELD_SCHEMA_SYMBOL,
	FORM_SCHEMA_SYMBOL,
	DEFAULT_ALIAS,
} from "@config";

export type Alias = typeof DEFAULT_ALIAS;

export type FormSchemaFieldsKey = typeof FORM_SCHEMA_FIELDS_SYMBOL;
export type FormSchemaGroupsKey = typeof FORM_SCHEMA_GROUPS_SYMBOL;
export type FieldSchemaKey = typeof FIELD_SCHEMA_SYMBOL;
export type FormSchemaKey = typeof FORM_SCHEMA_SYMBOL;

export type FormPrimitives = boolean | string | FieldSchema<any>;

export type FieldSchemaBase<K extends keyof Alias> = {
	as: K;
	props: Alias[K] extends React.FC<infer R> ? R : { [k: string]: any };
	initialValue: string | boolean;
	rules: any;
};

export type FieldSchema<K extends keyof Alias> = { [key in FieldSchemaKey]: FieldSchemaBase<K> };

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
	setProp: <N extends TFK, P extends TF[N][FieldSchemaKey]["props"], PN extends keyof P>(
		name: N,
		propName: PN,
		value: ((prevValue: P[PN]) => P[PN]) | P[PN]
	) => void;
	setProps: <N extends TFK, P extends TF[N][FieldSchemaKey]["props"]>(
		name: N,
		props: ((prevProps: P) => Partial<P>) | P
	) => void;
	getProp: <N extends TFK, P extends TF[N][FieldSchemaKey]["props"], PN extends keyof P>(
		name: N,
		propName: PN
	) => P[PN];
	getProps: <N extends TFK>(name: N) => TF[N][FieldSchemaKey]["props"];
	getValue: <N extends TFK>(name: N) => string | boolean;
	getError: <N extends TFK>(name: N) => string;
	getTouched: <N extends TFK>(name: N) => boolean;
	setValues: (values: Partial<Record<TFK, string | boolean>>) => void;
	setError: <N extends TFK>(name: N, error: string) => void;
	setErrors: (errors: Partial<Record<TFK, string>>) => void;
	getMeta: () => Record<TFK, { touched: boolean; error: string }>;
	getValues: () => Record<TFK, string | boolean>;
	getErrors: () => Record<TFK, string>;
	switchDisabled: (disabled: boolean) => void;
	disabled: <N extends TFK>(name?: N) => boolean;
	isValid: <N extends TFK | TGK>(name?: N) => boolean;
	validate: <N extends TFK | TGK>(name?: N) => boolean;
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

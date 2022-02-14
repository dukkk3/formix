import type { ValidationRuleObject } from "fastest-validator";

import {
	FieldSchemaFieldsKey,
	FieldSchemaGroupsKey,
	FieldSchemaKey,
	NATIVE_ALIAS,
} from "@core/config";

export declare namespace SchemaBase {
	export type Form = {
		// [k: string]: Form | Extract<Primitives.FormSchema, Schema.Field<any>> | object;
		[k: string]: any;
	};
	// export type Form = Record<string, any>;

	export type Field<T extends keyof Alias> = {
		as: T;
		defaultValue: string | boolean;
		props: Alias[T] extends React.FC<infer R> ? R : any;
		rules: ValidationRuleObject | string;
	};
}

export declare namespace Schema {
	export type Form<T extends SchemaBase.Form> = {
		[key in FieldSchemaFieldsKey]: {
			[K in Utils.Leaves<T>]: Utils.PathPropType<T, K> extends Schema.Field<any>
				? Utils.PathPropType<T, K>
				: SchemaBase.Field<any>;
		};
	} & {
		[key in FieldSchemaGroupsKey]: {
			[K in Utils.Paths<T>]: string[];
		};
	};

	export type Field<T extends keyof Alias> = SchemaBase.Field<T> & {
		[key in FieldSchemaKey]: true;
	};

	export type Validation = ValidationRuleObject | string;
}

export declare namespace Primitives {
	export type FormSchema = Schema.Field<any> | boolean | string;
}

export type Alias = typeof NATIVE_ALIAS;

export type SchemaFormKind<T extends SchemaBase.Form> =
	| (() => T)
	| ((helpers: {
			fieldSchema: <N extends keyof Alias>(base: Partial<SchemaBase.Field<N>>) => Schema.Field<N>;
	  }) => T);

export declare namespace Utils {
	type Prev = [never, 0, 1, 2, 3, 4, 5, 6, ...0[]];

	type Join<K, P> = K extends string | number
		? P extends string | number
			? `${K}${"" extends P ? "" : "."}${P}`
			: never
		: never;

	export type Paths<T, D extends number = 5> = [D] extends [never]
		? never
		: T extends Primitives.FormSchema
		? ""
		: T extends object
		? {
				[K in keyof T]-?: K extends string | number
					? `${K}${T[K] extends Primitives.FormSchema ? "" : ".*"}` | Join<K, Paths<T[K], Prev[D]>>
					: never;
		  }[keyof T]
		: "";

	export type Leaves<T, D extends number = 5> = [D] extends [never]
		? never
		: T extends Primitives.FormSchema
		? ""
		: T extends object
		? { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T]
		: "";

	export type PathPropType<T, Path extends string> = string extends Path
		? unknown
		: Path extends keyof T
		? T[Path]
		: Path extends `${infer K}.${infer R}`
		? K extends keyof T
			? PathPropType<T[K], R>
			: unknown
		: unknown;

	export type CamelCaseToPascalCase<T extends string> =
		T extends `${infer FirstLetter}${infer _Rest}` ? `${Capitalize<FirstLetter>}${_Rest}` : T;
}

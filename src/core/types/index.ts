import type { ValidationRuleObject } from "fastest-validator";

import {
	FIELD_SCHEMA_IDENTIFIER_KEY,
	FORM_SCHEMA_IDENTIFIER_KEY,
	ALIAS_IDENTIFIER_KEY,
	NATIVE_ALIAS,
} from "@core/config";

export declare namespace SchemaBase {
	export type Form = { [k: string]: Form | { [K in keyof Schema.Field<any>]: any } };
	// export type Form = Record<string, any>;

	export type Field<T extends Alias.Base = Alias.Native, C extends keyof T = keyof Alias.Native> = {
		as: C;
		props?: T[C] extends React.FC<infer R> ? R : never;
		rules?: ValidationRuleObject | string;
	};
}

export declare namespace Schema {
	export type Form<S extends SchemaBase.Form> = {
		[K in Utils.Leaves<S>]: Utils.PathPropType<S, K> extends Schema.Field
			? Utils.PathPropType<S, K>
			: SchemaBase.Field;
	};

	export type Field<
		A extends Alias.Base = Alias.Native,
		T extends keyof A = keyof Alias.Native
	> = SchemaBase.Field<A, T> & { [key in typeof ALIAS_IDENTIFIER_KEY]: Alias.Base } & {
		[key in typeof FIELD_SCHEMA_IDENTIFIER_KEY]: symbol;
	};
}

export declare namespace Alias {
	export type Base = Record<string, React.FC<any>>;
	export type Native = typeof NATIVE_ALIAS;
}

export declare namespace Utils {
	type Prev = [
		never,
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		16,
		17,
		18,
		19,
		20,
		...0[]
	];

	type Join<K, P> = K extends string | number
		? P extends string | number
			? `${K}${"" extends P ? "" : "."}${P}`
			: never
		: never;

	export type Paths<T, D extends number = 10> = [D] extends [never]
		? never
		: T extends object
		? {
				[K in keyof T]-?: K extends string | number ? `${K}` | Join<K, Paths<T[K], Prev[D]>> : never;
		  }[keyof T]
		: "";

	export type Leaves<T, D extends number = 20> = [D] extends [never]
		? never
		: T extends Schema.Field<any, any>
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

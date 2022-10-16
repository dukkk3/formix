export type ValidateFn = (
	value: FormValuePrimitive,
	meta: {
		name: string;
	}
	// error?: string
) => Promise<string> | string;

export interface FormSchema extends Record<string, any> {}
export interface CompiledFormSchema<T extends FormSchema> {
	fields: {
		[K in FormFieldPaths<T>]: DeepPropType<T, K> extends FormValuePrimitive
			? DeepPropType<T, K>
			: never;
	};
	groups: {
		[K in FormGroupPaths<T>]: string[];
	};
}

export type FormElementPrimitive = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
export type FormValuePrimitive = string | boolean | number | string[] | boolean[] | number[];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ArrayShift<T extends any[]> = T extends [infer _, ...infer Tail] ? Tail : never;

export type FormGroupPaths<T, D extends number = 3> = [D] extends [never]
	? never
	: T extends FormValuePrimitive
	? ""
	: T extends object
	? {
			[K in keyof T]-?: K extends string | number
				?
						| `${K}${T[K] extends FormValuePrimitive ? "" : ".*"}`
						| JoinKeys<K, FormGroupPaths<T[K], Prev[D]>>
				: never;
	  }[keyof T]
	: "";

export type FormFieldPaths<T, D extends number = 3> = [D] extends [never]
	? never
	: T extends FormValuePrimitive
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

export type KeysMatching<T extends object, V> = {
	[K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

export type IfEquals<T, U, Y = true, N = false> = (<G>() => G extends T ? 1 : 2) extends <
	G
>() => G extends U ? 1 : 2
	? Y
	: N;

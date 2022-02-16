import { useLocalObservable } from "mobx-react-lite";

import { fieldSchema, formSchema, storeSchema } from "@core/helpers";
import type {
	Alias,
	FormSchema,
	FieldSchema,
	FormSchemaBase,
	FieldSchemaBase,
	UseFieldReturnType,
	UseFormixReturnType,
} from "@core/types";

function useLocalStore<T extends Record<string, any>>(base: T) {
	return useLocalObservable(() => storeSchema(base));
}

export function useFormix<T extends FormSchemaBase | FormSchema<any>>(
	schema: T
): UseFormixReturnType<T extends FormSchema<infer R> ? R : T extends FormSchemaBase ? T : never> {
	return null as any;
}

export function useField<T extends keyof Alias>(
	base: Partial<FieldSchemaBase<T>> | FieldSchema<T> | string | boolean
): UseFieldReturnType<T> {
	return null as any;
}

const formix = useFormix({
	user: {
		firstname: "",
		surname: "",
	},
});

const q = fieldSchema({ as: "input" });
const nameField = useField("");

nameField.getProp("hello");

formix.$("user.firstname").validate();
formix.isValid("user.*");

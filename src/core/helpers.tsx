import React, { forwardRef } from "react";

import { FORM_SCHEMA_SYMBOL, FIELD_SCHEMA_SYMBOL, CHECKED_INPUT_TYPES } from "../constants";

import {
	isInputElement,
	isSelectElement,
	isTextAreaElement,
	deepObjectEntries,
	removeDuplicateElements,
} from "./utils";
import type {
	AliasBase,
	ValidateFn,
	FormSchema,
	StoreSchema,
	FieldSchema,
	FormSchemaBase,
	StoreSchemaBase,
	FieldSchemaBase,
	FormValuePrimitive,
	FormElementPrimitive,
} from "./types";

export function formSchema<T extends FormSchemaBase>(schema: FormSchema<T> | T): FormSchema<T> {
	if ((schema as any)[FORM_SCHEMA_SYMBOL]) {
		return schema as any;
	}

	const entries = deepObjectEntries(
		schema,
		(_, value) => !isFieldSchema(value) && !isFieldValuePrimitive(value)
	);

	const fields = entries
		.filter(([, value]) => isFieldValuePrimitive(value) || isFieldSchema(value))
		.map(([key, value]) => [
			key,
			isFieldValuePrimitive(value) ? field({ defaultValue: value }) : value,
		]);

	const groups = entries
		.filter(([entryKey]) => fields.every(([key]) => key !== entryKey))
		.map(([entryKey]) => [
			`${entryKey}.*`,
			fields.filter(([key]) => key.includes(entryKey)).map(([key]) => key),
		]);

	return {
		[FORM_SCHEMA_SYMBOL]: { fields: Object.fromEntries(fields), groups: Object.fromEntries(groups) },
	};
}

export function field<T extends FormValuePrimitive>(
	schema: FieldSchema<T> | FieldSchemaBase<T>
): FieldSchema<T> {
	if ((schema as any)[FIELD_SCHEMA_SYMBOL]) {
		return schema as any;
	}

	return {
		[FIELD_SCHEMA_SYMBOL]: schema as any,
	};
}

export function storeSchema<S extends StoreSchemaBase>(object: S) {
	return Object.entries(object).reduce(
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

export function validateFactory<T extends any[]>(validateFn: (...args: T) => ValidateFn) {
	return validateFn;
}

export function validationChain(...args: ValidateFn[]): ValidateFn {
	return async (value, fieldName) => {
		let error: string = "";

		for (const validate of args) {
			error = await Promise.resolve(validate(value, fieldName));

			if (error) {
				break;
			}
		}

		return error;
	};
}

type FieldProps<T extends AliasBase, K extends keyof T> = { as: K } & (T[K] extends React.FC<
	infer R
>
	? R
	: {});

export function fieldFactory<T extends AliasBase>(
	alias: T
): <K extends keyof T>(props: FieldProps<T, K> & { ref?: React.ForwardedRef<any> }) => JSX.Element;
export function fieldFactory<T extends AliasBase, D extends keyof T>(
	alias: T,
	def: D
): <K extends keyof T = D>(
	props: Omit<FieldProps<T, K>, "as"> &
		Partial<Pick<FieldProps<T, K>, "as">> & { ref?: React.ForwardedRef<any> }
) => JSX.Element;

export function fieldFactory(alias: any, def?: any) {
	return forwardRef(({ as, ...rest }: any, ref: any) => {
		const Component = alias[def || as];
		return <>{Component ? <Component ref={ref} {...(rest as any)} /> : null}</>;
	}) as any;
}

export function syncFieldsValues(fields: FormElementPrimitive[], value: FormValuePrimitive) {
	if (Array.isArray(value)) {
		fields.forEach((field) => {
			if (isSelectElement(field)) {
				field
					.querySelectorAll("option")
					.forEach((option) => (option.selected = value.includes(option.value)));
			} else if (isInputElement(field) || isTextAreaElement(field)) {
				if (isInputElement(field) && CHECKED_INPUT_TYPES.includes(field.type)) {
					field.checked = value.includes(field.value);
				} else {
					field.value = value[0] || "";
				}
			}
		});
	} else if (typeof value === "boolean") {
		fields.forEach((field) => {
			if (isInputElement(field)) {
				field.checked = value;
			}
		});
	} else {
		fields.forEach((field) => {
			if (isSelectElement(field)) {
				field
					.querySelectorAll("option")
					.forEach((option) => (option.selected = value === option.value));
			} else if (isInputElement(field) && CHECKED_INPUT_TYPES.includes(field.type)) {
				field.checked = field.value === value;
			} else if (isInputElement(field) || isTextAreaElement(field)) {
				field.value = value;
			}
		});
	}
}

export function collectFieldsValues(field: FormElementPrimitive, value: FormValuePrimitive) {
	if (Array.isArray(value)) {
		if (isSelectElement(field)) {
			const selectedOptionsValues = Array.from(field.selectedOptions).map((option) => option.value);
			return field.multiple
				? removeDuplicateElements([...value, ...selectedOptionsValues])
				: removeDuplicateElements(selectedOptionsValues);
		} else if (isInputElement(field) && CHECKED_INPUT_TYPES.includes(field.type)) {
			return removeDuplicateElements(
				field.checked ? [...value, String(field.value)] : value.filter((value) => value !== field.value)
			);
		} else if (isInputElement(field) || isTextAreaElement(field)) {
			return [field.value || ""];
		}
	} else if (typeof value === "boolean" && isInputElement(field)) {
		return Boolean(field.checked);
	}

	return String(field.value);
}

export function isFieldSchema(object: any): object is FieldSchema<any> {
	return Boolean(object[FIELD_SCHEMA_SYMBOL]);
}

export function isFieldValuePrimitive(object: any): object is FormValuePrimitive {
	return Array.isArray(object) || ["string", "boolean"].includes(typeof object);
}

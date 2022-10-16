import { array, dom, common, object } from "../packages/common-utils";

import {
	FormElementPrimitive,
	ValidateFn,
	FormValuePrimitive,
	FormSchema,
	CompiledFormSchema,
} from "./types";

const CHECKED_INPUT_TYPES = ["radio", "checkbox"];

export function syncFieldsValues(fields: FormElementPrimitive[], value: any) {
	if (Array.isArray(value)) {
		fields.forEach((field) => {
			if (dom.isSelectElement(field)) {
				field
					.querySelectorAll("option")
					.forEach((option) => (option.selected = value.includes(option.value)));
			} else if (dom.isInputElement(field) || dom.isTextAreaElement(field)) {
				if (dom.isInputElement(field) && CHECKED_INPUT_TYPES.includes(field.type)) {
					field.checked = value.includes(field.value);
				} else {
					field.value = value[0] || "";
				}
			}
		});
	} else if (typeof value === "boolean") {
		fields.forEach((field) => {
			if (dom.isInputElement(field)) {
				field.checked = value;
			}
		});
	} else {
		fields.forEach((field) => {
			if (dom.isSelectElement(field)) {
				field
					.querySelectorAll("option")
					.forEach((option) => (option.selected = value === option.value));
			} else if (dom.isInputElement(field) && CHECKED_INPUT_TYPES.includes(field.type)) {
				field.checked = field.value === value;
			} else if (dom.isInputElement(field) || dom.isTextAreaElement(field)) {
				field.value = String(value);
			}
		});
	}
}

export function collectFieldsValues(field: FormElementPrimitive, value: any) {
	let collectedValue = value;

	if (Array.isArray(value)) {
		if (dom.isSelectElement(field)) {
			const selectedOptionsValues = Array.from(field.selectedOptions).map((option) => option.value);
			collectedValue = array.removeDuplicates(selectedOptionsValues);
		} else if (dom.isInputElement(field) && CHECKED_INPUT_TYPES.includes(field.type)) {
			collectedValue = array.removeDuplicates(
				field.checked ? [...value, String(field.value)] : value.filter((value) => value !== field.value)
			);
		} else if (dom.isInputElement(field) || dom.isTextAreaElement(field)) {
			collectedValue = [field.value ?? ""];
		}
	} else if (typeof value === "boolean" && dom.isInputElement(field)) {
		collectedValue = Boolean(field.checked);
	} else {
		collectedValue = field.value;
	}

	if (typeof value === "boolean") {
		collectedValue = Array.isArray(collectedValue)
			? collectedValue.map(Boolean)
			: Boolean(collectedValue);
	} else if (typeof value === "number") {
		collectedValue = Array.isArray(collectedValue)
			? collectedValue.map(common.safeNumber)
			: common.safeNumber(collectedValue);
	}

	return collectedValue;
}

export function validateFactory<T extends any[]>(validateFn: (...args: T) => ValidateFn) {
	return validateFn;
}

export function validationCompose(...args: ValidateFn[]): ValidateFn {
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

function isFormValue(value: any): value is FormValuePrimitive {
	return Array.isArray(value) || ["string", "number", "boolean"].includes(typeof value);
}

export function compileFormSchema<T extends FormSchema>(schema: T): CompiledFormSchema<T> {
	const entries = object.deepEntries(schema, (_, value) => !isFormValue(value));

	const fields = entries
		.filter(([, value]) => isFormValue(value))
		.map(([key, value]) => [key, value]);

	const groups = entries
		.filter(([entryKey]) => fields.every(([key]) => key !== entryKey))
		.map(([entryKey]) => [
			`${entryKey}.*`,
			fields.filter(([key]) => key.includes(entryKey)).map(([key]) => key),
		]);

	return {
		fields: fields.reduce((acc, [name, value]) => ({ ...acc, [name]: value }), {}),
		groups: groups.reduce((acc, [name, value]) => ({ ...acc, [name as string]: value }), {}),
	} as any;
}

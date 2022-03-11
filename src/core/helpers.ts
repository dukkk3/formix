import FastestValidator, { ValidatorConstructorOptions } from "fastest-validator";
import {
	FORM_SCHEMA_SYMBOL,
	FIELD_SCHEMA_SYMBOL,
	FORM_SCHEMA_FIELDS_SYMBOL,
	FORM_SCHEMA_GROUPS_SYMBOL,
} from "../config";
import { deepObjectEntries } from "./utils";
import type {
	Alias,
	FormSchema,
	FieldSchema,
	StoreSchema,
	FormSchemaKey,
	FormSchemaBase,
	FieldSchemaKey,
	FieldSchemaBase,
	FormPrimitiveElement,
	FormValuePrimitive,
} from "./types";

export function fieldSchema<T extends keyof Alias, P extends FieldSchemaBase<T> | FieldSchema<T>>(
	base: Partial<FieldSchemaBase<T>> & Pick<FieldSchemaBase<T>, "initialValue">
): P extends { [key in FieldSchemaKey]: any }
	? P
	: T extends FieldSchemaBase<any>
	? FieldSchema<T>
	: never {
	if ((base as any)[FIELD_SCHEMA_SYMBOL]) {
		return base as any;
	}

	return {
		[FIELD_SCHEMA_SYMBOL]: {
			as: "" as any,
			rules: null,
			...base,
		},
	} as any;
}

export function formSchema<T extends FormSchemaBase | FormSchema<any>>(
	base: T
): T extends { [key in FormSchemaKey]: any }
	? T
	: T extends FormSchemaBase
	? FormSchema<T>
	: never {
	if ((base as any)[FORM_SCHEMA_SYMBOL]) {
		return base as any;
	}

	const baseEntries = deepObjectEntries(
		base as any,
		(_, value) => !(typeof value === "object" && value[FIELD_SCHEMA_SYMBOL])
	);

	const rawFields = baseEntries
		.filter(([_, value]) => Array.isArray(value) || typeof value !== "object")
		.map(([key, value]) => [key, fieldSchema({ initialValue: value })]);

	const fields = [...rawFields, ...baseEntries].filter(
		([_, value]) => typeof value === "object" && value[FIELD_SCHEMA_SYMBOL]
	);

	const groups = baseEntries
		.filter(([baseEntryKey]) => fields.every(([key]) => key !== baseEntryKey))
		.map(([baseEntryKey]) => [
			`${baseEntryKey}.*`,
			fields.filter(([key]) => (key as string).includes(baseEntryKey)).map(([key]) => key),
		]);

	return {
		[FORM_SCHEMA_SYMBOL]: {
			[FORM_SCHEMA_FIELDS_SYMBOL]: Object.fromEntries(fields) as any,
			[FORM_SCHEMA_GROUPS_SYMBOL]: Object.fromEntries(groups) as any,
		},
	} as any;
}

export function storeSchema<S extends Record<string, any>>(object: S) {
	const entries = Object.entries(object);

	return entries.reduce(
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

export function makeValidate(options: ValidatorConstructorOptions = {}) {
	const validator = new FastestValidator(options);

	return (values: any, schema: any) => {
		const check = validator.compile(schema);
		const errors = check(values);

		if (Array.isArray(errors)) {
			return errors.reduce((acc, error) => ({ ...acc, [error.field]: error.message }), {});
		}

		return {};
	};
}

export const defaultValidate = makeValidate();

export function setFieldValue(
	element: NonNullable<FormPrimitiveElement>,
	value: FormValuePrimitive
) {
	const isValueArray = Array.isArray(value);
	const isValueBoolean = !isValueArray && typeof value === "boolean";

	const isSelectElement = element.tagName === "SELECT";
	const isInputElement = !isSelectElement && element.tagName === "INPUT";
	const isRadioElement = isInputElement && element.type === "radio";
	const isCheckboxElement = isInputElement && element.type === "checkbox";
	// console.log(element, value);
	if (isSelectElement) {
		const options = element.querySelectorAll("option");
		options.forEach((option) => {
			if ((isValueArray && value.includes(option.value)) || value === option.value) {
				option.setAttribute("selected", "");
			} else {
				option.removeAttribute("selected");
			}
		});
	} else if (isRadioElement) {
		const source = element.closest("form") || document;
		const similarInputs = source.querySelectorAll<HTMLInputElement>(`input[name="${element.name}"]`);

		similarInputs.forEach((input) => {
			input.checked = input.value === value;
		});
	} else if (isCheckboxElement) {
		if (isValueArray) {
			const source = element.closest("form") || document;
			const similarInputs = source.querySelectorAll<HTMLInputElement>(`input[name="${element.name}"]`);

			similarInputs.forEach((input) => {
				input.checked = value.includes(input.value);
			});
		} else if (isValueBoolean) {
			(element as HTMLInputElement).checked = value;
		}
	} else if (isInputElement) {
		if (!isValueBoolean && !isValueArray) {
			element.value = value;
		}
	}
}

export function getNewFieldValue(
	element: NonNullable<FormPrimitiveElement>,
	value: FormValuePrimitive
) {
	const isValueArray = Array.isArray(value);

	const isSelectElement = element.tagName === "SELECT";
	const isInputElement = !isSelectElement && element.tagName === "INPUT";
	const isRadioElement = isInputElement && element.type === "radio";
	const isCheckboxElement = isInputElement && element.type === "checkbox";

	if (isSelectElement) {
		const typeSafeElement = element as HTMLSelectElement;
		return typeSafeElement.multiple
			? [...typeSafeElement.selectedOptions].map((option) => option.value)
			: typeSafeElement.value;
	} else if (isRadioElement) {
		// const typeSafeElement = element as HTMLInputElement;
		const source = element.closest("form") || document;
		const similarInputs = source.querySelectorAll<HTMLInputElement>(`input[name="${element.name}"]`);
		return [...similarInputs].filter((input) => input.checked).map((input) => input.value)[0] || "";
	} else if (isCheckboxElement) {
		const typeSafeElement = element as HTMLInputElement;
		const source = element.closest("form") || document;
		const similarInputs = source.querySelectorAll<HTMLInputElement>(`input[name="${element.name}"]`);

		if (similarInputs.length > 0) {
			return isValueArray
				? [...similarInputs].filter((input) => input.checked).map((input) => input.value)
				: typeSafeElement.checked;
		}
	}

	return element.value;
}

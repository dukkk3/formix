import { useMemo } from "react";

import { FormixOptions, useFormix, UseFormixReturnType } from "./useFormix";
import { ArrayShift, ValidateFn } from "../types";

type FieldSchema<T> = { field: T };

export type UseFieldReturnType<T> = {
	[K in keyof Omit<
		UseFormixReturnType<FieldSchema<T>>,
		"getErrors" | "getError" | "getValues" | "setValues" | "setErrors"
	>]: (
		...params: ArrayShift<Parameters<UseFormixReturnType<FieldSchema<T>>[K]>>
	) => ReturnType<UseFormixReturnType<FieldSchema<T>>[K]>;
};

export function useField<T>(
	value: T,
	{
		validate,
		...options
	}: Omit<FormixOptions<FieldSchema<T>>, "validates"> & { validate?: ValidateFn } = {}
): UseFieldReturnType<T> {
	const formix = useFormix<FieldSchema<any>>(
		{ field: value },
		{ ...options, validates: { field: validate ?? null } }
	);

	return useMemo(
		() => ({
			ContextProvider: formix.ContextProvider,
			getValue() {
				return formix.getValue("field");
			},
			setValue(value) {
				return formix.setValue("field", value as any);
			},
			setError(error) {
				return formix.setError("field", error);
			},
			reset() {
				return formix.reset();
			},
			resetErrors() {
				return formix.resetErrors();
			},
			resetValues() {
				return formix.resetErrors();
			},
			bind(options) {
				return formix.bind("field", options);
			},
			validate() {
				return formix.validate();
			},
			isValid() {
				return formix.isValid();
			},
			getIsFormValid() {
				return formix.getIsFormValid();
			},
			haveError() {
				return formix.haveError("field");
			},
		}),
		[formix]
	);
}

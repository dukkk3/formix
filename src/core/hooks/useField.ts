import { useMemo } from "react";

import { FormixOptions, useFormix, UseFormixReturnType } from "./useFormix";
import { ArrayShift, FormValuePrimitive } from "../types";

type FieldSchema<T extends FormValuePrimitive> = { field: T };

export type UseFieldReturnType<T extends FormValuePrimitive> = {
	[K in keyof Omit<
		UseFormixReturnType<FieldSchema<T>>,
		"getErrors" | "getError" | "getValues" | "setValues"
	>]: (
		...params: ArrayShift<Parameters<UseFormixReturnType<FieldSchema<T>>[K]>>
	) => ReturnType<UseFormixReturnType<FieldSchema<T>>[K]>;
};

export function useField<T extends FormValuePrimitive>(
	value: T,
	options?: FormixOptions
): UseFieldReturnType<T> {
	const formix = useFormix<FieldSchema<any>>({ field: value }, options);

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

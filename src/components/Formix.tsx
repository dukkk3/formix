import React, { forwardRef, useCallback } from "react";

import { useFormix, UseFormixReturnType } from "../core/hooks";
import type {
	FormSchema,
	FormSchemaBase,
	FormSchemaSymbol,
	ConvertFieldToFormPrimitiveValue,
} from "../core/types";

export const Formix = forwardRef(
	<T extends FormSchemaBase>({ schema, children, onSubmit, ...rest }: Props<T>, ref: any) => {
		const formix = useFormix(schema);

		const handleSubmit = useCallback(
			async (event: React.FormEvent<HTMLFormElement>) => {
				event.preventDefault();

				const isValid = await formix.validate();

				if (isValid) {
					if (onSubmit) {
						onSubmit(formix.getValues());
					} else {
						const target = event.target as HTMLFormElement;
						target.submit();
					}
				}
			},
			[formix, onSubmit]
		);

		return (
			<form ref={ref} onSubmit={handleSubmit} {...rest}>
				{children(formix as any)}
			</form>
		);
	}
) as <T extends FormSchemaBase>(
	props: Props<T> & { ref?: React.ForwardedRef<HTMLFormElement> }
) => JSX.Element;

export interface Props<T extends FormSchemaBase>
	extends Omit<React.ComponentProps<"form">, "onSubmit"> {
	schema: T | FormSchema<T>;
	children: (formix: Omit<UseFormixReturnType<T>, "Form" | "bindForm">) => React.ReactNode;
	onSubmit?: (values: {
		[K in keyof FormSchema<T>[FormSchemaSymbol]["fields"]]: ConvertFieldToFormPrimitiveValue<
			FormSchema<T>[FormSchemaSymbol]["fields"][K]
		>;
	}) => void;
}

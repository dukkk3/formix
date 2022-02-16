import React, { forwardRef } from "react";

import { useFormix } from "@core/hooks";
import { FormSchemaBase, FormSchema, UseFormixReturnType } from "@core/types";

export const Form = forwardRef(
	<T extends FormSchemaBase | FormSchema<any>>({ schema, children }: Props<T>, ref: any) => {
		const formix = useFormix(schema);

		return <form ref={ref}>{children(formix as any)}</form>;
	}
) as <T extends FormSchemaBase | FormSchema<any>>(
	props: Props<T> & { ref?: React.ForwardedRef<HTMLFormElement> }
) => JSX.Element;

export type Props<T extends FormSchemaBase | FormSchema<any>> = {
	schema: T;
	children: (
		formix: UseFormixReturnType<
			T extends FormSchema<infer R> ? R : T extends FormSchemaBase ? T : never
		>
	) => React.ReactNode;
};

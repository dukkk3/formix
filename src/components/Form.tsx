import React, { forwardRef, useCallback } from "react";
import { common } from "../packages/common-utils";

export interface Props extends Omit<React.ComponentProps<"form">, "ref" | "children"> {}

export const Form = forwardRef<HTMLFormElement, React.PropsWithChildren<Props>>(
	({ onSubmit, ...rest }, ref) => {
		const handleSubmit = useCallback((event: React.FormEvent) => {
			event.preventDefault();
		}, []);

		return (
			<form ref={ref} noValidate {...rest} onSubmit={common.mergeCallbacks(handleSubmit, onSubmit)} />
		);
	}
);

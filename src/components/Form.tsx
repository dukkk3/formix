import React from "react";

import { useFormix } from "@core/hooks";
import { Schema, SchemaBase, SchemaFormKind, UseFormix } from "@core/types";

export const Form = <S extends SchemaFormKind<any>>({ children, schema }: Props<S>) => {
	const formix = useFormix(schema as any);

	return <form>{children(formix)}</form>;
};

export type Props<S extends SchemaFormKind<any>> = {
	children: (formix: UseFormix<S extends SchemaFormKind<infer R> ? R : never>) => React.ReactNode;
	schema: S;
};

import React, { forwardRef } from "react";

import { DEFAULT_ALIAS } from "@config";
import { Alias } from "@core/types";

export const Field = forwardRef(<T extends keyof Alias>({ as, ...rest }: Props<T>, ref: any) => {
	const Children = DEFAULT_ALIAS[as];

	return <>{Children ? <Children ref={ref} {...(rest as any)} /> : null}</>;
}) as <T extends keyof Alias>(props: Props<T> & { ref?: React.ForwardedRef<any> }) => JSX.Element;

export type Props<T extends keyof Alias> = {
	as: T;
} & (Alias[T] extends React.FC<infer R> ? (R extends Record<string, any> ? R : {}) : {});

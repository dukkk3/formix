import React, { forwardRef } from "react";

import { ALIAS_IDENTIFIER_KEY } from "@core/config";
import type { Alias } from "@core/types";

export const Field = <T extends Alias.Base, C extends keyof T>({
	as,
	[ALIAS_IDENTIFIER_KEY]: alias,
	...rest
}: Props<T, C>) => {
	// @ts-ignore
	const Children = alias[as];

	return <Children {...(rest as any)} />;
};

export type Props<T extends Alias.Base, C extends keyof T> = {
	as: T;
} & { [K in typeof ALIAS_IDENTIFIER_KEY]: C } & (T[C] extends React.FC<infer R>
		? R extends object
			? R
			: {}
		: {});

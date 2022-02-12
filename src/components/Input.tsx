import React, { forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
	return <input ref={ref} {...props} />;
});

export interface Props extends React.ComponentProps<"input"> {
	hello: boolean;
}

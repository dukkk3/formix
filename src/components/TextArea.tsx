import React, { forwardRef } from "react";

export const TextArea = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
	return <textarea ref={ref} {...props} />;
});

export interface Props extends React.ComponentProps<"textarea"> {}

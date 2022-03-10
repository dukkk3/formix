import React, { forwardRef } from "react";

export const Select = forwardRef<HTMLSelectElement, Props>((props, ref) => {
	return <select ref={ref} {...props} />;
});

export interface Props extends React.ComponentProps<"select"> {}

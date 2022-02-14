import React, { forwardRef } from "react";

export const Input: React.FC<Props> = (props) => {
	return <input {...props} />;
};

export interface Props extends React.ComponentProps<"input"> {
	hello: boolean;
}

import React, { forwardRef } from "react";

export const Select = forwardRef<HTMLSelectElement, Props>(
	({ children, options, ...rest }, ref) => {
		return (
			<select ref={ref} {...rest}>
				{options?.map((option, index) => (
					<option key={`option-${index}`} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		);
	}
);

export interface Props extends React.ComponentProps<"select"> {
	options?: { label: string; value: string }[];
}

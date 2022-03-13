import React, { forwardRef } from "react";

import { fieldFactory } from "../core/helpers";

const Input = forwardRef<HTMLInputElement, React.ComponentProps<"input">>((props, ref) => {
	return <input ref={ref} {...props} />;
});

const Select = forwardRef<HTMLSelectElement, React.ComponentProps<"select">>((props, ref) => {
	return <select ref={ref} {...props} />;
});

const TextArea = forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>((props, ref) => {
	return <textarea ref={ref} {...props} />;
});

export const Field = fieldFactory(
	{
		input: Input,
		select: Select,
		textArea: TextArea,
	},
	"input"
);

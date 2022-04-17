# React-Formix

react-formix is a package that allows you to quickly and easily create controlled forms

#### Description is in progress 👨‍💻

There may be inaccuracies and incomprehensible examples :)

## Get Started

### 🐇 Quick Start

```git
  npm i react-formix mobx
```

```js
import React from "react";
import { useFormix } from "react-formix";

export const Form: React.FC = () => {
	const myForm = useFormix({
		user: {
			firstname: "",
			surname: "",
		},
	});

	return (
		<form>
			<input {...myForm.bind("user.firstname")} />
			<input {...myForm.bind("user.surname")} />
		</form>
	);
};
```

## Hooks

### useFormix

```js
import React from "react";
import { useFormix } from "react-formix";

export const Form: React.FC = () => {
	const myForm = useFormix({
		user: {
			firstname: "",
			surname: "",
		},
	});

	return (
		<form>
			<input {...myForm.bind("user.firstname")} />
			<input {...myForm.bind("user.surname")} />
			{/* OR */}
			<input {...myForm.$("user.firstname").bind()} />
			<input {...myForm.$("user.surname").bind()} />
		</form>
	);
};
```

### useField

```js
import React from "react";
import { useField } from "react-formix";

export const MyField: React.FC = () => {
	const myField = useField("fieldname", { defaultValue: "" });
	return <input {...myField.bind()} />;
};
```

## Components

### Formix

```js
import React from "react";
import { Formix } from "react-formix";

export const MyForm: React.FC = () => {
	return (
		<Formix schema={{ user: { firstname: "", surname: "" } }}>
			{({ $, bind }) => {
				return (
					<>
						<input {...bind("user.firstname")} />
						<input {...bind("user.surname")} />
					</>
				);
			}}
		</Formix>
	);
};
```

### Field

Field is a simple component that renders the required field from the available ones (by default: input, textArea or select) and passes props to it.

```js
import React from "react";
import { useFormix, Field } from "react-formix";

export const MyForm: React.FC = () => {
	const myForm = useFormix({ nickname: "" });

	return (
		<form>
			{/* As input */}
			<Field {...myForm.bind("nickname")} />
			{/* Or */}
			<Field as='input' {...myForm.bind("nickname")} />
			{/* As select */}
			<Field as='select' {...myForm.bind("nickname")} />
			{/* As textArea */}
			<Field as='textArea' {...myForm.bind("nickname")} />
		</form>
	);
};
```

or you can create a custom Field

```js
import React, { forwardRef } from "react";
import { useFormix, fieldFactory } from "react-formix";

export const MyInput = forwardRef<HTMLInputElement, React.ComponentProps<"input">>((props, ref) => {
	return <input {...props} ref={ref} style={{ color: "red" }} />;
});

export const MyTextarea = forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
	(props, ref) => {
		return <textarea {...props} ref={ref} style={{ color: "red" }} />;
	}
);

export const MyField = fieldFactory(
	{
		myInput: MyInput,
		myTextarea: MyTextarea,
		// you can pass the default key (in this case: myInput)
	},
	"myInput"
);

export const MyForm: React.FC = () => {
	const myForm = useFormix({ nickname: "" });

	return (
		<form>
			<MyField {...myForm.bind("nickname")} />
			{/* Or */}
			<MyField as='myInput' {...myForm.bind("nickname")} />
			<MyField as='myTextarea' {...myForm.bind("nickname")} />
		</form>
	);
};
```

## Helpers

### formSchema

```js
import React from "react";
import { useFormix, formSchema, field } from "react-formix";

const schema = formSchema({
	user: {
		firstname: "",
		surname: field({
			defaultValue: "",
			validate: (value) => (typeof value === "string" && value.includes("test") ? "some error" : ""),
		}),
	},
});

export const MyForm: React.FC = () => {
	const myForm = useFormix(schema);
	return (
		<form>
			<input {...myForm.$("user.firstname").bind()} />
			<input {...myForm.$("user.surname").bind()} />
			{/* OR */}
			<input {...myForm.bind("user.firstname")} />
			<input {...myForm.bind("user.surname")} />
		</form>
	);
};
```

### field

```js
import React from "react";
import { useField, field, Field } from "react-formix";

const firstnameField = field({
	defaultValue: "",
	validate: (value) => (typeof value === "string" && value.includes("test") ? "some error" : ""),
});

export const MyForm: React.FC = () => {
	const myField = useField("firstname", firstnameField);
	return (
		<form>
			<input {...myField.bind()} />
		</form>
	);
};
```

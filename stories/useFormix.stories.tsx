import React, { useCallback, useEffect, useRef } from "react";
import { field, formSchema, useFormix } from "../src";
import { Observer } from "mobx-react-lite";
import { reaction } from "mobx";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	title: "useFormix",
	component: Form,
};

function Form() {
	const formix = useFormix({ user: { name: "" } });

	return (
		<form>
			<input placeholder='name' {...formix.$("user.name").bind()} />
			<Observer>{() => <p>username: {formix.$("user.name").getValue()}</p>}</Observer>
		</form>
	);
}

function FormWithValidation() {
	const formix = useFormix({
		user: {
			name: field({
				defaultValue: "",
				validate: async (value, meta) => {
					return typeof value === "string" && value.includes("admin") ? "Ah-ah" : "";
				},
			}),
		},
	});

	const handleFormSubmit = useCallback(
		async (event: React.FormEvent) => {
			event.preventDefault();

			const validationResult = await formix.validate("user.name");

			if (validationResult) {
				alert("Alright!");
			} else {
				alert(`Error: ${formix.getError("user.name")}`);
			}
		},
		[formix]
	);

	return (
		<form onSubmit={handleFormSubmit}>
			<input placeholder='name' {...formix.$("user.name").bind()} />
			<Observer>
				{() =>
					formix.$("user.name").getError() ? <p>Last error: {formix.$("user.name").getError()}</p> : null
				}
			</Observer>
			<button type='submit'>Submit</button>
		</form>
	);
}

const userFormSchema = formSchema({
	user: {
		name: field({
			defaultValue: "",
			validate: async (value, meta) => {
				return typeof value === "string" && value.includes("admin") ? "Ah-ah" : "";
			},
		}),
		gender: "",
		roles: [],
		private: true,
	},
});

function FormWithPreparedSchema() {
	const formix = useFormix(userFormSchema);

	const handleFormSubmit = useCallback(
		async (event: React.FormEvent) => {
			event.preventDefault();

			const validationResult = await formix.validate("user.name");

			if (validationResult) {
				alert("Alright!");
			} else {
				alert(`Error: ${formix.getError("user.name")}`);
			}
		},
		[formix]
	);

	return (
		<form onSubmit={handleFormSubmit}>
			<input placeholder='name' {...formix.$("user.name").bind()} />
			<select {...formix.$("user.gender").bind()}>
				<option value='Male'>Male</option>
				<option value='Female'>Female</option>
			</select>
			<label>
				<input type='checkbox' {...formix.bind("user.private")} />
				Private?
			</label>
			<div>
				{["admin", "user", "owner"].map((role, index) => (
					<label key={index}>
						<input type='checkbox' value={role} {...formix.$("user.roles").bind()} />
						{role}
					</label>
				))}
			</div>
			<Observer>{() => <p>Your Name: {formix.$("user.name").getValue()}</p>}</Observer>
			<Observer>{() => <p>Selected roles: {formix.getValue("user.roles").join(", ")}</p>}</Observer>
			<Observer>{() => <p>Private: {formix.$("user.private").getValue() ? "Yes" : "No"}</p>}</Observer>
			<button type='submit'>Submit</button>
		</form>
	);
}

function FormWithReaction() {
	const formix = useFormix({ password: "" });
	const formRef = useRef<HTMLFormElement>(null);

	const submitForm = useCallback(() => {
		const form = formRef.current;

		if (!form) return;

		form.submit();
	}, []);

	const checkForPasswordCorrect = useCallback((password: string) => {
		if (password.length >= 10) {
			console.log("Ok!");
			// submitForm();
		} else {
			console.log("Invalid password");
		}
	}, []);

	useEffect(
		() =>
			reaction(
				() => formix.$("password").getValue(),
				(password) => checkForPasswordCorrect(password)
			),
		[checkForPasswordCorrect, formix]
	);

	return (
		<form ref={formRef}>
			<input type='password' {...formix.$("password").bind()} />
			<p>Min Length: 10</p>
		</form>
	);
}

export const FormSt = () => <Form />;
export const FormWithValidationSt = () => <FormWithValidation />;
export const FormWithPreparedSchemaSt = () => <FormWithPreparedSchema />;
export const FormWithReactionSt = () => <FormWithReaction />;

FormSt.story = {
	name: "Default",
};
FormWithValidationSt.story = {
	name: "Validation",
};
FormWithPreparedSchemaSt.story = {
	name: "Prepared Schema",
};
FormWithReactionSt.story = {
	name: "With Reaction",
};

import React, { useCallback, useEffect, useState } from "react";
import { fastestValidate, useFormix, Form as FormImpl } from "../src";
import { Observer, useLocalObservable } from "mobx-react-lite";
import { reaction } from "mobx";
import { usePrevious } from "../src/core/hooks/usePrevious";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	title: "useFormix",
	component: Form,
};

function Form() {
	const formix = useFormix(
		{
			user: { name: "" },
			checked: false,
			oneOf: "",
			score: { min: 0, max: 0, current: 0 },
			role: [] as string[],
		},
		{ formValidationDebounceTime: 100 }
	);

	const validate = useCallback(() => {
		formix.validate();
		formix.setValue("user.name", "changed");
	}, [formix]);

	return (
		<FormImpl onSubmit={validate}>
			<div>
				<input {...formix.bind("score.min")} type='number' min='0' />
				<input {...formix.bind("score.max")} type='number' min='1' />
				<Observer>
					{() => (
						<input
							{...formix.bind("score.current", {
								validate: fastestValidate(
									`number|min:${formix.getValue("score.min")}|max:${formix.getValue("score.max")}`,
									{ name: "score" }
								),
							})}
							type='number'
						/>
					)}
				</Observer>
				<Observer>{() => <p>Error: {formix.getError("score.current")}</p>}</Observer>
			</div>
			<div>
				<input
					placeholder='name'
					{...formix.bind("user.name", { validate: fastestValidate("string|empty:false") })}
				/>
				<input
					placeholder='name'
					{...formix.bind("user.name", { validate: fastestValidate("string|empty:false") })}
				/>
				<Observer>{() => <p>Value: {formix.getValue("user.name")}</p>}</Observer>
				<Observer>{() => <p>Error: {formix.getError("user.name")}</p>}</Observer>
			</div>
			<div>
				<select {...formix.bind("role")} multiple>
					<option value='admin'>Admin</option>
					<option value='user'>User</option>
				</select>
				<Observer>{() => <p>Role: {formix.getValue("role")}</p>}</Observer>
			</div>
			<div>
				<input {...formix.bind("oneOf")} type='radio' value='a' radioGroup='one-of' name='one-of' />
				<input {...formix.bind("oneOf")} type='radio' value='b' radioGroup='one-of' name='one-of' />
				<input {...formix.bind("oneOf")} type='radio' value='c' radioGroup='one-of' name='one-of' />
				<Observer>{() => <p>One of: {formix.getValue("oneOf")}</p>}</Observer>
			</div>
			<div>
				<input type='checkbox' {...formix.bind("checked")} />
				<Observer>{() => <p>Checked: {String(formix.getValue("checked"))}</p>}</Observer>
			</div>
			<Observer>
				{() => (
					<div
						style={{
							width: 100,
							height: 100,
							background: formix.getIsFormValid() ? "green" : "red",
						}}></div>
				)}
			</Observer>
			<button type='submit'>Validate</button>
		</FormImpl>
	);
}

function Form2() {
	const [value, setValue] = useState(0);
	const [pending, setPending] = useState(false);

	const updateState = useCallback(() => {
		// setValue(Math.random() > 0.5 ? 1 : 0);
		setPending((prev) => !prev);
	}, []);

	return (
		<>
			<div>
				<Form3 value={value} pending={pending} />
			</div>
			<button type='button' onClick={updateState}>
				Generate
			</button>
		</>
	);
}

function Form3({ value, pending }: { value: number; pending?: boolean }) {
	const form = useFormix({ value });
	const prev = usePrevious(form);

	const k = Object.keys(form);

	console.log(
		"forms equals: ",
		form === prev,
		k.reduce(
			(acc, key) => ({
				...acc,
				[key]: form[key] === prev[key],
			}),
			{}
		)
	);
	return (
		<>
			<input {...form.bind("value")} />
			<Observer>{() => <p>Is Valid: {String(form.getIsFormValid())}</p>}</Observer>
		</>
	);
}

export const FormSt = () => <Form />;
export const Form2St = () => <Form2 />;

FormSt.story = {
	name: "Default",
};

Form2St.story = {
	name: "Default 2",
};

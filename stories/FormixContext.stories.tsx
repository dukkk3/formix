import React from "react";
import { useFormix, useFormixContext } from "../src";
import { Observer } from "mobx-react-lite";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	title: "FormixContext",
	component: FormixContext,
};

interface FormSchema {
	user: {
		name: string;
	};
}

const SubForm: React.FC = () => {
	const { $ } = useFormixContext<FormSchema>();

	return (
		<>
			<Observer>{() => <p>name: {$("user.name").getValue()}</p>}</Observer>
		</>
	);
};

function FormixContext() {
	const { $, ContextProvider } = useFormix<FormSchema>({ user: { name: "" } });

	return (
		<form>
			<input placeholder='name' {...$("user.name").bind()} />
			<ContextProvider>
				<SubForm />
			</ContextProvider>
		</form>
	);
}

export const FormSt = () => <FormixContext />;
FormSt.story = {
	name: "Default",
};

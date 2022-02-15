import { useEffect } from "react";
import { formSchema, fieldSchema, useFormix, Field } from "@core";

import { Form } from "@components/Form";

const schema = formSchema({
	surname: fieldSchema({ as: "textArea", rules: "", defaultValue: "", props: {} }),
});

const Ex = () => {
	const formix = useFormix({
		name: fieldSchema({ as: "textArea" }),
		surname: fieldSchema({ as: "input" }),
	});

	useEffect(() => {
		formix.setProp("surname", "hello", true);
		formix.$("surname").setProp("hello", true);

		// formix.validate("name.*")

		if (true) {
			formix.setProps("surname", (prevProps) => ({ ...prevProps, hello: true }));
			formix.setProps("name", (prevProps) => ({ ...prevProps }));
			formix.$("surname").setProp("hello", true);
		}
	}, [formix]);

	return (
		<Form schema={{ firstname: "" }}>
			{({ $, setProp }) => (
				<>
					<input onChange={() => $("firstname").setProp("hello", true)} />
				</>
			)}
		</Form>
	);
};

const Ex2 = () => {
	return (
		<Form
			schema={{
				firstname: fieldSchema({ as: "input", rules: "string|min:1" }),
				surname: fieldSchema({ as: "input", rules: "string|min:1" }),
				bio: fieldSchema({ as: "input", rules: "string|min:1" }),
				area: { latitude: fieldSchema({ as: "input" }), longitude: fieldSchema({ as: "input" }) },
			}}>
			{({ $ }) => (
				<>
					<Field
						{...$("area.longitude").bind()}
						onChange={() => $("surname").setProp("disabled", true)}
					/>
				</>
			)}
		</Form>
	);
};

// const Example = () => {
// 	return (
// 		<Form
// 			schema={createFor({ fieldSchema }) => ({
// 				user: {
// 					name: fieldSchema({ as: "input" }),
// 					surname: fieldSchema({ as: "input" }),
// 					birthDate: fieldSchema({ as: "select" }),
// 				},
// 			})}>
// 			{({ $, bind, getMeta, getError, getValue }) => (
// 				<>
// 					<Observer>{() => <Field {...$("insurer.name").bind()} {...bind("insurer.name")} />}</Observer>
// 					<Observer>{() => <Field {...$("insurer.surname").bind()} />}</Observer>
// 					<Observer>{() => <Field {...$("insurer.birthDate").bind()} />}</Observer>
// 					<Observer>{() => <Field {...formix.$("insurer.name").bind()} />}</Observer>
// 				</>
// 			)}
// 		</Form>
// 		// <Observer>
// 		// 	{() =>
// 		// 		formix.getArray("insurer.group").map((bind, index) => (
// 		// 			<div key={`group-${index}`}>
// 		// 				<input {...bind("name")} />
// 		// 				<input {...bind("count")} />
// 		// 			</div>
// 		// 		))
// 		// 	}
// 		// </Observer>
// 	);
// };

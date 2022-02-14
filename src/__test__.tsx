import { useEffect } from "react";
import { formSchema, fieldSchema, useFormix } from "@core";

const schema = formSchema({
	surname: fieldSchema({ as: "textArea", rules: "", defaultValue: "", props: {} }),
});

const Ex = () => {
	const formix = useFormix(({ fieldSchema }) => ({
		name: fieldSchema({ as: "textArea" }),
		surname: fieldSchema({ as: "input" }),
	}));

	useEffect(() => {
		if (formix.validate("name")) {
			formix.setProps("surname", (prevProps) => ({ ...prevProps, hello: true }));
			formix.setProps("name", (prevProps) => ({ ...prevProps }));
		}

		if (formix.validate("name")) {
			formix.$("name").setProps({ hidden: true });
		}
	}, [formix]);
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

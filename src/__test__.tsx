import { useCallback, useEffect } from "react";
import { formSchema, aliasSchema, fieldSchema, useFormix } from "@core";
import { Schema } from "@core/types";
// import { formSchema, fieldSchema, Field } from "@react-hoox/formix";

const alias = aliasSchema(({ input, select, textArea }) => ({
	$input: input,
	$select: select,
	$textArea: textArea,
}));

const schema = formSchema(
	({ fieldSchema: customFieldSchema }) => ({
		insurer: {
			hello: customFieldSchema({ as: "$input" }),
			world: fieldSchema({ as: "input" }),
		},
	}),
	alias
);

// const bind = createBind({
// 	// TODO: Решитеь это поведение. Опционально
// 	hello: fieldSchema({ as: "input" }),
// });

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

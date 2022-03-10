import React from "react";
import { Observer } from "mobx-react-lite";

import { Form, Field, useFormix, fieldSchema } from "../index";
import { useFormixTest } from "../core/hooks.new";

// export const App: React.FC = () => {
// 	return (
// 		<Form schema={{ insurer: { firstname: "" } }}>
// 			{({ $ }) => (
// 				<>
// 					<Observer>
// 						{() => <input {...$("insurer.firstname").bind()} placeholder='Firstname' />}
// 					</Observer>
// 					<button type='submit'>Submit</button>
// 				</>
// 			)}
// 		</Form>
// 	);
// };

export const App: React.FC = () => {
	const formix = useFormixTest({
		insurer: {
			firstname: [],
			roles: fieldSchema({ as: "input", initialValue: [] }),
			gender: fieldSchema({ as: "input" }),
		},
	});

	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				// console.log(formix.$("insurer.roles").getValue());
			}}>
			<Observer>
				{() => (
					<Field {...formix.bind("insurer.firstname")} as='select' multiple>
						<option value='1'>1</option>
						<option value='2'>2</option>
					</Field>
				)}
			</Observer>
			<div>
				<label>
					<Observer>
						{() => <Field {...formix.bind("insurer.roles")} type='radio' value='male' />}
					</Observer>
					<span>Male</span>
				</label>
			</div>
			<div>
				<label>
					<Observer>
						{() => <Field {...formix.bind("insurer.roles")} type='radio' value='female' />}
					</Observer>
					<span>Female</span>
				</label>
			</div>
			<button type='submit'>Submit</button>
		</form>
	);
};

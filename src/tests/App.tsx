import React from "react";
import { Observer } from "mobx-react-lite";

import { Form, Field, useFormix, fieldSchema } from "../index";
import { useFormixTest, useLocalStore } from "../core/hooks.new";

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

// export const App: React.FC = () => {
// 	const localStore = useLocalStore({ toggle: false });

// 	return (
// 		<>
// 			<Observer>
// 				{() => (
// 					<App2
// 						schema={{
// 							insurer: {
// 								firstname: [],
// 								roles: fieldSchema({ as: "input", initialValue: [] }),
// 								gender: fieldSchema({ as: "input", initialValue: "" }),
// 								accept: fieldSchema({ as: "input", initialValue: localStore.toggle.value }),
// 								bio: fieldSchema({ as: "textArea", initialValue: "" }),
// 							},
// 						}}
// 					/>
// 				)}
// 			</Observer>
// 			<button onClick={() => localStore.toggle.set(!localStore.toggle.value)}>Toggle</button>
// 		</>
// 	);
// };

export const App: React.FC<{ schema: any }> = ({ schema }) => {
	const formix = useFormixTest({
		insurer: {
			firstname: [],
			roles: fieldSchema({ as: "input", initialValue: ["hitler"] }),
			gender: fieldSchema({ as: "input", initialValue: "" }),
			accept: fieldSchema({ as: "input", initialValue: false }),
			bio: fieldSchema({ as: "textArea", initialValue: "" }),
		},
	});

	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				console.log(formix.getValues());
				// console.log(formix.$("insurer.roles").getValue());
			}}>
			<Field {...formix.bind("insurer.firstname")} as='select' multiple>
				<option value='1'>1</option>
				<option value='2'>2</option>
			</Field>
			<br />
			<br />
			<div>
				<Observer>
					{() => (
						<label>
							<Field {...formix.bind("insurer.roles")} type='checkbox' value='male' />
							<span>Male _{formix.getValues()["insurer.roles"]}_</span>
						</label>
					)}
				</Observer>
				<br />
				<label>
					<Field {...formix.bind("insurer.roles")} type='checkbox' value='female' />
					<span>Female</span>
				</label>
				<br />
				<label>
					<Field {...formix.bind("insurer.roles")} type='checkbox' value='nonGender' />
					<span>non Gender</span>
				</label>
				<Observer>
					{() =>
						(formix.getValues()["insurer.firstname"] as string[]).includes("1") ? (
							<label>
								<Field {...formix.bind("insurer.roles")} type='checkbox' value='hitler' />
								<span>hitler</span>
							</label>
						) : null
					}
				</Observer>
			</div>
			<br />
			<br />
			<div>
				<label>
					<Field {...formix.bind("insurer.gender")} type='radio' value='male' />
					<span>Male</span>
				</label>
			</div>
			<div>
				<label>
					<Field {...formix.bind("insurer.gender")} type='radio' value='female' />
					<span>Female</span>
				</label>
			</div>
			<label>
				<Field {...formix.bind("insurer.accept")} as='input' type='checkbox' />
				<span>Accept</span>
			</label>
			<Field {...formix.bind("insurer.bio")} />
			<button type='submit'>Submit</button>
			<br />
			<br />
		</form>
	);
};

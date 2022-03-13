import React from "react";
import { Observer } from "mobx-react-lite";

import { Formix, Field, field, fastestValidate, validationChain } from "../src/index";

export const App = () => (
	<Formix
		schema={{
			user: {
				firstname: field({
					defaultValue: "",
					validate: validationChain(fastestValidate("string|min:2"), (value) =>
						value === "noname" ? "nice try" : ""
					),
				}),
				middlename: "",
				roles: [],
			},
			meta: {
				accepted: false,
			},
		}}
		onSubmit={(values) => console.log(values)}>
		{({ $ }) => (
			<>
				<div>
					<Field {...$("user.firstname").bind()} />
					<Observer>{() => <p>{$("user.firstname").getError()}</p>}</Observer>
				</div>
				<div>
					<Field {...$("user.middlename").bind()} />
				</div>
				<div>
					<label>
						<Field {...$("user.roles").bind()} value='admin' type='checkbox' />
						Admin
					</label>
					<br />
					<label>
						<Field {...$("user.roles").bind()} value='user' type='checkbox' />
						User
					</label>
					<br />
					<label>
						<Field {...$("user.roles").bind()} value='superuser' type='checkbox' />
						Super User
					</label>
					<div>
						<label>
							<Field {...$("meta.accepted").bind()} type='checkbox' />
							accept
						</label>
					</div>
					<Observer>
						{() => (
							<button type='submit' disabled={!$("meta.accepted").getValue()}>
								Submit
							</button>
						)}
					</Observer>
				</div>
			</>
		)}
	</Formix>
);

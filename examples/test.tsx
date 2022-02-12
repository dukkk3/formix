import React, { useEffect } from "react";

import { createFieldSchema, createFormSchema, useFormix } from "@core";

const schema = createFormSchema(({ createFieldSchema }) => ({
	insurer: {
		firstname: createFieldSchema({ as: "input" }),
		surname: createFieldSchema({ as: "textArea" }),
		hello: {
			world: {
				fuck: {
					me: createFieldSchema({ as: "select" }),
				},
			},
		},
	},
}));

const Form: React.FC = () => {
	const formix = useFormix(schema);

	useEffect(() => {
		formix.setProps("insurer.firstname", { hello: false });
		formix.bind("insurer.hello.world.fuck.me", { hello: true });

		// formix.setValue("insurer.firstname", "");
		// formix.bind("insurer.firstname", {});
	}, []);

	return <form></form>;
};

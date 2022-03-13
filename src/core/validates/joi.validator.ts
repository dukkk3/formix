import { AnySchema } from "joi";

import { validateFactory } from "../helpers";

export const joiValidate = validateFactory((schema: AnySchema) => {
	return async (value) => {
		try {
			if (schema?.validateAsync) {
				await schema.validateAsync(value);
			}

			return "";
		} catch (error) {
			// @ts-ignore
			return error?.message || "";
		}
	};
});

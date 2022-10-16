import FastestValidator, { ValidationError, ValidationRuleObject } from "fastest-validator";
import { validateFactory } from "../helpers";

const fastestValidator = new FastestValidator();

const plugFieldName = "__formix_field__";
const replaceRegexp = new RegExp(plugFieldName, "g");

export const fastestValidate = validateFactory(
	(
		rule: string | ValidationRuleObject,
		options: { name?: string; validator?: FastestValidator } = {}
	) => {
		const check = (options.validator || fastestValidator).compile({
			$$async: true,
			[plugFieldName]: rule,
		});

		return async (value, { name }) => {
			const result = await check({ [plugFieldName]: value });

			if (result === true || !result.length) {
				return "";
			}

			const message = (result as ValidationError[])[0].message;

			return message && name
				? message.replace(replaceRegexp, options.name ?? name)
				: (message as string);
		};
	}
);

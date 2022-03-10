import { Input } from "./components/Input";
import { Select } from "./components/Select";
import { TextArea } from "./components/TextArea";

export const FIELD_SCHEMA_SYMBOL = Symbol("FIELD_SCHEMA") as unknown as "FIELD_SCHEMA";

export const FORM_SCHEMA_SYMBOL = Symbol("FORM_SCHEMA") as unknown as "FORM_SCHEMA";
export const FORM_SCHEMA_FIELDS_SYMBOL = Symbol(
	"FORM_SCHEMA_FIELDS"
) as unknown as "FORM_SCHEMA_FIELDS";
export const FORM_SCHEMA_GROUPS_SYMBOL = Symbol(
	"FORM_SCHEMA_GROUPS"
) as unknown as "FORM_SCHEMA_GROUPS";

export const DEFAULT_ALIAS = {
	input: Input,
	select: Select,
	textArea: TextArea,
};

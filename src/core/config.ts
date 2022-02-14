import { TextArea } from "@components/TextArea";
import { Select } from "@components/Select";
import { Input } from "@components/Input";

export const NATIVE_ALIAS = {
	input: Input,
	select: Select,
	textArea: TextArea,
};

export const ALIAS_IDENTIFIER_KEY = Symbol("__alias__") as unknown as "__alias__";
export const FIELD_SCHEMA_FIELDS_IDENTIFIER_KEY = Symbol("__fields__") as unknown as "__fields__";
export const FIELD_SCHEMA_GROUPS_IDENTIFIER_KEY = Symbol("__groups__") as unknown as "__groups__";
export const FORM_SCHEMA_IDENTIFIER_KEY = Symbol("__formSchema__") as unknown as "__formSchema__";
export const FIELD_SCHEMA_IDENTIFIER_KEY = Symbol(
	"__fieldSchema__"
) as unknown as "__fieldSchema__";

export type AliasKey = typeof ALIAS_IDENTIFIER_KEY;
export type FieldSchemaFieldsKey = typeof FIELD_SCHEMA_FIELDS_IDENTIFIER_KEY;
export type FieldSchemaGroupsKey = typeof FIELD_SCHEMA_GROUPS_IDENTIFIER_KEY;
export type FormSchemaKey = typeof FORM_SCHEMA_IDENTIFIER_KEY;
export type FieldSchemaKey = typeof FIELD_SCHEMA_IDENTIFIER_KEY;

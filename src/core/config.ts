import { TextArea } from "@components/TextArea";
import { Select } from "@components/Select";
import { Input } from "@components/Input";

export const NATIVE_ALIAS = {
	input: Input,
	select: Select,
	textArea: TextArea,
} as const;

export const ALIAS_IDENTIFIER_KEY = "__formixAlias__" as const;
export const FIELD_SCHEMA_IDENTIFIER_KEY = "__formixFieldSchema__" as const;
export const FORM_SCHEMA_IDENTIFIER_KEY = "__formixFormSchema__" as const;

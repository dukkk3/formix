import React, { useCallback, useMemo } from "react";
import { useLocalObservable } from "mobx-react-lite";

import {
	FIELD_SCHEMA_SYMBOL,
	FORM_SCHEMA_FIELDS_SYMBOL,
	FORM_SCHEMA_GROUPS_SYMBOL,
	FORM_SCHEMA_SYMBOL,
} from "../config";
import { fieldSchema, formSchema, storeSchema, defaultValidate } from "./helpers";
import { pickProperties } from "./utils";
import type {
	Alias,
	FormSchema,
	FieldSchema,
	FormSchemaKey,
	FormSchemaBase,
	FieldSchemaBase,
	UseFieldReturnType,
	UseFormixReturnType,
	FormValuePrimitive,
	FormSchemaFieldsKey,
	FormSchemaGroupsKey,
	CustomFormValidateFn,
	CustomFieldValidateFn,
	FieldSchemaKey,
} from "./types";

type GetFormSchemaBase<T extends FormSchemaBase | FormSchema<any>> = T extends FormSchema<infer R>
	? R
	: T extends FormSchemaBase
	? T
	: never;

type FormPrimitiveElement = HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement | null;

interface Options<T extends string> {
	validate?: CustomFormValidateFn<T>;
	// powerMode?: boolean;
}

function useLocalStore<T extends Record<string, any>>(base: T) {
	return useLocalObservable(() => storeSchema(base));
}

export function useFormixTest<
	T extends FormSchemaBase | FormSchema<any>,
	B extends GetFormSchemaBase<T>,
	F extends FormSchema<B>,
	NF extends keyof F[FormSchemaKey][FormSchemaFieldsKey],
	NG extends keyof F[FormSchemaKey][FormSchemaGroupsKey]
>(schema: T, { validate = defaultValidate }: Options<NF> = {}) {
	const formElements = useMemo(() => ({} as Record<NF, FormPrimitiveElement>), []);
	const compiledSchema = useMemo(() => formSchema(schema), [schema]);

	const formSchemaContent = useMemo(() => compiledSchema[FORM_SCHEMA_SYMBOL], [compiledSchema]);
	const fieldsSchemaContent = useMemo(
		() => formSchemaContent[FORM_SCHEMA_FIELDS_SYMBOL],
		[formSchemaContent]
	);
	const groupsSchemaContent = useMemo(
		() => formSchemaContent[FORM_SCHEMA_GROUPS_SYMBOL],
		[formSchemaContent]
	);
	const fieldsSchemaContentKeys = useMemo(
		() => Object.keys(fieldsSchemaContent) as NF[],
		[fieldsSchemaContent]
	);

	const reduceFields = useCallback(
		<T>(callback: (acc: Record<NF, T>, name: NF) => Record<NF, T>) => {
			return fieldsSchemaContentKeys.reduce((acc, key) => callback(acc, key), {} as Record<NF, T>);
		},
		[fieldsSchemaContentKeys]
	);

	const getFieldSchema = useCallback(
		(name: NF) => {
			return fieldsSchemaContent[name][FIELD_SCHEMA_SYMBOL];
		},
		[fieldsSchemaContent]
	);

	const getGroupSchema = useCallback(
		(name: NG) => {
			return groupsSchemaContent[name];
		},
		[groupsSchemaContent]
	);

	const initialValues = useMemo(() => {
		return reduceFields<FormValuePrimitive>((acc, name) => ({
			...acc,
			[name]: getFieldSchema(name)["initialValue"] || "",
		}));
	}, [reduceFields, getFieldSchema]);

	const initialErrors = useMemo(() => {
		return reduceFields<string>((acc, name) => ({ ...acc, [name]: "" }));
	}, [reduceFields]);

	const initialProps = useMemo(() => {
		return reduceFields<any>((acc, name) => ({
			...acc,
			[name]: getFieldSchema(name)["props"] || {},
		}));
	}, [reduceFields, getFieldSchema]);

	const rulesSchema = useMemo(() => {
		return reduceFields<any>((acc, name) => ({
			...acc,
			[name]: getFieldSchema(name)["rules"] || null,
		}));
	}, [reduceFields, getFieldSchema]);

	const valuesStore = useLocalStore(initialValues);
	const errorsStore = useLocalStore(initialErrors);
	const propsStore = useLocalStore(initialProps);

	const createRefHandler = useCallback(
		(name: NF) => (element: FormPrimitiveElement) => {
			const value = valuesStore[name].value;
			formElements[name] = element;

			if (element) {
				if (Array.isArray(value)) {
					if ("checked" in element) {
						element.checked = value.includes(element.value);
					} else if (element.tagName === "select") {
						element.querySelectorAll("option").forEach((option) => {
							if (value.includes(option.value)) {
								option.setAttribute("selected", "");
							} else {
								option.removeAttribute("selected");
							}
						});
					}
				} else {
					if ("checked" in element) {
						element.checked = value === element.value;
					} else {
						(element as any).value = value;
					}
				}
			}
		},
		[formElements, valuesStore]
	);

	const getNewValue = useCallback(
		(target: NonNullable<FormPrimitiveElement>, currentValue: FormValuePrimitive) => {
			const value = target.value;

			if (Array.isArray(currentValue)) {
				if ("selectedOptions" in target) {
					return [...target.selectedOptions].map((item) => item.value);
				} else if ("checked" in target) {
					const checked = Boolean(target.checked);
					console.log("ok", currentValue, [...new Set([...currentValue, value])]);
					return checked
						? [...new Set([...currentValue, value])]
						: currentValue.filter((item) => item !== value);
				} else {
					return [...new Set([...currentValue, value])];
				}
			} else if (typeof currentValue === "boolean") {
				return Boolean((target as any).checked);
			} else {
				return target.value;
			}
		},
		[]
	);

	const createChangeHandler = useCallback(
		(name: NF) => (event: React.ChangeEvent<NonNullable<FormPrimitiveElement>>) => {
			const targetElement = event.target;
			const newValue = getNewValue(targetElement, valuesStore[name].value);
			console.log(newValue);
			valuesStore[name].set(newValue);
		},
		[getNewValue, valuesStore]
	);

	const bind = useCallback(
		<N extends NF>(
			name: N
		): { as: F[FormSchemaKey][FormSchemaFieldsKey][N][FieldSchemaKey]["as"] } => {
			const ref = createRefHandler(name);
			const onChange = createChangeHandler(name);

			return {
				as: getFieldSchema(name).as,
				ref,
				onChange,
			} as any;
		},
		[createChangeHandler, createRefHandler]
	);

	return {
		bind,
	};
}

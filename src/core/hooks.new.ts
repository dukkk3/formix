import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useLocalObservable } from "mobx-react-lite";
import isDeepEqual from "react-fast-compare";

//
//
//
// TODO: Сохранение типа initialValue
// TODO: FormElements каждый элемент сделать массивом
//
//

import {
	FIELD_SCHEMA_SYMBOL,
	FORM_SCHEMA_FIELDS_SYMBOL,
	FORM_SCHEMA_GROUPS_SYMBOL,
	FORM_SCHEMA_SYMBOL,
} from "../config";
import {
	fieldSchema,
	formSchema,
	storeSchema,
	defaultValidate,
	setFieldValue,
	getNewFieldValue,
} from "./helpers";
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
	FormPrimitiveElement,
} from "./types";

type GetFormSchemaBase<T extends FormSchemaBase | FormSchema<any>> = T extends FormSchema<infer R>
	? R
	: T extends FormSchemaBase
	? T
	: never;

// type FormPrimitiveElement = HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement | null;

interface Options<T extends string> {
	validate?: CustomFormValidateFn<T>;
	// powerMode?: boolean;
}

export function useLocalStore<T extends Record<string, any>>(base: T) {
	return useLocalObservable(() => storeSchema(base));
}

export function useFormixTest<
	T extends FormSchemaBase | FormSchema<any>,
	B extends GetFormSchemaBase<T>,
	F extends FormSchema<B>,
	NF extends keyof F[FormSchemaKey][FormSchemaFieldsKey],
	NG extends keyof F[FormSchemaKey][FormSchemaGroupsKey]
>(schema: T, { validate = defaultValidate }: Options<NF> = {}) {
	const schemaRef = useRef(schema);
	const formElements = useMemo(() => ({} as Record<NF, FormPrimitiveElement>), []);

	if (!isDeepEqual(schemaRef.current, schema) || schema !== schemaRef.current) {
		schemaRef.current = schema;
	}

	const compiledSchema = useMemo(() => {
		return formSchema(schemaRef.current);
	}, [schemaRef.current]);

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
			[name]: getFieldSchema(name)["initialValue"],
		}));
	}, [reduceFields, getFieldSchema]);

	const initialErrors = useMemo(() => {
		return reduceFields<string>((acc, name) => ({ ...acc, [name]: "" }));
	}, [reduceFields]);

	const rulesSchema = useMemo(() => {
		return reduceFields<any>((acc, name) => ({
			...acc,
			[name]: getFieldSchema(name)["rules"] || null,
		}));
	}, [reduceFields, getFieldSchema]);

	const valuesStore = useLocalStore(initialValues);
	const errorsStore = useLocalStore(initialErrors);

	const setValues = useCallback(
		(values: Partial<Record<NF, FormValuePrimitive>>) => {
			fieldsSchemaContentKeys.forEach((key) => {
				const value = values[key];

				if (typeof value !== "undefined" && value !== null) {
					const element = formElements[key];

					if (element) {
						setFieldValue(element, value);
					}

					valuesStore[key].set(value as any);
				}
			});
		},
		[fieldsSchemaContentKeys, formElements, valuesStore]
	);

	const getValues = useCallback(() => {
		return reduceFields<FormValuePrimitive>((acc, name) => ({
			...acc,
			[name]: valuesStore[name].value,
		}));
	}, [reduceFields, valuesStore]);

	const createRefHandler = useCallback(
		(name: NF) => (element: FormPrimitiveElement) => {
			const value = valuesStore[name].value;
			formElements[name] = element;

			if (element) {
				setFieldValue(element, value);
			}
		},
		[formElements, valuesStore]
	);

	const createChangeHandler = useCallback(
		(name: NF) => (event: React.ChangeEvent<NonNullable<FormPrimitiveElement>>) => {
			const targetElement = event.target;
			const newValue = getNewFieldValue(targetElement, valuesStore[name].value);

			setFieldValue(event.target, newValue);
			valuesStore[name].set(newValue);
		},
		[valuesStore]
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
				name,
				onChange,
			} as any;
		},
		[createChangeHandler, createRefHandler, getFieldSchema]
	);

	useEffect(() => {
		setValues(initialValues);
	}, [fieldsSchemaContentKeys, formElements, initialValues, setValues]);

	return {
		bind,
		getValues,
	};
}

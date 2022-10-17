import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { common, array, dom } from "../../packages/common-utils";
import isEqual from "react-fast-compare";
import { reaction } from "mobx";

import {
	FormSchema,
	ValidateFn,
	FormValuePrimitive,
	CompiledFormSchema,
	FormElementPrimitive,
} from "../types";
import { syncFieldsValues, collectFieldsValues, compileFormSchema } from "../helpers";
import { useLocalStore } from "./useLocalStore";
import { usePrevious } from "./usePrevious";
import { useDebounce } from "./useDebounce";

interface Store {
	values: Record<string, any>;
	errors: Record<string, string>;
	isFormValid: boolean;
	setValue(name: string, value: any): void;
	setValues(values: Record<string, any>): void;
	setError(name: string, value: string): void;
	setErrors(value: Record<string, string>): void;
	setIsFormValid(value: boolean): void;
}

type Fields<T extends FormSchema> = CompiledFormSchema<T>["fields"];
type Groups<T extends FormSchema> = CompiledFormSchema<T>["groups"];

type WithPrev<T> = T | ((prev: T) => T);

interface BindOptions {
	ref?: React.Ref<FormElementPrimitive>;
	validate?: ValidateFn;
	onChange?: React.ChangeEventHandler<FormElementPrimitive>;
}

export interface FormixOptions<T extends FormSchema> {
	validateAfterMount?: boolean;
	resetErrorAfterInput?: boolean;
	formValidationDebounceTime?: number;
	validates?: Partial<Record<keyof Fields<T>, ValidateFn | null>>;
}

export interface UseFormixReturnType<T extends FormSchema> {
	ContextProvider: React.FC<React.PropsWithChildren<{}>>;
	bind(
		name: keyof Fields<T>,
		options?: BindOptions
	): {
		ref: React.RefCallback<FormElementPrimitive> | undefined;
		onChange: React.ChangeEventHandler<FormElementPrimitive>;
	};
	getValues(): Fields<T>;
	getValue<N extends keyof Fields<T>>(name: N): Fields<T>[N];
	setValue<N extends keyof Fields<T>>(name: N, value: WithPrev<Fields<T>[N]>): void;
	setErrors(errors: Partial<Record<keyof Fields<T>, string>>): void;
	validate(target?: keyof Groups<T>): Promise<boolean>;
	isValid(target?: keyof Groups<T>): Promise<boolean>;
	setError(name: keyof Fields<T>, error: string): void;
	getError(name: keyof Fields<T>): string;
	haveError(name: keyof Fields<T>): boolean;
	setValues(values: Partial<T>): void;
	getIsFormValid(): boolean;
	resetValues(): void;
	resetErrors(): void;
	reset(): void;
}

const formixContext = createContext<Omit<UseFormixReturnType<any>, "ContextProvider">>(null!);

export function useFormix<T extends FormSchema>(
	schema: T,
	{
		validateAfterMount = true,
		resetErrorAfterInput = true,
		formValidationDebounceTime = 100,
		validates = {},
	}: FormixOptions<T> = {}
): UseFormixReturnType<T> {
	const previousSchema = usePrevious(schema);
	const compiledSchema = useMemo<CompiledFormSchema<T>>(() => compileFormSchema(schema), [schema]);

	const fields = compiledSchema.fields;
	const groups = compiledSchema.groups;

	const fieldsNames = useMemo(() => Object.keys(fields), [fields]);

	const validatorsRef = useRef<Record<string, ValidateFn | null>>(validates as any);
	const formElementsRef = useRef<Record<string, FormElementPrimitive[] | null>>({});

	const localStore = useLocalStore<Store>({
		values: { ...fields },
		errors: {},
		isFormValid: false,
		setValue(name, value) {
			this.values[name] = value;
		},
		setValues(values) {
			this.values = values;
		},
		setError(name, value) {
			this.errors[name] = value;
		},
		setErrors(value) {
			this.errors = value;
		},
		setIsFormValid(value) {
			this.isFormValid = value;
		},
	});

	const getValue = useCallback(
		<N extends keyof Fields<T>>(name: N): Fields<T>[N] => {
			return localStore.values[name] ?? "";
		},
		[localStore.values]
	);

	const getValues = useCallback((): Fields<T> => {
		return { ...localStore.values } as any;
	}, [localStore.values]);

	const connectFormElement = useCallback(
		(name: string, element: FormElementPrimitive | null): void => {
			const formElements = formElementsRef.current;

			if (!formElements[name]) {
				formElements[name] = [];
			}

			const elements = formElements[name];

			if (!elements) return;

			if (element && common.isArray(elements)) {
				elements.push(element);
			}

			formElements[name] = array.removeDuplicates(dom.removeUnmountedElements(elements));
		},
		[]
	);

	const syncFormFields = useCallback((name: string, value: FormValuePrimitive) => {
		const formElements = formElementsRef.current;
		const elements = formElements[name];

		if (elements && elements.length) {
			syncFieldsValues(elements, value);
		}
	}, []);

	const setValue = useCallback(
		<N extends keyof Fields<T>>(
			name: N,
			valueOrCallback: WithPrev<Fields<T>[N]>,
			sync: boolean = true
		): void => {
			const value = common.isFunction(valueOrCallback)
				? valueOrCallback(getValue(name))
				: valueOrCallback;
			localStore.setValue(name, value);

			if (sync) {
				syncFormFields(name, value);
			}
		},
		[getValue, localStore, syncFormFields]
	);

	const setValues = useCallback(
		(values: Partial<FormSchema>, sync: boolean = true) => {
			const schemaWithUpdatedValues = compileFormSchema(values).fields;
			localStore.setValues({ ...localStore.values, ...schemaWithUpdatedValues });

			if (sync) {
				const keys = Object.keys(schemaWithUpdatedValues);
				keys.forEach((key) => syncFormFields(key, schemaWithUpdatedValues[key]));
			}
		},
		[localStore, syncFormFields]
	);

	const setError = useCallback(
		(name: keyof Fields<T>, error: string): void => {
			localStore.setError(name, error);
		},
		[localStore]
	);

	const getError = useCallback(
		(name: keyof Fields<T>): string => {
			return localStore.errors[name] ?? "";
		},
		[localStore.errors]
	);

	const bind = useCallback(
		(name: keyof Fields<T>, options: BindOptions = {}) => {
			return {
				ref: common.mergeRefs((element: FormElementPrimitive | null) => {
					if (options.validate && element) {
						validatorsRef.current[name] = options.validate;
					} else if (!validatorsRef.current[name]) {
						validatorsRef.current[name] = null;
					} else {
						validatorsRef.current[name] = validates[name] ?? null;
					}

					connectFormElement(name, element);
					syncFormFields(name, getValue(name));
				}, options.ref),
				onChange: common.mergeCallbacks((event: React.ChangeEvent<FormElementPrimitive>) => {
					const field = event.target;
					const value = collectFieldsValues(field, getValue(name));

					if (resetErrorAfterInput) {
						setError(name, "");
					}

					setValue(name, value as any);
				}, options.onChange),
			};
		},
		[
			connectFormElement,
			syncFormFields,
			getValue,
			validates,
			resetErrorAfterInput,
			setValue,
			setError,
		]
	);

	const getValidationErrors = useCallback(
		async (target?: keyof Groups<T>): Promise<Record<string, string>> => {
			const fields = target ? groups[target] : fieldsNames;
			const defaultErrors = fields.reduce(
				(acc, key) => ({ ...acc, [key]: "" }),
				{} as Record<string, string>
			);

			const validates = Object.entries(validatorsRef.current).filter(
				([key, value]) => fields.includes(key) && value
			);

			const isValidatesNotEmpty = validates.length > 0;

			if (isValidatesNotEmpty) {
				const fieldsNames = validates.map(([key]) => key);
				const validatesPromises = fieldsNames.map((name) =>
					(validatorsRef.current[name] as ValidateFn)(getValue(name as any), { name })
				);

				const validatesResults = (await Promise.allSettled(validatesPromises)) as {
					reason?: string;
					value?: string;
				}[];

				const haveSomeErrors = validatesResults.some((result) => result.value);

				if (haveSomeErrors) {
					return {
						...defaultErrors,
						...validatesResults.reduce((acc, result, index) => {
							const name = fieldsNames[index];
							return { ...acc, [name]: result.value ? String(result.value) : undefined };
						}, {} as Record<string, string>),
					};
				}
			}

			return defaultErrors;
		},
		[fieldsNames, getValue, groups]
	);

	const validate = useCallback(
		async (target?: keyof Groups<T>): Promise<boolean> => {
			const errors = await getValidationErrors(target);
			const fieldsEntries = Object.entries(errors);

			localStore.setErrors({ ...localStore.errors, ...errors });

			if (fieldsEntries.filter(([, value]) => value).length) {
				return false;
			}

			return true;
		},
		[getValidationErrors, localStore]
	);

	const isValid = useCallback(
		async (target?: keyof Groups<T>): Promise<boolean> => {
			const errors = await getValidationErrors(target);
			const fieldsEntries = Object.entries(errors);
			return fieldsEntries.filter(([, value]) => value).length === 0;
		},
		[getValidationErrors]
	);

	const setErrors = useCallback(
		(errors: Partial<Record<keyof Fields<T>, string>>): void => {
			localStore.setErrors({ ...localStore.errors, ...errors });
		},
		[localStore]
	);

	const resetErrors = useCallback(
		(target?: keyof Groups<T>): void => {
			const fields = target ? groups[target] : fieldsNames;
			localStore.setErrors({
				...localStore.errors,
				...fields.reduce((acc, key) => ({ ...acc, [key]: "" }), {} as Record<string, string>),
			});
		},
		[fieldsNames, groups, localStore]
	);

	const resetValues = useCallback((): void => {
		localStore.setValues(fields);
	}, [fields, localStore]);

	const reset = useCallback((): void => {
		resetValues();
		resetErrors();
	}, [resetErrors, resetValues]);

	const haveError = useCallback(
		(name: keyof Fields<T>): boolean => {
			return Boolean(getError(name));
		},
		[getError]
	);

	const updateIsFormValid = useCallback(async () => {
		const valid = await isValid();
		localStore.setIsFormValid(valid);
	}, [isValid, localStore]);

	const autoValidation = useDebounce(() => {
		if (formValidationDebounceTime) {
			updateIsFormValid();
		}
	}, formValidationDebounceTime);

	const getIsFormValid = useCallback(() => {
		return localStore.isFormValid;
	}, [localStore]);

	useEffect(() => {
		if (!isEqual(schema, previousSchema)) {
			reset();
		}
	}, [schema, previousSchema, reset]);

	useEffect(() => {
		if (validateAfterMount) {
			validate();
			updateIsFormValid();
		}
	}, [validateAfterMount, validate, autoValidation, updateIsFormValid]);

	useEffect(
		() => reaction(() => getValues(), autoValidation),
		[autoValidation, getValues, localStore]
	);

	const formixInterface = useMemo<Omit<UseFormixReturnType<T>, "ContextProvider">>(
		() => ({
			bind,
			setValue,
			getValue,
			getValues,
			setValues,
			setErrors,
			validate,
			reset,
			isValid,
			setError,
			getError,
			haveError,
			resetValues,
			resetErrors,
			getIsFormValid,
		}),
		[
			bind,
			getError,
			getIsFormValid,
			getValue,
			getValues,
			haveError,
			isValid,
			reset,
			resetErrors,
			resetValues,
			setError,
			setErrors,
			setValue,
			setValues,
			validate,
		]
	);

	const ContextProvider: React.FC<React.PropsWithChildren<{}>> = useCallback(
		({ children }) => {
			return <formixContext.Provider value={formixInterface}>{children}</formixContext.Provider>;
		},
		[formixInterface]
	);

	return { ...formixInterface, ContextProvider };
}

export function useFormixContext<T extends FormSchema = any>() {
	return useContext(formixContext) as Omit<UseFormixReturnType<T>, "ContextProvider">;
}

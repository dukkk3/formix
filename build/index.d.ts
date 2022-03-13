import React from "react";
import FastestValidator, { ValidationRuleObject } from "fastest-validator";
import { AnySchema } from "joi";
declare const FIELD_SCHEMA_SYMBOL: "FIELD_SCHEMA";
declare const FORM_SCHEMA_SYMBOL: "FORM_SCHEMA";
type FieldSchemaSymbol = typeof FIELD_SCHEMA_SYMBOL;
type FormSchemaSymbol = typeof FORM_SCHEMA_SYMBOL;
type FieldSchemaBase<T extends any> = {
    defaultValue: T;
    validate?: ValidateFn;
};
type ValidateFn = (value: FormValuePrimitive, fieldName: string) => Promise<string> | string;
type FormSchemaBase = Record<string, any>;
type FormElementPrimitive = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type FormSchemaPrimitive = FormValuePrimitive | FieldSchema<any>;
type FormValuePrimitive = string | boolean | string[];
type ConvertToFormPrimitiveValue<T extends any> = T extends any[] ? string[] : T extends FormValuePrimitive ? T : never;
type ConvertFieldToFormPrimitiveValue<T extends FieldSchema<any>> = ConvertToFormPrimitiveValue<T["FIELD_SCHEMA"]["defaultValue"]>;
type FieldSchema<T extends any> = {
    [key in FieldSchemaSymbol]: FieldSchemaBase<T>;
};
type FormSchema<T extends FormSchemaBase> = {
    [key in FormSchemaSymbol]: {
        fields: {
            [K in FormFieldPaths<T>]: DeepPropType<T, K> extends FieldSchema<any> ? DeepPropType<T, K> : FieldSchema<DeepPropType<T, K>>;
        };
        groups: {
            [K in FormGroupPaths<T>]: string[];
        };
    };
};
type AliasBase = Record<string, React.FC<any>>;
type ArrayShift<T extends any[]> = T extends [infer _, ...infer Tail] ? Tail : never;
type FormGroupPaths<T, D extends number = 5> = [D] extends [never] ? never : T extends FormSchemaPrimitive ? "" : T extends object ? {
    [K in keyof T]-?: K extends string | number ? `${K}${T[K] extends FormSchemaPrimitive ? "" : ".*"}` | JoinKeys<K, FormGroupPaths<T[K], Prev[D]>> : never;
}[keyof T] : "";
type FormFieldPaths<T, D extends number = 5> = [D] extends [never] ? never : T extends FormSchemaPrimitive ? "" : T extends object ? {
    [K in keyof T]-?: JoinKeys<K, FormFieldPaths<T[K], Prev[D]>>;
}[keyof T] : "";
type DeepPropType<T, P extends string> = string extends P ? unknown : P extends keyof T ? T[P] : P extends `${infer K}.${infer R}` ? K extends keyof T ? DeepPropType<T[K], R> : unknown : unknown;
type JoinKeys<K, U> = K extends string | number ? U extends string | number ? `${K}${"" extends U ? "" : "."}${U}` : never : never;
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, ...0[]];
export function formSchema<T extends FormSchemaBase>(schema: FormSchema<T> | T): FormSchema<T>;
export function field<T extends FormValuePrimitive>(schema: FieldSchema<T> | FieldSchemaBase<T>): FieldSchema<T>;
export function validateFactory<T extends any[]>(validateFn: (...args: T) => ValidateFn): (...args: T) => ValidateFn;
export function validationChain(...args: ValidateFn[]): ValidateFn;
type FieldProps<T extends AliasBase, K extends keyof T> = {
    as: K;
} & (T[K] extends React.FC<infer R> ? R : {});
export function fieldFactory<T extends AliasBase>(alias: T): <K extends keyof T>(props: FieldProps<T, K> & {
    ref?: React.ForwardedRef<any>;
}) => JSX.Element;
export function fieldFactory<T extends AliasBase, D extends keyof T>(alias: T, def: D): <K extends keyof T = D>(props: Omit<FieldProps<T, K>, "as"> & Partial<Pick<FieldProps<T, K>, "as">> & {
    ref?: React.ForwardedRef<any>;
}) => JSX.Element;
export function useFormix<T extends FormSchemaBase, U extends FormSchema<T>["FORM_SCHEMA"], F extends U["fields"], G extends U["groups"], NF extends keyof F, NG extends keyof G>(schema: T | FormSchema<T>): {
    $: <N extends NF>(name: N) => {
        bind: () => {
            name: NF;
            ref: () => void;
            onChange: (event: React.ChangeEvent<FormElementPrimitive>) => void;
        };
        isValid: () => Promise<boolean>;
        validate: () => Promise<boolean>;
        getError: () => Record<NF, string>[NF];
        getValue: () => import("core/types").ConvertToFormPrimitiveValue<F[N]["FIELD_SCHEMA"]["defaultValue"]>;
        setError: (error: string) => void;
        setValue: <V extends import("core/types").ConvertToFormPrimitiveValue<F[N]["FIELD_SCHEMA"]["defaultValue"]>>(value: V | ((prevValue: V) => V)) => void;
    };
    bind: (name: NF) => {
        name: NF;
        ref: () => void;
        onChange: (event: React.ChangeEvent<FormElementPrimitive>) => void;
    };
    Form: React.ForwardRefExoticComponent<Pick<React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, "key" | keyof React.FormHTMLAttributes<HTMLFormElement>> & React.RefAttributes<HTMLFormElement>>;
    isValid: (target?: NG | undefined) => Promise<boolean>;
    getError: (name: NF) => Record<NF, string>[NF];
    getErrors: () => Record<NF, string>;
    setError: (name: NF, error: string) => void;
    setErrors: (errors: Partial<Record<NF, string>>) => void;
    getValue: <N_1 extends NF>(name: N_1) => import("core/types").ConvertToFormPrimitiveValue<F[N_1]["FIELD_SCHEMA"]["defaultValue"]>;
    getValues: () => { [K in NF]: import("core/types").ConvertToFormPrimitiveValue<F[K]["FIELD_SCHEMA"]["defaultValue"]>; };
    setValue: <N_2 extends NF, V_1 extends import("core/types").ConvertToFormPrimitiveValue<F[N_2]["FIELD_SCHEMA"]["defaultValue"]>>(name: N_2, value: V_1 | ((prevValue: V_1) => V_1)) => void;
    setValues: (values: Partial<{ [K_1 in NF]: import("core/types").ConvertToFormPrimitiveValue<F[K_1]["FIELD_SCHEMA"]["defaultValue"]>; }>) => void;
    validate: (target?: NG | undefined) => Promise<boolean>;
    bindForm: () => {
        ref: React.RefObject<HTMLFormElement>;
    };
};
type UseFormixReturnType<T extends FormSchemaBase, U extends FormSchema<T>["FORM_SCHEMA"] = FormSchema<T>["FORM_SCHEMA"], F extends U["fields"] = U["fields"], G extends U["groups"] = U["groups"], NF extends keyof F = keyof F, NG extends keyof G = keyof G> = {
    bind: (name: NF) => {
        name: NF;
        ref: React.RefObject<any>;
        onChange: React.ChangeEventHandler<any>;
    };
    Form: (props: React.ComponentProps<"form"> & {
        ref: React.RefObject<HTMLFormElement>;
    }) => JSX.Element;
    isValid: (target?: NG) => Promise<boolean>;
    validate: (target?: NG) => Promise<boolean>;
    getError: (name: NF) => string;
    getErrors: () => Record<NF, string>;
    setError: (name: NF, error: string) => void;
    setErrors: (errors: Partial<Record<NF, string>>) => void;
    getValue: <N extends NF>(name: N) => ConvertFieldToFormPrimitiveValue<F[N]>;
    getValues: () => {
        [K in NF]: ConvertFieldToFormPrimitiveValue<F[K]>;
    };
    setValue: <N extends NF, V extends ConvertFieldToFormPrimitiveValue<F[N]>>(name: N, value: ((prevValue: V) => V) | V) => void;
    setValues: (values: Partial<{
        [K in NF]: ConvertFieldToFormPrimitiveValue<F[K]>;
    }>) => void;
    bindForm: () => {
        ref: React.RefObject<HTMLFormElement>;
    };
    $: <N extends NF>(name: N) => {
        [K in keyof Omit<UseFormixReturnType<T, U, F, G, N, NG>, "$" | "getValues" | "getErrors" | "setErrors" | "setValues" | "Form" | "bindForm">]: (...params: ArrayShift<Parameters<UseFormixReturnType<T, U, F, G, N, NG>[K]>>) => ReturnType<UseFormixReturnType<T, U, F, G, N, NG>[K]>;
    };
};
export const Formix: <T extends FormSchemaBase>(props: Props<T> & {
    ref?: React.ForwardedRef<HTMLFormElement> | undefined;
}) => JSX.Element;
interface Props<T extends FormSchemaBase> extends Omit<React.ComponentProps<"form">, "onSubmit"> {
    schema: T | FormSchema<T>;
    children: (formix: Omit<UseFormixReturnType<T>, "Form" | "bindForm">) => React.ReactNode;
    onSubmit?: (values: {
        [K in keyof FormSchema<T>["FORM_SCHEMA"]["fields"]]: ConvertFieldToFormPrimitiveValue<FormSchema<T>["FORM_SCHEMA"]["fields"][K]>;
    }) => void;
}
export const Field: <K extends "select" | "input" | "textArea" = "input">(props: Omit<{
    as: K;
} & ({
    input: React.ForwardRefExoticComponent<Pick<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "key" | keyof React.InputHTMLAttributes<HTMLInputElement>> & React.RefAttributes<HTMLInputElement>>;
    select: React.ForwardRefExoticComponent<Pick<React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>, "key" | keyof React.SelectHTMLAttributes<HTMLSelectElement>> & React.RefAttributes<HTMLSelectElement>>;
    textArea: React.ForwardRefExoticComponent<Pick<React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, "key" | keyof React.TextareaHTMLAttributes<HTMLTextAreaElement>> & React.RefAttributes<HTMLTextAreaElement>>;
}[K] extends React.FC<infer R> ? R : {}), "as"> & Partial<Pick<{
    as: K;
} & ({
    input: React.ForwardRefExoticComponent<Pick<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "key" | keyof React.InputHTMLAttributes<HTMLInputElement>> & React.RefAttributes<HTMLInputElement>>;
    select: React.ForwardRefExoticComponent<Pick<React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>, "key" | keyof React.SelectHTMLAttributes<HTMLSelectElement>> & React.RefAttributes<HTMLSelectElement>>;
    textArea: React.ForwardRefExoticComponent<Pick<React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, "key" | keyof React.TextareaHTMLAttributes<HTMLTextAreaElement>> & React.RefAttributes<HTMLTextAreaElement>>;
}[K] extends React.FC<infer R> ? R : {}), "as">> & {
    ref?: React.ForwardedRef<any> | undefined;
}) => JSX.Element;
export const fastestValidate: (rule: string | ValidationRuleObject, validator?: FastestValidator | undefined) => import("core/types").ValidateFn;
export const joiValidate: (schema: AnySchema<any>) => import("core/types").ValidateFn;

//# sourceMappingURL=index.d.ts.map

var $3hEOU$reactjsxruntime = require("react/jsx-runtime");
var $3hEOU$react = require("react");
var $3hEOU$mobxreactlite = require("mobx-react-lite");
var $3hEOU$reactfastcompare = require("react-fast-compare");
var $3hEOU$fastestvalidator = require("fastest-validator");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "Formix", () => $7892bab7f326bed4$export$76ac2dc60f7a3f13);
$parcel$export(module.exports, "Field", () => $2d7505cde7b5bbb4$export$a455218a85c89869);
$parcel$export(module.exports, "useFormix", () => $bd0e33c45dfac056$export$d1fb35b153c8c186);
$parcel$export(module.exports, "useField", () => $bd0e33c45dfac056$export$294aa081a6c6f55d);
$parcel$export(module.exports, "formSchema", () => $7e043fd2f1fe1b7b$export$2f8469872c305b85);
$parcel$export(module.exports, "field", () => $7e043fd2f1fe1b7b$export$e0f35d825088c098);
$parcel$export(module.exports, "validateFactory", () => $7e043fd2f1fe1b7b$export$af85c40c8b614364);
$parcel$export(module.exports, "fieldFactory", () => $7e043fd2f1fe1b7b$export$45688d1308b4bdba);
$parcel$export(module.exports, "validationChain", () => $7e043fd2f1fe1b7b$export$766e40e6a2c668c1);
$parcel$export(module.exports, "fastestValidate", () => $84b0650d9bbb05a6$export$f92bf56fabb8547d);
$parcel$export(module.exports, "joiValidate", () => $f15e190a8e50bd5f$export$75ad5962a3abf5b);





const $af8d31735c159a26$export$c565007640e081d4 = Symbol("fieldSchema");
const $af8d31735c159a26$export$d5fd538033a84049 = Symbol("formSchema");
const $af8d31735c159a26$export$27abf539e6b2ab49 = [
    "radio",
    "checkbox"
];





function $41737727779803e2$export$ed18f746ce1d9f01(object, conditionFn) {
    const keys = Object.keys(object);
    const entries = [];
    for (const key of keys){
        const value1 = object[key];
        entries.push([
            key,
            value1
        ]);
        if (typeof value1 === "object" && (!conditionFn || conditionFn(key, value1))) {
            const subEntires = $41737727779803e2$export$ed18f746ce1d9f01(value1, conditionFn);
            entries.push(...subEntires.map(([entryKey, value])=>[
                    `${key}.${entryKey}`,
                    value
                ]
            ));
        }
    }
    return entries;
}
function $41737727779803e2$export$1cdd1f510a7f9e4a(object, ...keys) {
    const entries = Object.entries(object);
    const filteredEntries = entries.filter(([key])=>!keys.includes(key)
    );
    return Object.fromEntries(filteredEntries);
}
function $41737727779803e2$export$e493755a2e620b0b(object, ...keys) {
    const entries = Object.entries(object);
    const filteredEntries = entries.filter(([key])=>keys.includes(key)
    );
    return Object.fromEntries(filteredEntries);
}
function $41737727779803e2$export$c9058316764c140e(...refs) {
    const filteredRefs = refs.filter(Boolean);
    if (filteredRefs.length === 0) return null;
    return (instance)=>{
        for (const ref of filteredRefs){
            if (typeof ref === "function") ref(instance);
            else if (ref) ref.current = instance;
        }
    };
}
function $41737727779803e2$export$30e8f3c2ef73c7a3(array) {
    return Array.from(new Set(array));
}
function $41737727779803e2$export$6d35aad4de0e7b1(elements) {
    return elements.filter((element)=>document.body.contains(element)
    );
}
function $41737727779803e2$export$dcfe1c11d168b5a1(element) {
    return element.tagName.toLowerCase() === "select";
}
function $41737727779803e2$export$fc7b8ce0aa07b7de(element) {
    return element.tagName.toLocaleLowerCase() === "textarea";
}
function $41737727779803e2$export$63ed1d20cf8213cf(element) {
    return element.tagName.toLocaleLowerCase() === "input";
}
function $41737727779803e2$export$f05a241035b5c5eb(...callbacks) {
    const filteredCallbacks = callbacks.filter(Boolean);
    if (filteredCallbacks.length === 0) return null;
    return (...args)=>{
        for (const callback of filteredCallbacks)callback(...args);
    };
}


function $7e043fd2f1fe1b7b$export$2f8469872c305b85(schema) {
    if (schema[$af8d31735c159a26$export$d5fd538033a84049]) return schema;
    const entries = $41737727779803e2$export$ed18f746ce1d9f01(schema, (_, value)=>!$7e043fd2f1fe1b7b$export$3eb4689d3997eea5(value) && !$7e043fd2f1fe1b7b$export$23983dbdd416fdc9(value)
    );
    const fields = entries.filter(([, value])=>$7e043fd2f1fe1b7b$export$23983dbdd416fdc9(value) || $7e043fd2f1fe1b7b$export$3eb4689d3997eea5(value)
    ).map(([key, value])=>[
            key,
            $7e043fd2f1fe1b7b$export$23983dbdd416fdc9(value) ? $7e043fd2f1fe1b7b$export$e0f35d825088c098({
                defaultValue: value
            }) : value, 
        ]
    );
    const groups = entries.filter(([entryKey])=>fields.every(([key])=>key !== entryKey
        )
    ).map(([entryKey])=>[
            `${entryKey}.*`,
            fields.filter(([key])=>key.includes(entryKey)
            ).map(([key])=>key
            ), 
        ]
    );
    return {
        [$af8d31735c159a26$export$d5fd538033a84049]: {
            fields: Object.fromEntries(fields),
            groups: Object.fromEntries(groups)
        }
    };
}
function $7e043fd2f1fe1b7b$export$e0f35d825088c098(schema) {
    if (schema[$af8d31735c159a26$export$c565007640e081d4]) return schema;
    return {
        [$af8d31735c159a26$export$c565007640e081d4]: schema
    };
}
function $7e043fd2f1fe1b7b$export$6f57b39d94fda9e(object) {
    return Object.entries(object).reduce((acc, [key, defaultValue])=>({
            ...acc,
            [key]: {
                value: defaultValue,
                set: function(value) {
                    this.value = value;
                }
            }
        })
    , {
    });
}
function $7e043fd2f1fe1b7b$export$af85c40c8b614364(validateFn) {
    return validateFn;
}
function $7e043fd2f1fe1b7b$export$766e40e6a2c668c1(...args) {
    return async (value, fieldName)=>{
        let error = "";
        for (const validate of args){
            error = await Promise.resolve(validate(value, fieldName));
            if (error) break;
        }
        return error;
    };
}
function $7e043fd2f1fe1b7b$export$45688d1308b4bdba(alias, def) {
    return(/*#__PURE__*/ $3hEOU$react.forwardRef(({ as: as , ...rest }, ref)=>{
        const Component = alias[def || as];
        return(/*#__PURE__*/ $3hEOU$reactjsxruntime.jsx($3hEOU$reactjsxruntime.Fragment, {
            children: Component ? /*#__PURE__*/ $3hEOU$reactjsxruntime.jsx(Component, {
                ref: ref,
                ...rest
            }) : null
        }));
    }));
}
function $7e043fd2f1fe1b7b$export$6c11848892def96c(fields, value) {
    if (Array.isArray(value)) fields.forEach(($7e043fd2f1fe1b7b$export$e0f35d825088c098)=>{
        if ($41737727779803e2$export$dcfe1c11d168b5a1($7e043fd2f1fe1b7b$export$e0f35d825088c098)) $7e043fd2f1fe1b7b$export$e0f35d825088c098.querySelectorAll("option").forEach((option)=>option.selected = value.includes(option.value)
        );
        else if ($41737727779803e2$export$63ed1d20cf8213cf($7e043fd2f1fe1b7b$export$e0f35d825088c098) || $41737727779803e2$export$fc7b8ce0aa07b7de($7e043fd2f1fe1b7b$export$e0f35d825088c098)) {
            if ($41737727779803e2$export$63ed1d20cf8213cf($7e043fd2f1fe1b7b$export$e0f35d825088c098) && $af8d31735c159a26$export$27abf539e6b2ab49.includes($7e043fd2f1fe1b7b$export$e0f35d825088c098.type)) $7e043fd2f1fe1b7b$export$e0f35d825088c098.checked = value.includes($7e043fd2f1fe1b7b$export$e0f35d825088c098.value);
            else $7e043fd2f1fe1b7b$export$e0f35d825088c098.value = value[0] || "";
        }
    });
    else if (typeof value === "boolean") fields.forEach(($7e043fd2f1fe1b7b$export$e0f35d825088c098)=>{
        if ($41737727779803e2$export$63ed1d20cf8213cf($7e043fd2f1fe1b7b$export$e0f35d825088c098)) $7e043fd2f1fe1b7b$export$e0f35d825088c098.checked = value;
    });
    else fields.forEach(($7e043fd2f1fe1b7b$export$e0f35d825088c098)=>{
        if ($41737727779803e2$export$dcfe1c11d168b5a1($7e043fd2f1fe1b7b$export$e0f35d825088c098)) $7e043fd2f1fe1b7b$export$e0f35d825088c098.querySelectorAll("option").forEach((option)=>option.selected = value === option.value
        );
        else if ($41737727779803e2$export$63ed1d20cf8213cf($7e043fd2f1fe1b7b$export$e0f35d825088c098) && $af8d31735c159a26$export$27abf539e6b2ab49.includes($7e043fd2f1fe1b7b$export$e0f35d825088c098.type)) $7e043fd2f1fe1b7b$export$e0f35d825088c098.checked = $7e043fd2f1fe1b7b$export$e0f35d825088c098.value === value;
        else if ($41737727779803e2$export$63ed1d20cf8213cf($7e043fd2f1fe1b7b$export$e0f35d825088c098) || $41737727779803e2$export$fc7b8ce0aa07b7de($7e043fd2f1fe1b7b$export$e0f35d825088c098)) $7e043fd2f1fe1b7b$export$e0f35d825088c098.value = value;
    });
}
function $7e043fd2f1fe1b7b$export$ffb5f384678b9e61($7e043fd2f1fe1b7b$export$e0f35d825088c098, value1) {
    if (Array.isArray(value1)) {
        if ($41737727779803e2$export$dcfe1c11d168b5a1($7e043fd2f1fe1b7b$export$e0f35d825088c098)) {
            const selectedOptionsValues = Array.from($7e043fd2f1fe1b7b$export$e0f35d825088c098.selectedOptions).map((option)=>option.value
            );
            return $7e043fd2f1fe1b7b$export$e0f35d825088c098.multiple ? $41737727779803e2$export$30e8f3c2ef73c7a3([
                ...value1,
                ...selectedOptionsValues
            ]) : $41737727779803e2$export$30e8f3c2ef73c7a3(selectedOptionsValues);
        } else if ($41737727779803e2$export$63ed1d20cf8213cf($7e043fd2f1fe1b7b$export$e0f35d825088c098) && $af8d31735c159a26$export$27abf539e6b2ab49.includes($7e043fd2f1fe1b7b$export$e0f35d825088c098.type)) return $41737727779803e2$export$30e8f3c2ef73c7a3($7e043fd2f1fe1b7b$export$e0f35d825088c098.checked ? [
            ...value1,
            String($7e043fd2f1fe1b7b$export$e0f35d825088c098.value)
        ] : value1.filter((value)=>value !== $7e043fd2f1fe1b7b$export$e0f35d825088c098.value
        ));
        else if ($41737727779803e2$export$63ed1d20cf8213cf($7e043fd2f1fe1b7b$export$e0f35d825088c098) || $41737727779803e2$export$fc7b8ce0aa07b7de($7e043fd2f1fe1b7b$export$e0f35d825088c098)) return [
            $7e043fd2f1fe1b7b$export$e0f35d825088c098.value || ""
        ];
    } else if (typeof value1 === "boolean" && $41737727779803e2$export$63ed1d20cf8213cf($7e043fd2f1fe1b7b$export$e0f35d825088c098)) return Boolean($7e043fd2f1fe1b7b$export$e0f35d825088c098.checked);
    return String($7e043fd2f1fe1b7b$export$e0f35d825088c098.value);
}
function $7e043fd2f1fe1b7b$export$3eb4689d3997eea5(object) {
    return Boolean(object[$af8d31735c159a26$export$c565007640e081d4]);
}
function $7e043fd2f1fe1b7b$export$23983dbdd416fdc9(object) {
    return Array.isArray(object) || [
        "string",
        "boolean"
    ].includes(typeof object);
}



function $bd0e33c45dfac056$export$f5b97ae82d1eeaf3(base) {
    return $3hEOU$mobxreactlite.useLocalObservable(()=>$7e043fd2f1fe1b7b$export$6f57b39d94fda9e(base)
    );
}
function $bd0e33c45dfac056$export$d1fb35b153c8c186(schema) {
    const schemaRef = $3hEOU$react.useRef(schema);
    const formElementsRef = $3hEOU$react.useRef({
    });
    if (!($parcel$interopDefault($3hEOU$reactfastcompare))(schemaRef.current, schema) || schema !== schemaRef.current) schemaRef.current = schema;
    const preparedSchema = $3hEOU$react.useMemo(()=>$7e043fd2f1fe1b7b$export$2f8469872c305b85(schemaRef.current)
    , // eslint-disable-next-line react-hooks/exhaustive-deps
    [
        schemaRef.current
    ]);
    const schemaContent = $3hEOU$react.useMemo(()=>preparedSchema[$af8d31735c159a26$export$d5fd538033a84049]
    , [
        preparedSchema
    ]);
    const schemaFields = $3hEOU$react.useMemo(()=>schemaContent.fields
    , [
        schemaContent
    ]);
    const schemaGroups = $3hEOU$react.useMemo(()=>schemaContent.groups
    , [
        schemaContent
    ]);
    const fieldsNames = $3hEOU$react.useMemo(()=>Object.keys(schemaFields)
    , [
        schemaFields
    ]);
    const pickFieldSchema = $3hEOU$react.useCallback((name)=>{
        return schemaFields[name][$af8d31735c159a26$export$c565007640e081d4];
    }, [
        schemaFields
    ]);
    const pickGroupSchema = $3hEOU$react.useCallback((name)=>{
        return schemaGroups[name];
    }, [
        schemaGroups
    ]);
    const reduceFieldsNames = $3hEOU$react.useCallback((callback)=>{
        return fieldsNames.reduce((acc, key)=>callback(acc, key)
        , {
        });
    }, [
        fieldsNames
    ]);
    const defaultErrors = $3hEOU$react.useMemo(()=>reduceFieldsNames((acc, name)=>({
                ...acc,
                [name]: ""
            })
        )
    , [
        reduceFieldsNames
    ]);
    const defaultValues = $3hEOU$react.useMemo(()=>reduceFieldsNames((acc, name)=>({
                ...acc,
                [name]: pickFieldSchema(name).defaultValue ?? ""
            })
        )
    , [
        pickFieldSchema,
        reduceFieldsNames
    ]);
    const fieldsValidates = $3hEOU$react.useMemo(()=>reduceFieldsNames((acc, name)=>({
                ...acc,
                [name]: pickFieldSchema(name).validate || null
            })
        )
    , [
        pickFieldSchema,
        reduceFieldsNames
    ]);
    const errorsStore = $bd0e33c45dfac056$export$f5b97ae82d1eeaf3(defaultErrors);
    const valuesStore = $bd0e33c45dfac056$export$f5b97ae82d1eeaf3(defaultValues);
    const connectFormElement = $3hEOU$react.useCallback((name, element)=>{
        const formElements = formElementsRef.current;
        if (!formElements[name]) formElements[name] = [];
        if (element) formElements[name].push(element);
        formElements[name] = $41737727779803e2$export$30e8f3c2ef73c7a3($41737727779803e2$export$6d35aad4de0e7b1(formElements[name]));
    }, []);
    const syncFormFields = $3hEOU$react.useCallback((name, value)=>{
        const formElements = formElementsRef.current;
        if (formElements[name] && formElements[name].length) $7e043fd2f1fe1b7b$export$6c11848892def96c(formElements[name], value);
    }, []);
    const setValues = $3hEOU$react.useCallback((values)=>{
        fieldsNames.forEach((name)=>{
            const value = values[name];
            if ($7e043fd2f1fe1b7b$export$23983dbdd416fdc9(value)) {
                valuesStore[name].set(value);
                syncFormFields(name, value);
            }
        });
    }, [
        fieldsNames,
        syncFormFields,
        valuesStore
    ]);
    const setValue = $3hEOU$react.useCallback((name, value)=>{
        const newValue = typeof value === "function" ? value(valuesStore[name].value) : value;
        setValues({
            [name]: newValue
        });
    }, [
        setValues,
        valuesStore
    ]);
    const getValue = $3hEOU$react.useCallback((name)=>{
        return valuesStore[name].value;
    }, [
        valuesStore
    ]);
    const getValues = $3hEOU$react.useCallback(()=>{
        return reduceFieldsNames((acc, name)=>({
                ...acc,
                [name]: getValue(name)
            })
        );
    }, [
        getValue,
        reduceFieldsNames
    ]);
    const setErrors = $3hEOU$react.useCallback((errors)=>{
        fieldsNames.forEach((name)=>{
            const error = errors[name];
            if (typeof error === "string") errorsStore[name].set(error);
        });
    }, [
        errorsStore,
        fieldsNames
    ]);
    const setError = $3hEOU$react.useCallback((name, error)=>{
        errorsStore[name].set(error);
    }, [
        errorsStore
    ]);
    const getErrors = $3hEOU$react.useCallback(()=>{
        return reduceFieldsNames((acc, name)=>({
                ...acc,
                [name]: errorsStore[name].value
            })
        );
    }, [
        errorsStore,
        reduceFieldsNames
    ]);
    const getError = $3hEOU$react.useCallback((name)=>{
        return errorsStore[name].value;
    }, [
        errorsStore
    ]);
    const createRefHandler = $3hEOU$react.useCallback((name)=>(element)=>{
            connectFormElement(name, element);
            syncFormFields(name, valuesStore[name].value);
        }
    , [
        connectFormElement,
        syncFormFields,
        valuesStore
    ]);
    const createChangeHandler = $3hEOU$react.useCallback((name)=>(event)=>{
            const field = event.target;
            const value = $7e043fd2f1fe1b7b$export$ffb5f384678b9e61(field, valuesStore[name].value);
            setValue(name, value);
            setError(name, "");
        }
    , [
        setError,
        setValue,
        valuesStore
    ]);
    const bind = $3hEOU$react.useCallback((name, options)=>{
        return {
            name: options?.newName || name,
            ref: $41737727779803e2$export$c9058316764c140e(createRefHandler(name), options?.ref),
            onChange: $41737727779803e2$export$f05a241035b5c5eb(createChangeHandler(name), options?.onChange)
        };
    }, [
        createChangeHandler,
        createRefHandler
    ]);
    const getValidationErrors = $3hEOU$react.useCallback(async (target)=>{
        const fields = target ? pickGroupSchema(target) ? pickGroupSchema(target) : [
            target
        ] : fieldsNames;
        const validates = $41737727779803e2$export$e493755a2e620b0b(fieldsValidates, ...fields);
        const filteredValidates = Object.fromEntries(Object.entries(validates).filter(([, validate])=>validate
        ));
        const validatesKeys = Object.keys(filteredValidates);
        const isValidatesNotEmpty = validatesKeys.length > 0;
        if (isValidatesNotEmpty) {
            const validatesPromises = validatesKeys.map((name)=>filteredValidates[name](valuesStore[name].value, name)
            );
            const validatesResults = await Promise.allSettled(validatesPromises);
            const haveSomeErrors = validatesResults.some((result)=>result.value
            );
            if (haveSomeErrors) return validatesResults.reduce((acc, result, index)=>{
                const name = validatesKeys[index];
                return {
                    ...acc,
                    [name]: result.value ? String(result.value) : undefined
                };
            }, {
            });
        }
        return {
        };
    }, [
        fieldsNames,
        fieldsValidates,
        pickGroupSchema,
        valuesStore
    ]);
    const validate1 = $3hEOU$react.useCallback(async (target)=>{
        const errors = await getValidationErrors(target);
        const errorsKeys = Object.keys(errors);
        const haveSomeErrors = errorsKeys.length > 0;
        if (haveSomeErrors) {
            setErrors(errors);
            return false;
        }
        return true;
    }, [
        getValidationErrors,
        setErrors
    ]);
    const isValid = $3hEOU$react.useCallback(async (target)=>{
        const errors = await getValidationErrors(target);
        const errorsKeys = Object.keys(errors);
        const haveSomeErrors = errorsKeys.length > 0;
        return !haveSomeErrors;
    }, [
        getValidationErrors
    ]);
    const $ = $3hEOU$react.useCallback((name)=>{
        return {
            bind: (options)=>bind(name, options)
            ,
            isValid: ()=>isValid(name)
            ,
            validate: ()=>validate1(name)
            ,
            getError: ()=>getError(name)
            ,
            getValue: ()=>getValue(name)
            ,
            setError: (error)=>setError(name, error)
            ,
            setValue: (value)=>setValue(name, value)
        };
    }, [
        bind,
        getError,
        getValue,
        isValid,
        setError,
        setValue,
        validate1
    ]);
    $3hEOU$react.useEffect(()=>{
        setValues(defaultValues);
        setErrors(defaultErrors);
    }, [
        defaultErrors,
        defaultValues,
        setErrors,
        setValues
    ]);
    return {
        $: $,
        bind: bind,
        isValid: isValid,
        getError: getError,
        getErrors: getErrors,
        setError: setError,
        setErrors: setErrors,
        getValue: getValue,
        getValues: getValues,
        setValue: setValue,
        setValues: setValues,
        validate: validate1
    };
}
function $bd0e33c45dfac056$export$294aa081a6c6f55d(name, schemaOrDefaultValue) {
    const { $: $  } = $bd0e33c45dfac056$export$d1fb35b153c8c186({
        [name]: $7e043fd2f1fe1b7b$export$23983dbdd416fdc9(schemaOrDefaultValue) ? $7e043fd2f1fe1b7b$export$e0f35d825088c098({
            defaultValue: schemaOrDefaultValue
        }) : $7e043fd2f1fe1b7b$export$e0f35d825088c098(schemaOrDefaultValue)
    });
    return $(name);
}


const $7892bab7f326bed4$export$76ac2dc60f7a3f13 = /*#__PURE__*/ $3hEOU$react.forwardRef(({ schema: schema , children: children , onSubmit: onSubmit , ...rest }, ref)=>{
    const formix = $bd0e33c45dfac056$export$d1fb35b153c8c186(schema);
    const handleSubmit = $3hEOU$react.useCallback(async (event)=>{
        event.preventDefault();
        const isValid = await formix.validate();
        if (isValid) {
            if (onSubmit) onSubmit(formix.getValues());
            else {
                const target = event.target;
                target.submit();
            }
        }
    }, [
        formix,
        onSubmit
    ]);
    return(/*#__PURE__*/ $3hEOU$reactjsxruntime.jsx("form", {
        ref: ref,
        onSubmit: handleSubmit,
        ...rest,
        children: children(formix)
    }));
});





const $2d7505cde7b5bbb4$var$Input = /*#__PURE__*/ $3hEOU$react.forwardRef((props, ref)=>{
    return(/*#__PURE__*/ $3hEOU$reactjsxruntime.jsx("input", {
        ref: ref,
        ...props
    }));
});
const $2d7505cde7b5bbb4$var$Select = /*#__PURE__*/ $3hEOU$react.forwardRef((props, ref)=>{
    return(/*#__PURE__*/ $3hEOU$reactjsxruntime.jsx("select", {
        ref: ref,
        ...props
    }));
});
const $2d7505cde7b5bbb4$var$TextArea = /*#__PURE__*/ $3hEOU$react.forwardRef((props, ref)=>{
    return(/*#__PURE__*/ $3hEOU$reactjsxruntime.jsx("textarea", {
        ref: ref,
        ...props
    }));
});
const $2d7505cde7b5bbb4$export$a455218a85c89869 = $7e043fd2f1fe1b7b$export$45688d1308b4bdba({
    input: $2d7505cde7b5bbb4$var$Input,
    select: $2d7505cde7b5bbb4$var$Select,
    textArea: $2d7505cde7b5bbb4$var$TextArea
}, "input");






const $84b0650d9bbb05a6$var$fastestValidator = new ($parcel$interopDefault($3hEOU$fastestvalidator))();
const $84b0650d9bbb05a6$export$f92bf56fabb8547d = $7e043fd2f1fe1b7b$export$af85c40c8b614364((rule, validator)=>{
    const plugFieldName = "$__formix.field__$";
    const check = (validator || $84b0650d9bbb05a6$var$fastestValidator).compile({
        $$async: true,
        [plugFieldName]: rule
    });
    return async (value, fieldName)=>{
        const result = await check({
            [plugFieldName]: value
        });
        if (result === true || !result.length) return "";
        return result[0].message?.replaceAll(plugFieldName, fieldName);
    };
});



const $f15e190a8e50bd5f$export$75ad5962a3abf5b = $7e043fd2f1fe1b7b$export$af85c40c8b614364((schema)=>{
    return async (value)=>{
        try {
            if (schema?.validateAsync) await schema.validateAsync(value);
            return "";
        } catch (error) {
            // @ts-ignore
            return error?.message || "";
        }
    };
});




//# sourceMappingURL=index.js.map

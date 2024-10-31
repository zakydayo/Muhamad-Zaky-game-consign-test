import React, {useCallback, useEffect, useState} from 'react';
import {
    FieldDefinition,
    FormErrors,
    FormModel,
    ModelPath,
    SubmitHandler,
    UseFormGeneratorProps,
    UseFormGeneratorReturn,
    UseFormGenHandleSubmit
} from "@/components/form/types";
import cloneObject from "@/utils/cloneObject";
import set from "@/utils/set";
import deepEqual from "@/utils/deepEqual";
import {PrimitiveValues} from "@/utils/types";

// TODO: Challenge #1 - There's bug hidden in this file.
export function useFormGen(props: UseFormGeneratorProps): UseFormGeneratorReturn {

    const [state, setState] = useState({
        isDirty: false,
        isLoading: true,
        isSubmitting: false,
        isSubmitted: false,
        errors: {} as FormErrors,
        defaultValue: props.model as FormModel,
    });

    const [model, setModel] = useState({} as FormModel);

    useEffect(() => {
        // init values from
        setTimeout(() => {
            setModel(props.model);
            setState((prev) => {
                return {
                    ...prev,
                    isLoading: false
                }
            });
        }, 500); // timeout set here just to illustrate a loader for form gen.
    }, []);

    useEffect(() => {
        const isDirty = !deepEqual(model, state.defaultValue);
        if (isDirty != state.isDirty) {
            setState((prev) => {
                return {
                    ...prev,
                    isDirty: isDirty
                }
            });
        }
    }, [model, state.defaultValue, state.isDirty]);

    const validateField = useCallback((field: FieldDefinition, value: PrimitiveValues) => {
        const errors: string[] = [];
        
        field.rules?.forEach(rule => {
            switch (rule.name) {
                case "required": 
                    if (!value || value.toString().trim() === '') errors.push(`${field.label?.text || "Field"} is mandatory, can't be empty.`);
                    break;
                case "minLength": 
                    if (typeof value === "string" && value.length < (rule.value as number)) errors.push(`${field.label?.text || "Field"} must be at least ${rule.value} characters.`);
                    break;
                case "pattern": 
                    if (typeof value === "string" && !(rule.value as RegExp).test(value)) errors.push(`${field.label?.text || "Field"} is invalid.`);
                    break;
                case "custom":
                    if (typeof rule.validate === "function") {
                        const customError = rule.validate(value);
                        if (customError) errors.push(customError);
                    }
                    break;
                default:
                    break;
            }
        });
    
        return errors;
    }, []);    

    const updateErrors = useCallback((path: ModelPath, errorMessages: string[]) => {
        setState((prev) => {
            const newErrors = { ...prev.errors };
            if (errorMessages.length) {
                newErrors[path] = errorMessages;
            } else {
                delete newErrors[path];
            }
            return { ...prev, errors: newErrors };
        });
    }, []);

    const updateModelValue = useCallback((path: ModelPath, definition: FieldDefinition, value: PrimitiveValues, onBlur = false) => {
        setModel((prev) => {
            const newModel = cloneObject(prev);
            set(newModel, path, value);
            return newModel;
        });

        if (onBlur) {
            const errors = validateField(definition, value);
            updateErrors(path, errors);
        }
    },[model, state, validateField, updateErrors]);

    const handleValidFlow = async(onValid: SubmitHandler, modelForSubmit: FormModel) => {
        try {
            await onValid(modelForSubmit);
            setState((prev) => {
                return {
                    ...prev,
                    isSubmitting: false,
                    isSubmitted: true
                }
            });
        } catch (error) {
            setState((prev) => {
                return {
                    ...prev,
                    isSubmitting: false,
                    isSubmitted: false
                }
            });
            throw error;
        }
    }

    const handleInvalidFlow = async(onInvalid:SubmitHandler, modelForSubmit: FormModel) => {
        try {
            await onInvalid(modelForSubmit);
        }
        catch (error) {
            throw error;
        }
        finally {
            setState((prev) => {
                return {
                    ...prev,
                    isSubmitting: false,
                    isSubmitted: false
                }
            });
        }
    }

    const handleSubmit: UseFormGenHandleSubmit = (onValid, onInvalid) =>
        async(e?: React.BaseSyntheticEvent) => {
        if (e) {
            e.preventDefault && e.preventDefault();
            e.persist && e.persist();
        }
        setState((prev) => {
            return {
                ...prev,
                isSubmitting: true
            }
        });
        const modelForSubmit = cloneObject(model);
        if (Object.keys(state.errors).length > 0) {
            if (onInvalid) {
                await handleInvalidFlow(onInvalid, modelForSubmit);
            }
            return;
        }
        await handleValidFlow(onValid, modelForSubmit);
    }

    return {
        state,
        model,
        updateModelValue,
        handleSubmit,
    };
}
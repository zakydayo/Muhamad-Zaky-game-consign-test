import React from "react";
import { FormFieldProps } from "@/components/form/types";
import { TextField } from "@/components/form/fields/TextField";
import { FormLabel } from "@/components/form/FormLabel";

const FormField = React.memo(
    React.forwardRef<HTMLDivElement, FormFieldProps>((
        {
            field,
            path,
            value,
            errors,
            updateModelValue,
            ...props
        },
        ref
    ) => {
        const generateField = () => {
            let Component = null;

            switch (field.type) {
                case "text":
                    Component = TextField;
                    break;
                default:
                    return <></>;
            }

            return (
                <FormLabel label={field.label} errors={errors} path={path}>
                    <Component
                        field={field}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        // @ts-ignore
                        value={value}
                        path={path}
                        updateModelValue={updateModelValue}
                    />
                </FormLabel>
            );
        };

        return generateField();
    })
);

FormField.displayName = 'FormField';

export { FormField };

// components/PasswordField.tsx

import { TextFieldProps } from "@/components/form/types";
import { Input } from "@/components/ui/input"; // Assuming you have an Input component
import React, { useEffect, useState } from "react";

const PasswordField = React.forwardRef<HTMLInputElement, TextFieldProps>(
    ({ field, value, path, updateModelValue, ...props }, ref) => {
        const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

        useEffect(() => {
            console.log(`PasswordField ${path} mounted`);
            return () => {
                console.log(`PasswordField ${path} unmounted`);
            };
        }, []);

        useEffect(() => {
            console.log(`PasswordField ${path} rerendered`);
        });

        const togglePasswordVisibility = () => {
            setIsPasswordVisible(prev => !prev);
        };

        return (
            <div className="relative">
                <Input
                    ref={ref}
                    name={field.name}
                    id={path}
                    type={isPasswordVisible ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => updateModelValue(path, field, e.target.value)}
                    {...props}
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                >
                    {isPasswordVisible ? 'H' : 'S'}
                </button>
            </div>
        );
    }
);

PasswordField.displayName = 'PasswordField';
export { PasswordField };

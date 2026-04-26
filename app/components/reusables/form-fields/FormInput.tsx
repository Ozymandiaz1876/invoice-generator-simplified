"use client";

// RHF
import { useFormContext } from "react-hook-form";

// ShadCn
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input, InputProps } from "@/components/ui/input";

type FormInputProps = {
    name: string;
    label?: string;
    labelHelper?: string;
    placeholder?: string;
    vertical?: boolean;
    fullWidth?: boolean;
} & InputProps;

const FormInput = ({
    name,
    label,
    labelHelper,
    placeholder,
    vertical = false,
    fullWidth = true,
    className,
    ...props
}: FormInputProps) => {
    const { control } = useFormContext();

    const inputClassName = fullWidth ? "w-full" : "w-[13rem]";

    const verticalInput = (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel>{`${label}:`}</FormLabel>}

                    {labelHelper && (
                        <span className="text-xs"> {labelHelper}</span>
                    )}

                    <FormControl>
                        <Input
                            {...field}
                            placeholder={placeholder}
                            className={`${inputClassName} ${className || ""}`}
                            {...props}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    const horizontalInput = (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <div className={`flex ${fullWidth ? "flex-col sm:flex-row" : ""} w-full gap-2 sm:gap-5 items-start sm:items-center text-sm`}>
                        {label && <FormLabel className={fullWidth ? "w-full sm:w-auto sm:flex-1" : "flex-1"}>{`${label}:`}</FormLabel>}
                        {labelHelper && (
                            <span className="text-xs"> {labelHelper}</span>
                        )}

                        <div className={fullWidth ? "w-full sm:flex-1" : "flex-1"}>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={placeholder}
                                    className={`${inputClassName} ${className || ""}`}
                                    {...props}
                                />
                            </FormControl>
                            <FormMessage />
                        </div>
                    </div>
                </FormItem>
            )}
        />
    );
    return vertical ? verticalInput : horizontalInput;
};

export default FormInput;

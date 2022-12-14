import React from "react";
import { useForm } from "react-hook-form";
import { numericTemplate } from "./utils";
export const ProductForm = ({ onSubmit, initialData = {} }) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm();

    const handleOnSubmit = (product) => {
        onSubmit(product);
    };

    function myNumericTemplate(label, field) {
        return numericTemplate(label, field, initialData, errors, register);
    }

    return (
        <form onSubmit={handleSubmit(handleOnSubmit)}>
            <div className="form-container">
                <div className="form-field-container">
                    <label>Product ID</label>
                    <input
                        {...(initialData.product_id && { readOnly: true, defaultValue: initialData.product_id })}
                        type="text"
                        {...register("product_id", {
                            required: true,
                        })}
                    />
                    {errors.product_id?.type === "required" && (
                        <p className="form-field-validation-error">Required field</p>
                    )}
                </div>
                {myNumericTemplate("Reserves", "reserves")}
                {myNumericTemplate("Cost", "cost")}
                {myNumericTemplate("API Gravity", "API_gravity")}
                {myNumericTemplate("Sulfur", "sulfur")}
                <div className="right">
                    <input type="submit" value="Submit" className="btn"></input>
                </div>
            </div>
        </form>
    );
};

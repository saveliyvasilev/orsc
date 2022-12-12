import React from "react";
import { useForm } from "react-hook-form";

export const ProductForm = ({ onSubmit, initialData = null }) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm();

    const handleOnSubmit = (product) => {
        onSubmit(product);
    };

    return (
        <div className="modal">
            <form onSubmit={handleSubmit(handleOnSubmit)}>
                <div className="form-container">
                    <div className="form-field-container">
                        <label>Product ID</label>
                        <input
                            type="text"
                            {...register("product_id", {
                                required: true,
                            })}
                        />
                        {errors.product_id?.type === "required" && (
                            <p className="form-field-validation-error">Required field</p>
                        )}
                    </div>
                    <div className="form-field-container">
                        <label>Reserves</label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("reserves", {
                                required: true,
                                valueAsNumber: true,
                                min: 0,
                            })}
                        />
                        {errors.reserves?.type === "required" && (
                            <p className="form-field-validation-error">Required field</p>
                        )}
                        {errors.reserves?.type === "min" && (
                            <p className="form-field-validation-error">Value must be positive</p>
                        )}
                    </div>
                    <div className="form-field-container">
                        <label>Cost</label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("cost", {
                                required: true,
                                valueAsNumber: true,
                                min: 0,
                            })}
                        />
                        {errors.cost?.type === "required" && (
                            <p className="form-field-validation-error">Required field</p>
                        )}
                        {errors.cost?.type === "min" && (
                            <p className="form-field-validation-error">Value must be positive</p>
                        )}
                    </div>
                    <div className="form-field-container">
                        <label>API Gravity</label>
                        <input
                            type="number"
                            step=".5"
                            {...register("API_gravity", {
                                required: true,
                                valueAsNumber: true,
                                min: 0,
                            })}
                        />
                        {errors.API_gravity?.type === "required" && (
                            <p className="form-field-validation-error">Required field</p>
                        )}
                        {errors.API_gravity?.type === "min" && (
                            <p className="form-field-validation-error">Value must be positive</p>
                        )}
                    </div>
                    <div className="form-field-container">
                        <label>Sulfur</label>
                        <input
                            type="number"
                            step=".01"
                            {...register("sulfur", {
                                required: true,
                                valueAsNumber: true,
                                min: 0,
                            })}
                        />
                        {errors.sulfur?.type === "required" && (
                            <p className="form-field-validation-error">Required field</p>
                        )}
                        {errors.sulfur?.type === "min" && (
                            <p className="form-field-validation-error">Value must be positive</p>
                        )}
                    </div>
                    <div className="right">
                        <input type="submit" value="Submit" className="btn"></input>
                    </div>
                </div>
            </form>
        </div>
    );
};

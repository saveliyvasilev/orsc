import React from "react";
import { useForm } from "react-hook-form";

export const OrderForm = ({ onSubmit, initialData = {} }) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm();

    const handleOnSubmit = (order) => {
        onSubmit(order);
    };

    function numericTemplate(label, field) {
        return (
            <div className="form-field-container">
                <label>{label}</label>
                <input
                    type="number"
                    step="any"
                    {...(initialData[field] && { defaultValue: initialData[field] })}
                    {...register(field, {
                        required: true,
                        valueAsNumber: true,
                        min: 0,
                    })}
                />
                {errors[field]?.type === "required" && <p className="form-field-validation-error">Required field</p>}
                {errors[field]?.type === "min" && <p className="form-field-validation-error">Value must be positive</p>}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(handleOnSubmit)}>
            <div className="form-container order-form-container">
                <div className="form-field-container">
                    <label>Order ID</label>
                    <input
                        {...(initialData.order_id && { readOnly: true, defaultValue: initialData.order_id })}
                        type="text"
                        {...register("order_id", {
                            required: true,
                        })}
                    />
                    {errors.order_id?.type === "required" && (
                        <p className="form-field-validation-error">Required field</p>
                    )}
                </div>
                {numericTemplate("Amount", "amount")}
                <div className="form-section">
                    <div className="title">API Gravity</div>
                    <div className="assay-input-container">
                        {numericTemplate("Min", "API_gravity_hard_lb")}
                        {numericTemplate("Soft min", "API_gravity_soft_lb")}
                        {numericTemplate("Soft max", "API_gravity_soft_ub")}
                        {numericTemplate("Max", "API_gravity_hard_ub")}
                    </div>
                </div>
                <div className="form-section">
                    <div className="title">Sulfur</div>
                    <div className="assay-input-container">
                        {numericTemplate("Min", "sulfur_hard_lb")}
                        {numericTemplate("Soft min", "sulfur_soft_lb")}
                        {numericTemplate("Soft max", "sulfur_soft_ub")}
                        {numericTemplate("Max", "sulfur_hard_ub")}
                    </div>
                </div>
                <div className="right">
                    <input type="submit" value="Submit" className="btn"></input>
                </div>
            </div>
        </form>
    );
};

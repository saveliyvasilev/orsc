import React from "react";
import { useForm } from "react-hook-form";
import { numericTemplate } from "./utils";

export const OrderForm = ({ onSubmit, initialData = {} }) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm();

    const handleOnSubmit = (order) => {
        onSubmit(order);
    };

    function myNumericTemplate(label, field) {
        return numericTemplate(label, field, initialData, errors, register);
    }

    return (
        <form onSubmit={handleSubmit(handleOnSubmit)} autocomplete="off">
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
                {myNumericTemplate("Amount", "amount")}
                <div className="form-section">
                    <div className="title">API Gravity</div>
                    <div className="assay-input-container">
                        {myNumericTemplate("Min", "API_gravity_hard_lb")}
                        {myNumericTemplate("Soft min", "API_gravity_soft_lb")}
                        {myNumericTemplate("Soft max", "API_gravity_soft_ub")}
                        {myNumericTemplate("Max", "API_gravity_hard_ub")}
                    </div>
                </div>
                <div className="form-section">
                    <div className="title">Sulfur</div>
                    <div className="assay-input-container">
                        {myNumericTemplate("Min", "sulfur_hard_lb")}
                        {myNumericTemplate("Soft min", "sulfur_soft_lb")}
                        {myNumericTemplate("Soft max", "sulfur_soft_ub")}
                        {myNumericTemplate("Max", "sulfur_hard_ub")}
                    </div>
                </div>
                <div className="right">
                    <input type="submit" value="Submit" className="btn"></input>
                </div>
            </div>
        </form>
    );
};

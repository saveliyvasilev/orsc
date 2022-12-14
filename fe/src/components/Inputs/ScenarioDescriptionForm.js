import React from "react";
import { useForm } from "react-hook-form";

export const ScenarioDescriptionForm = ({ onSubmit, name = "" }) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm();

    const handleOnSubmit = (formData) => {
        console.log(formData);
        onSubmit(formData.name);
    };

    return (
        <form onSubmit={handleSubmit(handleOnSubmit)} autocomplete="off">
            <div className="form-container">
                <div className="form-field-container">
                    <label>Scenario name</label>
                    <input
                        type="text"
                        {...(name && { defaultValue: name })}
                        {...register("name", {
                            required: true,
                        })}
                    />
                    {errors.reserves?.type === "required" && (
                        <p className="form-field-validation-error">Required field</p>
                    )}
                </div>
                <div className="right">
                    <input type="submit" value="Submit" className="btn"></input>
                </div>
            </div>
        </form>
    );
};

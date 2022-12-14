export function numericTemplate(label, field, initialData, errors, register, submitOnBlur = null) {
    return (
        <div className="form-field-container">
            <label>{label}</label>
            <input
                type="number"
                {...(submitOnBlur && { onBlurCapture: submitOnBlur })}
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

// import { assayFormat, barrelFormat, currencyFormat } from "../../formatter";
// import { assayRanges } from "../../config";

import { useForm } from "react-hook-form";
import { numericTemplate } from "./utils";

export const ScenarioSettings = ({ scenarioSettings, onSubmit }) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm();

    const handleOnSubmit = (scenarioSettings) => {
        onSubmit(scenarioSettings);
    };

    function myNumericTemplate(label, field) {
        return numericTemplate(label, field, scenarioSettings, errors, register, handleSubmit(handleOnSubmit));
    }

    return (
        <form autocomplete="off">
            <div className="center">
                <div className="form-container objective-function-form-container">
                    {myNumericTemplate("Underload cost (per unit)", "underload_cost")}
                    {myNumericTemplate(
                        "API Gravity deviation cost (per unit x assay deviation)",
                        "API_gravity_deviation_cost"
                    )}
                    {myNumericTemplate("Sulfur deviation cost (per unit x assay deviation)", "sulfur_deviation_cost")}
                </div>
            </div>
        </form>
    );
};

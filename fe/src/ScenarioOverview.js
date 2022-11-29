import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "./axiosInstance";
import moment from "moment";
import { currencyFormat, barrelFormat } from "./formatter";

export const ScenarioOverview = () => {
    const [scenarios, setScenarios] = useState(null);

    function demand(scenario) {
        if (scenario.output === undefined) {
            return "";
        } else {
            return barrelFormat(scenario.output.kpis.total_demand);
        }
    }
    function underload(scenario) {
        if (scenario.output === undefined) {
            return "";
        } else {
            return barrelFormat(scenario.output.kpis.total_underload);
        }
    }
    function cost(scenario) {
        if (scenario.output === undefined) {
            return "";
        } else {
            return currencyFormat(scenario.output.kpis.total_product_cost);
        }
    }
    function optimizationTime(scenario) {
        return moment(scenario.created_at).fromNow();
    }
    function handleDelete(event, scenario) {
        event.stopPropagation();
        axios
            .delete(`/scenarios/${scenario.scenario_id}`)
            .then((res) => {
                if (res.status === 204) {
                    setScenarios(scenarios.filter((s) => s.scenario_id !== scenario.scenario_id));
                }
            })
            .catch((reason) => console.log(reason));
    }
    useEffect(() => {
        const getScenarios = async () => {
            const res = await axios.get("/scenarios");
            setScenarios(res.data);
        };
        getScenarios();
    }, []);
    return (
        <div className="main-content-container-background">
            <div className="main-content-container">
                <table>
                    <thead>
                        <tr>
                            <th>Scenario name</th>
                            <th>Optimization time</th>
                            <th>Demand</th>
                            <th>Underload</th>
                            <th>Cost</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scenarios == null ? (
                            <tr>
                                <td colSpan={5}>"Loading"</td>
                            </tr>
                        ) : (
                            scenarios.map((scenario) => (
                                <tr key={scenario.scenario_id}>
                                    <td>
                                        <Link to={"/scenarios/" + scenario.scenario_id}>{scenario.name}</Link>
                                    </td>
                                    <td>{optimizationTime(scenario)}</td>
                                    <td>{demand(scenario)}</td>
                                    <td>{underload(scenario)}</td>
                                    <td>{cost(scenario)}</td>
                                    <td>{scenario.status}</td>
                                    <td>
                                        <span
                                            className="material-symbols-outlined danger icon outlined"
                                            alt="Delete"
                                            onClick={(event) => handleDelete(event, scenario)}
                                        >
                                            delete
                                        </span>
                                        <span className="material-symbols-outlined accent icon outlined" alt="Edit">
                                            edit
                                        </span>
                                        <span className="material-symbols-outlined accent icon outlined" alt="Favotite">
                                            favorite
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="main-content-container right">
                    <Link to={"/input"}>
                        <div className="new-scenario-btn">New Scenario</div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

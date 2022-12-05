import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "./axiosInstance";
import moment from "moment";
import { currencyFormat, barrelFormat } from "./formatter";
import { Section } from "./components/Section";

export const ScenarioOverview = () => {
    const [scenarios, setScenarios] = useState(null);
    const navigate = useNavigate();

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
    function handleNewScenario() {
        navigate("/input", { replace: true });
    }
    useEffect(() => {
        const getScenarios = async () => {
            const res = await axios.get("/scenarios");
            setScenarios(res.data);
        };
        getScenarios();
    }, []);
    return (
        <>
            <Section>
                <div className="table-container" style={{ maxHeight: "1400px" }}>
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
                                    <td colSpan={7}>"Loading"</td>
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
                                            <span
                                                className="material-symbols-outlined accent icon outlined"
                                                alt="Favorite"
                                            >
                                                favorite
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Section>
            <Section>
                <div className="right">
                    <div className="btn" onClick={handleNewScenario}>
                        New Scenario
                    </div>
                </div>
            </Section>
        </>
    );
};

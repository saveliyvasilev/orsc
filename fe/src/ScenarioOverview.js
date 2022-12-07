import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "./axiosInstance";
import moment from "moment";
import { currencyFormat, barrelFormat } from "./formatter";
import { Section } from "./components/Section";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useInterval } from "./hooks/useInterval";

export const ScenarioOverview = () => {
    const [scenarios, setScenarios] = useState(null);
    const navigate = useNavigate();
    function demandTemplate(scenario) {
        if (scenario.output === undefined) {
            return "";
        } else {
            return barrelFormat(scenario.output.kpis.total_demand);
        }
    }
    function underloadTemplate(scenario) {
        if (scenario.output === undefined) {
            return "";
        } else {
            return barrelFormat(scenario.output.kpis.total_underload);
        }
    }
    function costTemplate(scenario) {
        if (scenario.output === undefined) {
            return "";
        } else {
            return currencyFormat(scenario.output.kpis.total_product_cost);
        }
    }
    function optimizationTimeTemplate(scenario) {
        return moment(scenario.created_at).fromNow();
    }
    function statusTemplate(scenario) {
        if (scenario.status === undefined) {
            return "";
        } else {
            return (
                <span className={`scenario-status-badge scenario-status-${scenario.status}`}>{scenario.status}</span>
            );
        }
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
    useInterval(() => {
        // TODO: Don't active-poll if it's a very often used app by many users
        // TODO: Maybe consider doing a separate API tor reduce querying or paginate -- this re-renders on each call.
        console.log("Polling for scenarios");
        const getScenarios = async () => {
            const res = await axios.get("/scenarios");
            setScenarios(res.data);
        };
        getScenarios();
    }, 5000);
    return (
        <>
            <Section>
                <div className="table-container">
                    <DataTable value={scenarios} responsiveLayout="scroll" scrollable scrollHeight="70vh">
                        <Column
                            header="Scenario name"
                            field="name"
                            body={(rowData) => <Link to={"/scenarios/" + rowData.scenario_id}>{rowData.name}</Link>}
                        />
                        <Column header="Optimization time" field="created_at" body={optimizationTimeTemplate} />
                        <Column header="Demand" body={demandTemplate} />
                        <Column header="Underload" body={underloadTemplate} />
                        <Column header="Cost" body={costTemplate} />
                        <Column header="Status" body={statusTemplate} />
                        <Column
                            header="Action"
                            body={(scenario) => (
                                <>
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
                                    <span className="material-symbols-outlined accent icon outlined" alt="Favorite">
                                        favorite
                                    </span>
                                </>
                            )}
                        />
                    </DataTable>
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

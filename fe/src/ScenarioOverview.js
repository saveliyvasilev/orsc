import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "./axiosInstance";

export const ScenarioOverview = () => {
    const [scenarios, setScenarios] = useState(null);

    function handleDelete(event, scenario) {
        event.stopPropagation();
        axios
            .delete(`/scenarios/${scenario.id}`)
            .then((res) => {
                if (res.status === 204) {
                    setScenarios(scenarios.filter((s) => s.id !== scenario.id));
                }
            })
            .catch((reason) => console.log(reason));
    }

    function handleNewScenario(event) {
        // TODO: This should call a GET for a fresh data pull and jump to an overview page; not make a new scenario entry via POST
        event.stopPropagation();
        axios.post("/scenarios").then((res) => {
            if (res.status === 201) {
                setScenarios([...scenarios, res.data]);
            }
        });
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
                            <th>Estimated cost</th>
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
                                <tr key={scenario.id}>
                                    <td>
                                        <Link to={"/scenarios/" + scenario.id}>{scenario.name}</Link>
                                    </td>
                                    <td>{scenario.optTime}</td>
                                    <td>{scenario.kpi}</td>
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
                    <div className="new-scenario-btn" onClick={handleNewScenario}>
                        New Row
                    </div>
                </div>
            </div>
        </div>
    );
};

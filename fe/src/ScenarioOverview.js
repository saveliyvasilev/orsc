import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import axios from './axiosInstance';

export const ScenarioOverview = () => {
    const [scenarios, setScenarios] = useState(null);

    useEffect(() => {
        const getScenarios = async () => {
            const res = await axios.get("/scenarios")
            setScenarios(res.data)
        }
        getScenarios();

    }, [])
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
                        {scenarios == null ? <tr><td colSpan={5}>
                            "Loading"</td></tr> :
                            scenarios.map(scenario => (
                                <tr key={scenario.id}>
                                    <td><Link to={"/scenarios/" + (scenario.id)}>{scenario.name}</Link></td>
                                    <td>{scenario.optTime}</td>
                                    <td>{scenario.kpi}</td>
                                    <td>{scenario.status}</td>
                                    <td>
                                        <span className="material-symbols-outlined danger icon outlined" alt="Delete">delete</span>
                                        <span className="material-symbols-outlined accent icon outlined" alt="Edit">edit</span>
                                        <span className="material-symbols-outlined accent icon outlined" alt="Favotite">favorite</span>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <div className="main-content-container right">
                    <div className="new-scenario-btn">New Scenario</div>
                </div>
            </div>
        </div>
    )
}

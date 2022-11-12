import { Link } from 'react-router-dom'

export const ScenarioOverview = () => {
    const scenarios = [{
        id: 1,
        name: "Extra sales to c1",
        optTime: "16:22 16/11/2022",
        kpi: "$ 2,580,000",
        status: "Completed"
    },
    {
        id: 2,
        name: "Extra sales to c1",
        optTime: "16:15 16/11/2022",
        kpi: "$ 2,380,000",
        status: "Completed"
    },
    {
        id: 3,
        name: "Extra sales to c1",
        optTime: "16:15 16/11/2022",
        kpi: "$ 2,380,000",
        status: "Completed"
    },
    {
        id: 4,
        name: "Extra sales to c1",
        optTime: "16:15 16/11/2022",
        kpi: "$ 2,380,000",
        status: "Completed"
    }
    ];


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
                        {scenarios.map(scenario => (
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
                        ))}
                    </tbody>
                </table>
                <div className="main-content-container right">
                    <div className="new-scenario-btn">New Scenario</div>
                </div>
            </div>
        </div>
    )
}

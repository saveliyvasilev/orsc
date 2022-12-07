export const ScenarioOutputHeader = ({ scenario }) => {
    return (
        <div className="space-between">
            <div className="section-header">{scenario.name}</div>
            <div className="comment">Scenario id: {scenario.scenario_id}</div>
        </div>
    );
};

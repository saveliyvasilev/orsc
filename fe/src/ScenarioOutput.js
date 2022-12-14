import axios from "./axiosInstance";
import { useState, useEffect } from "react";
import { barrelFormat } from "./formatter";
import { KPICard } from "./components/KPICard";
import { OrderFulfillmentTable } from "./components/OrderFulfillmentTable";
import { ProductUsageTable } from "./components/ProductUsageTable";

import { useNavigate, useParams } from "react-router-dom";
import { Section } from "./components/Section";
import { ScenarioOutputHeader } from "./components/ScenarioOutputHeader";

import { TabView, TabPanel } from "primereact/tabview";

export const ScenarioOutput = () => {
    const { scenario_id } = useParams();
    const [scenario, setScenario] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        console.log(`Retrieving ${scenario_id}`);
        axios.get(`/scenarios/${scenario_id}`).then((res) => {
            if (res.status === 200) {
                setScenario(res.data);
            }
        });
    }, [scenario_id]);

    function handleDuplicateAndEditClick() {
        navigate(`/input/${scenario_id}`, { replace: true });
    }
    return (
        <>
            {scenario.input !== undefined ? (
                <>
                    <Section>
                        <ScenarioOutputHeader scenario={scenario}></ScenarioOutputHeader>
                    </Section>
                    <Section>
                        <div className="card-container">
                            <KPICard
                                title="Total Demand"
                                value={barrelFormat(scenario.output.kpis.total_demand)}
                            ></KPICard>
                            <KPICard
                                title="Total Underload"
                                value={barrelFormat(scenario.output.kpis.total_underload)}
                            ></KPICard>
                            <KPICard
                                title="Total Cost"
                                value={barrelFormat(scenario.output.kpis.total_product_cost)}
                            ></KPICard>
                            <KPICard
                                title="Available product"
                                value={barrelFormat(scenario.output.kpis.total_initial_product)}
                            ></KPICard>
                            <KPICard
                                title="Leftover product"
                                value={barrelFormat(scenario.output.kpis.total_leftover_product)}
                            ></KPICard>
                        </div>
                    </Section>
                    <Section>
                        <TabView renderActiveOnly={false}>
                            <TabPanel header="Order Fulfillment">
                                <OrderFulfillmentTable orders={scenario.output.orders} />
                            </TabPanel>
                            <TabPanel header="Product usage">
                                <ProductUsageTable productUsage={scenario.output.product_usage} />
                            </TabPanel>
                        </TabView>
                    </Section>
                    <Section>
                        <div className="right">
                            <div className="btn" onClick={handleDuplicateAndEditClick}>
                                Duplicate and edit
                            </div>
                        </div>
                    </Section>
                </>
            ) : (
                "Fetching data"
            )}
        </>
    );
};

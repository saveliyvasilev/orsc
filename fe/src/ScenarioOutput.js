import axios from "./axiosInstance";
import { useState, useEffect } from "react";
import { barrelFormat } from "./formatter";
import { KPICard } from "./components/KPICard";
import { OrderFulfillmentTable } from "./components/OrderFulfillmentTable";
import { ProductUsageTable } from "./components/ProductUsageTable";

import { useParams } from "react-router-dom";
import { Section } from "./components/Section";
import { StickyHeader } from "./components/Section/StickyHeader";
import { ScenarioOutputHeader } from "./components/ScenarioOutputHeader";

export const ScenarioOutput = () => {
    const { queryId } = useParams();
    const [scenario, setScenario] = useState({});

    useEffect(() => {
        console.log(`Retrieving ${queryId}`);
        axios.get(`/scenarios/${queryId}`).then((res) => {
            if (res.status === 200) {
                setScenario(res.data);
            }
        });
    }, [queryId]);

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
                        <StickyHeader>Order Fulfillment</StickyHeader>
                        <OrderFulfillmentTable orders={scenario.output.orders} />
                    </Section>
                    <Section>
                        <StickyHeader>Product usage</StickyHeader>
                        <ProductUsageTable productUsage={scenario.output.product_usage} />
                    </Section>

                    <Section>
                        <div className="right">
                            <div className="btn" onClick={() => console.log("TBD")}>
                                [TBD] Duplicate and edit
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

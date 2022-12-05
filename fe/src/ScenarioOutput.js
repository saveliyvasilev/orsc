import axios from "./axiosInstance";
import { useState, useEffect } from "react";
import { barrelFormat } from "./formatter";
import { KPICard } from "./components/KPICard";
import { OrderFulfillmentTable } from "./components/OrderFulfillmentTable";

import { useParams } from "react-router-dom";
import { Section } from "./components/Section";
import { StickyHeader } from "./components/Section/StickyHeader";

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
                        <StickyHeader>{scenario.name}</StickyHeader>
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
                        </div>
                    </Section>
                    <Section>
                        <StickyHeader>Order Fulfillment</StickyHeader>
                        <OrderFulfillmentTable orders={scenario.output.orders} />
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

import axios from "./axiosInstance";
import { prcfg } from "./config";
import { useState, useEffect } from "react";
import { assayFormat, barrelFormat, currencyFormat } from "./formatter";
import { KPICard } from "./components/KPICard";
import { OrderFulfillmentTable } from "./components/OrderFulfillmentTable";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { useNavigate, useParams } from "react-router-dom";
import { Section } from "./components/Section";
import { StickyHeader } from "./components/Section/StickyHeader";

// import { debounce } from "lodash";

export const ScenarioOutput = () => {
    const { queryId } = useParams();
    const [scenario, setScenario] = useState({});
    // const navigate = useNavigate();

    useEffect(() => {
        console.log(`Retrieving ${queryId}`);
        axios.get(`/scenarios/${queryId}`).then((res) => {
            if (res.status === 200) {
                setScenario(res.data);
            }
        });
    }, [queryId]);

    // function reservesBodyTemplate(rowData) {
    //     return barrelFormat(rowData.reserves);
    // }

    // function APIGravityBodyTemplate(rowData) {
    //     return assayFormat(rowData.API_gravity);
    // }

    // function sulfurBodyTemplate(rowData) {
    //     return assayFormat(rowData.sulfur);
    // }

    // function costBodyTemplate(rowData) {
    //     return currencyFormat(rowData.cost);
    // }

    // function demandBodyTemplate(rowData) {
    //     return barrelFormat(rowData.amount);
    // }

    // TODO: Refactor this into two (or more) components
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

                    {/* <div className="main-content-container-background">
                        <div className="main-content-container">
                            <DataTable value={scenario.input.products} header="Products" responsiveLayout="scroll">
                                <Column field="product_id" header="Product ID"></Column>
                                <Column field="reserves" header="Reserves" body={reservesBodyTemplate}></Column>
                                <Column field="API_gravity" header="API Gravity" body={APIGravityBodyTemplate}></Column>
                                <Column field="sulfur" header="Sulfur" body={sulfurBodyTemplate}></Column>
                                <Column field="cost" header="Cost" body={costBodyTemplate}></Column>
                            </DataTable>
                        </div>
                    </div> */}
                    {/* <div className="main-content-container-background">
                        <div className="main-content-container">
                            <DataTable value={scenario.input.products} header="Products" responsiveLayout="scroll">
                                <Column field="product_id" header="Product ID"></Column>
                                <Column field="reserves" header="Reserves" body={reservesBodyTemplate}></Column>
                                <Column field="API_gravity" header="API Gravity" body={APIGravityBodyTemplate}></Column>
                                <Column field="sulfur" header="Sulfur" body={sulfurBodyTemplate}></Column>
                                <Column field="cost" header="Cost" body={costBodyTemplate}></Column>
                            </DataTable>
                        </div>
                    </div>
                    <div className="main-content-container-background">
                        <div className="main-content-container">
                            <DataTable
                                value={scenario.input.orders}
                                header="Orders"
                                scrollable
                                scrollHeight={prcfg.scrollHeight}
                                responsiveLayout="scroll"
                            >
                                <Column field="order_id" header="Order ID"></Column>
                                <Column field="amount" header="Demand" body={demandBodyTemplate}></Column>
                            </DataTable>
                        </div>
                    </div> */}
                    <Section>
                        <div className="right">
                            <div className="new-scenario-btn" onClick={() => console.log("TBD")}>
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

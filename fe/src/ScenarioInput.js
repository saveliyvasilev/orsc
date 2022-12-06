import axios from "./axiosInstance";
import { assayRanges } from "./config";
import { useState, useEffect } from "react";
import { assayFormat, barrelFormat, currencyFormat } from "./formatter";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import { Section } from "./components/Section";
import { StickyHeader } from "./components/Section/StickyHeader";
import { OrderAssayChart } from "./components/assayCharts/OrderAssayChart";

// import { debounce } from "lodash";

export const ScenarioInput = () => {
    const [sInput, setSInput] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // TODO: This should call a GET for a fresh data pull and jump to an overview page; not make a new scenario entry via POST
        axios.get("/current-snapshot").then((res) => {
            if (res.status === 200) {
                setSInput(res.data);
            }
        });
    }, []);

    function handleOptimize(e) {
        e.stopPropagation();
        axios.post("/optimization-queue", sInput).then((res) => {
            if (res.status === 201) {
                console.log("Submitted optimization!");
                navigate("/", { replace: true });
            }
        });
    }

    function handleScenarioNameOnChange(e) {
        setSInput({
            ...sInput,
            name: e.target.value,
        });
    }

    function reservesBodyTemplate(rowData) {
        return barrelFormat(rowData.reserves);
    }

    function APIGravityBodyTemplate(rowData) {
        return assayFormat(rowData.API_gravity);
    }

    function sulfurBodyTemplate(rowData) {
        return assayFormat(rowData.sulfur);
    }

    function costBodyTemplate(rowData) {
        return currencyFormat(rowData.cost);
    }

    function demandBodyTemplate(rowData) {
        return barrelFormat(rowData.amount);
    }

    function orderAPIBodyTemplate(rowData) {
        return (
            <OrderAssayChart
                assayDetail={{
                    asy_hard_lb: rowData.API_gravity_hard_lb,
                    asy_soft_lb: rowData.API_gravity_soft_lb,
                    asy_soft_ub: rowData.API_gravity_soft_ub,
                    asy_hard_ub: rowData.API_gravity_hard_ub,
                }}
                scaleMin={assayRanges.API_gravity.scaleMin}
                scaleMax={assayRanges.API_gravity.scaleMax}
            ></OrderAssayChart>
        );
    }

    function orderSulfurBodyTemplate(rowData) {
        return (
            <OrderAssayChart
                assayDetail={{
                    asy_hard_lb: rowData.sulfur_hard_lb,
                    asy_soft_lb: rowData.sulfur_soft_lb,
                    asy_soft_ub: rowData.sulfur_soft_ub,
                    asy_hard_ub: rowData.sulfur_hard_ub,
                }}
                scaleMin={assayRanges.sulfur.scaleMin}
                scaleMax={assayRanges.sulfur.scaleMax}
            ></OrderAssayChart>
        );
    }

    // TODO: Refactor this into two (or more) components
    return (
        <>
            {sInput.input !== undefined ? (
                <>
                    <Section>
                        <div className="space-between">
                            <InputText value={sInput.name} onChange={handleScenarioNameOnChange}></InputText>
                            <div className="comment">Scenario id: {sInput.scenario_id}</div>
                        </div>
                    </Section>

                    <Section>
                        <StickyHeader>Products</StickyHeader>
                        <div className="table-container">
                            <DataTable
                                value={sInput.input.products}
                                responsiveLayout="scroll"
                                // scrollable  // This messes up the column widths, so use container css and scrollHeight to make this work
                                scrollHeight="60vh"
                            >
                                <Column field="product_id" header="Product ID"></Column>
                                <Column field="reserves" header="Reserves" body={reservesBodyTemplate}></Column>
                                <Column field="API_gravity" header="API Gravity" body={APIGravityBodyTemplate}></Column>
                                <Column field="sulfur" header="Sulfur" body={sulfurBodyTemplate}></Column>
                                <Column field="cost" header="Cost" body={costBodyTemplate}></Column>
                            </DataTable>
                        </div>
                    </Section>

                    <Section>
                        <StickyHeader>Orders</StickyHeader>
                        <div className="table-container">
                            <DataTable value={sInput.input.orders} responsiveLayout="scroll" scrollHeight="100vh">
                                <Column field="order_id" header="Order ID"></Column>
                                <Column field="amount" header="Demand" body={demandBodyTemplate}></Column>
                                <Column
                                    header="API"
                                    style={{ width: "25em" }}
                                    alignHeader="center"
                                    body={orderAPIBodyTemplate}
                                ></Column>
                                <Column
                                    header="Sulfur"
                                    style={{ width: "25em" }}
                                    alignHeader="center"
                                    body={orderSulfurBodyTemplate}
                                ></Column>
                            </DataTable>
                        </div>
                    </Section>

                    <Section>
                        <div className="right">
                            <div className="btn" onClick={handleOptimize}>
                                Optimize!
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

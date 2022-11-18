import axios from "./axiosInstance";
import { prcfg } from "./config";
import { useState, useEffect } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export const ScenarioInput = () => {
    const [sInput, setSInput] = useState({});
    useEffect(() => {
        // TODO: This should call a GET for a fresh data pull and jump to an overview page; not make a new scenario entry via POST
        axios.get("/scenarios/new").then((res) => {
            if (res.status === 200) {
                setSInput(res.data);
            }
        });
    }, []);

    function handleOptimize(e) {
        e.stopPropagation();
        axios.post("/optimizationqueue", sInput).then((res) => {
            if (res.status === 201) {
                console.log("Submitted optimization!");
            }
        });
    }

    return (
        <>
            {sInput.input !== undefined ? (
                <>
                    <div className="main-content-container-background">
                        <div className="main-content-container">
                            <div>Scenario name: {sInput.name}</div>
                        </div>
                    </div>
                    <div className="main-content-container-background">
                        <div className="main-content-container">
                            <DataTable value={sInput.input.products} header="Products" responsiveLayout="scroll">
                                <Column field="product_id" header="Product ID"></Column>
                                <Column field="reserves" header="Reserves"></Column>
                                <Column field="API_gravity" header="API Gravity"></Column>
                                <Column field="sulfur" header="Sulfur"></Column>
                                <Column field="cost" header="Cost"></Column>
                            </DataTable>
                        </div>
                    </div>
                    <div className="main-content-container-background">
                        <div className="main-content-container">
                            <DataTable
                                value={sInput.input.orders}
                                header="Orders"
                                scrollable
                                scrollHeight={prcfg.scrollHeight}
                                responsiveLayout="scroll"
                            >
                                <Column field="order_id" header="Order ID"></Column>
                                <Column field="amount" header="Amount"></Column>
                            </DataTable>
                        </div>
                    </div>
                    <div className="main-content-container-background">
                        <div className="main-content-container right">
                            <div className="new-scenario-btn" onClick={handleOptimize}>
                                Optimize!
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                "Fetching data"
            )}
        </>
    );
};

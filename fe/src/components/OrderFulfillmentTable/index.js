import { barrelFormat, currencyFormat } from "../../formatter";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";
import { OrderFulfillmentCard } from "./OrderFulfillmentCard";
import { numeric } from "../../config";

export const OrderFulfillmentTable = ({ orders }) => {
    const [expandedRows, setExpandedRows] = useState({});

    const orderFulfillmentCardTemplate = (cardData) => {
        // This is for plugging a component with a prop called "order"
        // into the PrimeFaces Table row expansion template
        return <OrderFulfillmentCard order={cardData}></OrderFulfillmentCard>;
    };

    const assayStatusTemplate = (rowData) => {
        if (Math.abs(rowData.underload_amount - rowData.demand_amount) < numeric.eps) return null;
        const statusLabel = rowData.has_assay_deviation ? "OFF-SPEC" : "ON-SPEC";
        return <span className={`no-select status-badge assay-status-${statusLabel}`}>{statusLabel}</span>;
    };

    const underloadTemplate = (rowData) => {
        if (rowData.underload_amount === 0) return null;
        else return barrelFormat(rowData.underload_amount);
    };

    const loadTemplate = (rowData) => {
        if (Math.abs(rowData.underload_amount - rowData.demand_amount) < numeric.eps) return null;
        else return barrelFormat(rowData.load_amount);
    };

    const costTemplate = (rowData) => {
        if (Math.abs(rowData.underload_amount - rowData.demand_amount) < numeric.eps) return null;
        else return currencyFormat(rowData.load_cost);
    };
    return (
        <div className="table-container clickable-row-cursor">
            <DataTable
                value={orders}
                responsiveLayout="scroll"
                expandedRows={expandedRows}
                rowExpansionTemplate={orderFulfillmentCardTemplate}
                onRowToggle={(e) => {
                    setExpandedRows(e.data);
                }}
                dataKey="order_id"
                sortField="order_id"
                sortOrder={1}
                scrollHeight="80vh"
                onRowClick={(e) => {
                    const id = e.data.order_id;
                    if (id in expandedRows) {
                        const copy = { ...expandedRows };
                        delete copy[id];
                        setExpandedRows(copy);
                    } else {
                        setExpandedRows({
                            ...expandedRows,
                            [id]: true,
                        });
                    }
                }}
            >
                <Column expander={() => true} style={{ width: "3em" }} />
                <Column field="order_id" header="Order" sortable></Column>
                <Column
                    field="demand_amount"
                    header="Demand"
                    sortable
                    body={(rowData) => barrelFormat(rowData.demand_amount)}
                    align="right"
                ></Column>
                <Column field="load_amount" header="Load" sortable body={loadTemplate} align="right"></Column>
                <Column
                    field="underload_amount"
                    header="Underload"
                    sortable
                    body={underloadTemplate}
                    align="right"
                ></Column>
                <Column field="load_cost" header="Cost" sortable body={costTemplate} align="right"></Column>
                <Column
                    field="has_assay_deviation"
                    header="Assays"
                    sortable
                    body={assayStatusTemplate}
                    align="right"
                ></Column>
            </DataTable>
        </div>
    );
};

import { assayFormat, barrelFormat, currencyFormat } from "../../formatter";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";
import { OrderFulfillmentCard } from "./OrderFulfillmentCard";

export const OrderFulfillmentTable = ({ orders }) => {
    const [expandedRows, setExpandedRows] = useState(null);

    return (
        <div className="table-container">
            <DataTable
                value={orders}
                responsiveLayout="scroll"
                expandedRows={expandedRows}
                rowExpansionTemplate={OrderFulfillmentCard}
                onRowToggle={(e) => {
                    console.log(e.data);
                    return setExpandedRows(e.data);
                }}
                dataKey="order_id"
            >
                <Column expander={() => true} style={{ width: "3em" }} />
                <Column field="order_id" header="Order" sortable></Column>
                <Column
                    field="demand_amount"
                    header="Demand"
                    sortable
                    body={(rowData) => barrelFormat(rowData.demand_amount)}
                ></Column>
                <Column
                    field="load_amount"
                    header="Load"
                    sortable
                    body={(rowData) => barrelFormat(rowData.load_amount)}
                ></Column>
                <Column
                    field="underload_amount"
                    header="Underload"
                    sortable
                    body={(rowData) => barrelFormat(rowData.underload_amount)}
                ></Column>
                <Column
                    field="has_assay_deviation"
                    header="Assays"
                    sortable
                    body={(rowData) => rowData.has_assay_deviation}
                ></Column>
                <Column
                    field="load_cost"
                    header="Cost"
                    sortable
                    body={(rowData) => currencyFormat(rowData.load_cost)}
                ></Column>
            </DataTable>
        </div>
    );
};

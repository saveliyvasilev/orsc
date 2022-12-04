import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { assayFormat, barrelFormat, currencyFormat } from "../../../formatter";

export const OrderFulfillmentCard = (order) => {
    return (
        <div className="card">
            <div className="card-title">{order.order_id}</div>
            <div className="table-container">
                <DataTable value={order.load_details} responsiveLayout="scroll">
                    <Column field="product_id" header="Product"></Column>
                    <Column
                        field="load_amount"
                        header="Amount"
                        body={(rowData) => barrelFormat(rowData.load_amount)}
                    ></Column>
                    <Column
                        field="load_cost"
                        header="Cost"
                        body={(rowData) => currencyFormat(rowData.load_cost)}
                    ></Column>
                </DataTable>
            </div>
        </div>
    );
};

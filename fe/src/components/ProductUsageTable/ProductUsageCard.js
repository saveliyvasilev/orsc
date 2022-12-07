import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { barrelFormat, currencyFormat } from "../../formatter";
import { SmallKPICard } from "../SmallKPICard";

export const ProductUsageCard = ({ product }) => {
    return (
        <div className="product-usage-card-container">
            {product.load_details.length ? (
                <>
                    <div className="small-card-container">
                        <SmallKPICard title={"Reserves"} value={barrelFormat(product.reserves)}></SmallKPICard>
                        <SmallKPICard title={"Loaded"} value={barrelFormat(product.loaded)}></SmallKPICard>
                        <SmallKPICard title={"Leftover"} value={barrelFormat(product.leftover)}></SmallKPICard>
                        <SmallKPICard
                            title={"Cost per unit"}
                            value={currencyFormat(product.cost_per_unit)}
                        ></SmallKPICard>
                    </div>
                    <div className="table-container non-clickable-row-cursor light-table-header">
                        <DataTable
                            value={product.load_details}
                            responsiveLayout="scroll"
                            // footerColumnGroup={footerGroup}
                            sortField="load_amount"
                            sortOrder={-1}
                        >
                            <Column field="order_id" header="Order" style={{ width: "12%" }}></Column>
                            <Column
                                field="load_amount"
                                header="Amount"
                                body={(rowData) => barrelFormat(rowData.load_amount)}
                                style={{ width: "12%" }}
                            ></Column>
                        </DataTable>
                    </div>
                </>
            ) : (
                <div className="order-fulfillment-card-title">{product.orders} not loaded</div>
            )}
        </div>
    );
};

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

import { barrelFormat, currencyFormat } from "../../../formatter";
import { OrderAssayChart } from "../../assayCharts/OrderAssayChart";
import { ProductAssayChart } from "../../assayCharts/ProductAssayChart";
import { assayRanges } from "../../../config";

export const OrderFulfillmentCard = ({ order }) => {
    let footerGroup = (
        <ColumnGroup>
            <Row>
                <Column colSpan={2}></Column>
                <Column colSpan={1} footer={() => <span className="row-header">Resulting blend</span>}></Column>
                <Column
                    footer={() => (
                        <OrderAssayChart
                            assayDetail={order.assay_details.filter((ad) => ad.assay_id === "API_gravity")[0]}
                            scaleMin={assayRanges.API_gravity.scaleMin}
                            scaleMax={assayRanges.API_gravity.scaleMax}
                        ></OrderAssayChart>
                    )}
                ></Column>
                <Column
                    footer={() => (
                        <OrderAssayChart
                            assayDetail={order.assay_details.filter((ad) => ad.assay_id === "sulfur")[0]}
                            scaleMin={assayRanges.sulfur.scaleMin}
                            scaleMax={assayRanges.sulfur.scaleMax}
                        ></OrderAssayChart>
                    )}
                ></Column>
            </Row>
        </ColumnGroup>
    );
    return (
        <div className="order-fulfillment-card-container">
            {order.load_details.length ? (
                <>
                    <div className="order-fulfillment-card-title">{order.order_id} details</div>
                    <div className="table-container non-clickable-row-cursor light-table-header">
                        <DataTable
                            value={order.load_details}
                            responsiveLayout="scroll"
                            footerColumnGroup={footerGroup}
                            sortField="load_amount"
                            sortOrder={-1}
                        >
                            <Column field="product_id" header="Product" style={{ width: "12%" }}></Column>
                            <Column
                                field="load_amount"
                                header="Amount"
                                body={(rowData) => barrelFormat(rowData.load_amount)}
                                style={{ width: "12%" }}
                            ></Column>
                            <Column
                                field="load_cost"
                                header="Cost"
                                body={(rowData) => currencyFormat(rowData.load_cost)}
                                style={{ width: "12%" }}
                            ></Column>
                            <Column
                                header="API Gravity"
                                alignHeader="center"
                                style={{ width: "25%" }}
                                body={(rowData) => {
                                    const opa = rowData.order_product_assays.filter(
                                        (opa) => opa.assay_id === "API_gravity"
                                    )[0];
                                    return (
                                        <ProductAssayChart
                                            assayValue={opa.asy_product}
                                            scaleMin={assayRanges.API_gravity.scaleMin}
                                            scaleMax={assayRanges.API_gravity.scaleMax}
                                        />
                                    );
                                }}
                            ></Column>
                            <Column
                                header="Sulfur"
                                alignHeader="center"
                                style={{ width: "25%" }}
                                body={(rowData) => {
                                    const opa = rowData.order_product_assays.filter(
                                        (opa) => opa.assay_id === "sulfur"
                                    )[0];
                                    return (
                                        <ProductAssayChart
                                            assayValue={opa.asy_product}
                                            scaleMin={assayRanges.sulfur.scaleMin}
                                            scaleMax={assayRanges.sulfur.scaleMax}
                                        />
                                    );
                                }}
                            ></Column>
                        </DataTable>
                    </div>
                </>
            ) : (
                <div className="order-fulfillment-card-title">{order.order_id} not loaded</div>
            )}
        </div>
    );
};

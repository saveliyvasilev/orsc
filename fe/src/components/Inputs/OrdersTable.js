import { barrelFormat } from "../../formatter";
import { assayRanges } from "../../config";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OrderAssayChart } from "../assayCharts/OrderAssayChart";

export const OrdersTable = ({ orders }) => {
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

    return (
        <div className="table-container">
            <DataTable value={orders} responsiveLayout="scroll" scrollHeight="100vh">
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
    );
};

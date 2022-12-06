import { assayFormat, barrelFormat, currencyFormat } from "../../formatter";
import { assayRanges } from "../../config";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProductAssayChart } from "../assayCharts/ProductAssayChart";

export const ProductsTable = ({ products }) => {
    function reservesBodyTemplate(rowData) {
        return barrelFormat(rowData.reserves);
    }

    function APIGravityBodyTemplate(rowData) {
        return (
            <ProductAssayChart
                assayValue={rowData.API_gravity}
                scaleMin={assayRanges.API_gravity.scaleMin}
                scaleMax={assayRanges.API_gravity.scaleMax}
            ></ProductAssayChart>
        );
    }

    function sulfurBodyTemplate(rowData) {
        return (
            <ProductAssayChart
                assayValue={rowData.sulfur}
                scaleMin={assayRanges.sulfur.scaleMin}
                scaleMax={assayRanges.sulfur.scaleMax}
            ></ProductAssayChart>
        );
    }

    function costBodyTemplate(rowData) {
        return currencyFormat(rowData.cost);
    }

    return (
        <div className="table-container">
            <DataTable
                value={products}
                responsiveLayout="scroll"
                // scrollable  // This messes up the column widths, so use container css and scrollHeight to make this work
                scrollHeight="90vh"
            >
                <Column field="product_id" header="Product ID" sortable></Column>
                <Column field="reserves" header="Reserves" body={reservesBodyTemplate} sortable></Column>
                <Column field="cost" header="Cost" body={costBodyTemplate} sortable></Column>
                <Column
                    field="API_gravity"
                    header="API Gravity"
                    alignHeader="center"
                    sortable
                    body={APIGravityBodyTemplate}
                    style={{ width: "25em" }}
                ></Column>
                <Column
                    field="sulfur"
                    alignHeader="center"
                    header="Sulfur"
                    sortable
                    body={sulfurBodyTemplate}
                    style={{ width: "25em" }}
                ></Column>
            </DataTable>
        </div>
    );
};

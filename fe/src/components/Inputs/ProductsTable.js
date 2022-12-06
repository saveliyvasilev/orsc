import { assayFormat, barrelFormat, currencyFormat } from "../../formatter";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export const ProductsTable = ({ products }) => {
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

    return (
        <div className="table-container">
            <DataTable
                value={products}
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
    );
};

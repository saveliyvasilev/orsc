import { barrelFormat, percentFormat } from "../../formatter";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";
import { assayRanges } from "../../config";
import { ProductAssayChart } from "../assayCharts/ProductAssayChart";
import { ProductUsageCard } from "./ProductUsageCard";

export const ProductUsageTable = ({ productUsage }) => {
    const [expandedRows, setExpandedRows] = useState({});

    const productUsageCardTemplate = (rowData) => {
        return <ProductUsageCard product={rowData}></ProductUsageCard>;
    };

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

    return (
        <div className="table-container clickable-row-cursor">
            <DataTable
                value={productUsage}
                responsiveLayout="scroll"
                expandedRows={expandedRows}
                rowExpansionTemplate={productUsageCardTemplate}
                onRowToggle={(e) => {
                    setExpandedRows(e.data);
                }}
                dataKey="product_id"
                sortField="usage_share"
                sortOrder={-1}
                onRowClick={(e) => {
                    const id = e.data.product_id;
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
                <Column field="product_id" header="Product" sortable></Column>
                <Column
                    field="API_gravity"
                    header="API Gravity"
                    alignHeader="center"
                    sortable
                    body={APIGravityBodyTemplate}
                    style={{ width: "18em" }}
                ></Column>
                <Column
                    field="sulfur"
                    alignHeader="center"
                    header="Sulfur"
                    sortable
                    body={sulfurBodyTemplate}
                    style={{ width: "18em" }}
                ></Column>
                <Column
                    field="reserves"
                    header="Reserves"
                    sortable
                    align={"right"}
                    body={(rowData) => barrelFormat(rowData.reserves, 0)}
                ></Column>
                <Column
                    field="loaded"
                    header="Loaded"
                    sortable
                    align={"right"}
                    body={(rowData) => barrelFormat(rowData.loaded, 0)}
                ></Column>
                <Column
                    field="usage_share"
                    header="Usage %"
                    sortable
                    align={"right"}
                    body={(rowData) => percentFormat(rowData.usage_share, 0)}
                ></Column>
            </DataTable>
        </div>
    );
};

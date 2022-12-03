import { assayFormat, barrelFormat, currencyFormat } from "../../formatter";

export const OrderFulfillmentTable = ({ orders }) => {
    //     maxHeight: "30rem",
    // overflow: "auto",

    return (
        <div style={{ maxHeight: "10rem", backgroundColor: "white" }}>
            <table>
                <thead>
                    <tr>
                        <th>Order</th>
                        <th>Demand</th>
                        <th>Load</th>
                        <th>Underload</th>
                        <th>Assays</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((o) => (
                        <tr key={o.id}>
                            <td>{o.order_id}</td>
                            <td>{barrelFormat(o.demand_amount)}</td>
                            <td>{barrelFormat(o.load_amount)}</td>
                            <td>{barrelFormat(o.underload_amount)}</td>
                            <td>TBC</td>
                            <td>{currencyFormat(o.load_cost)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

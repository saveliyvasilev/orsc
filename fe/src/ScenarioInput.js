import axios from "./axiosInstance";
import { useState, useEffect } from "react";

import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import { Section } from "./components/Section";
import { StickyHeader } from "./components/Section/StickyHeader";
import { ProductsTable } from "./components/Inputs/ProductsTable";
import { OrdersTable } from "./components/Inputs/OrdersTable";

// import { debounce } from "lodash";
import { TabView, TabPanel } from "primereact/tabview";

export const ScenarioInput = () => {
    const [sInput, setSInput] = useState({});
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        // TODO: This should call a GET for a fresh data pull and jump to an overview page; not make a new scenario entry via POST
        axios.get("/current-snapshot").then((res) => {
            if (res.status === 200) {
                setSInput(res.data);
            }
        });
    }, []);

    function handleOptimize(e) {
        e.stopPropagation();
        axios.post("/optimization-queue", sInput).then((res) => {
            if (res.status === 201) {
                console.log("Submitted optimization!");
                navigate("/", { replace: true });
            }
        });
    }

    function handleScenarioNameOnChange(e) {
        setSInput({
            ...sInput,
            name: e.target.value,
        });
    }

    return (
        <>
            {sInput.input !== undefined ? (
                <>
                    <Section>
                        <div className="space-between">
                            <InputText value={sInput.name} onChange={handleScenarioNameOnChange}></InputText>
                            <div className="comment">Scenario id: {sInput.scenario_id}</div>
                        </div>
                    </Section>

                    <Section>
                        <TabView renderActiveOnly={false}>
                            <TabPanel header="Products">
                                <ProductsTable products={sInput.input.products} />
                            </TabPanel>
                            <TabPanel header="Orders">
                                <OrdersTable orders={sInput.input.orders}></OrdersTable>
                            </TabPanel>
                        </TabView>
                    </Section>

                    {/* <Section>
                        <StickyHeader>Products</StickyHeader>
                        <div className="table-container">
                            <ProductsTable products={sInput.input.products} />
                        </div>
                    </Section>

                    <Section>
                        <StickyHeader>Orders</StickyHeader>
                        <OrdersTable orders={sInput.input.orders}></OrdersTable>
                    </Section> */}

                    <Section>
                        <div className="right">
                            <div className="btn" onClick={handleOptimize}>
                                Optimize!
                            </div>
                        </div>
                    </Section>
                </>
            ) : (
                "Fetching data"
            )}
        </>
    );
};

import axios from "./axiosInstance";
import { useState, useEffect } from "react";

import { InputText } from "primereact/inputtext";
import { useNavigate, useParams } from "react-router-dom";
import { Section } from "./components/Section";
import { ProductsTable } from "./components/Inputs/ProductsTable";
import { ProductForm } from "./components/Inputs/ProductForm";
import { OrdersTable } from "./components/Inputs/OrdersTable";
import { Modal } from "./components/Modal";

import { TabView, TabPanel } from "primereact/tabview";
import { OrderForm } from "./components/Inputs/OrderForm";
import { ScenarioDescriptionForm } from "./components/Inputs/ScenarioDescriptionForm";

export const ScenarioInput = () => {
    const [sInput, setSInput] = useState({});
    const { scenario_id } = useParams();
    const [displayCreateProductModal, setDisplayCreateProductModal] = useState(false);
    const [displayEditProductModal, setDisplayEditProductModal] = useState(false);
    const [displayCreateOrderModal, setDisplayCreateOrderModal] = useState(false);
    const [displayEditOrderModal, setDisplayEditOrderModal] = useState(false);
    const [displayEditScenarioDescriptionModal, setDisplayEditScenarioDescriptionModal] = useState(false);

    const [initialProductData, setInitialProductData] = useState({});
    const [initialOrderData, setInitialOrderData] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        if (scenario_id) {
            axios.get(`/duplicate-scenario/${scenario_id}`).then((res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    setSInput(res.data);
                }
            });
        } else {
            axios.get("/current-snapshot").then((res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    setSInput(res.data);
                }
            });
        }
    }, [scenario_id]);

    function handleOptimize(e) {
        e.stopPropagation();
        axios.post("/optimization-queue", sInput).then((res) => {
            if (res.status === 201) {
                console.log("Submitted optimization!");
                navigate("/", { replace: true });
            }
        });
    }

    function handleNewProduct(product) {
        const updatedProducts = [product, ...sInput.input.products];
        setSInput({
            ...sInput,
            input: {
                ...sInput.input,
                products: updatedProducts,
            },
        });
        handleCreateProductModalClose();
    }

    function handleNewOrder(order) {
        const updatedOrders = [order, ...sInput.input.orders];
        setSInput({
            ...sInput,
            input: {
                ...sInput.input,
                orders: updatedOrders,
            },
        });
        handleCreateOrderModalClose();
    }

    function handleEditProduct(product) {
        const updatedProducts = sInput.input.products.map((p) => {
            if (p.product_id === product.product_id) {
                return product;
            } else {
                return p;
            }
        });
        setSInput({
            ...sInput,
            input: {
                ...sInput.input,
                products: updatedProducts,
            },
        });
        handleEditProductModalClose();
    }

    function handleEditOrder(order) {
        const updatedOrders = sInput.input.orders.map((o) => {
            if (o.order_id === order.order_id) {
                return order;
            } else {
                return o;
            }
        });
        setSInput({
            ...sInput,
            input: {
                ...sInput.input,
                orders: updatedOrders,
            },
        });
        handleEditOrderModalClose();
    }

    function handleEditScenarioDescription(name) {
        setSInput({
            ...sInput,
            name: name,
        });
        handleEditScenarioDescriptionModalClose();
    }

    function handleEditScenarioDescriptionClick() {
        setDisplayEditScenarioDescriptionModal(() => true);
    }

    function handleProductEditClick(product) {
        setInitialProductData(() => product);
        setDisplayEditProductModal(() => true);
    }

    function handleOrderEditClick(order) {
        setInitialOrderData(() => order);
        setDisplayEditOrderModal(() => true);
    }

    function handleDeleteProductClick(product) {
        const filteredProducts = sInput.input.products.filter((prod) => prod.product_id !== product.product_id);
        setSInput({
            ...sInput,
            input: {
                ...sInput.input,
                products: filteredProducts,
            },
        });
    }

    function handleDeleteOrderClick(order) {
        const filteredOrders = sInput.input.orders.filter((ord) => ord.order_id !== order.order_id);
        setSInput({
            ...sInput,
            input: {
                ...sInput.input,
                orders: filteredOrders,
            },
        });
    }

    function handleCreateProductModalClose() {
        setDisplayCreateProductModal(false);
    }

    function handleEditProductModalClose() {
        setDisplayEditProductModal(false);
    }

    function handleCreateOrderModalClose() {
        setDisplayCreateOrderModal(false);
    }

    function handleEditOrderModalClose() {
        setDisplayEditOrderModal(false);
    }

    function handleEditScenarioDescriptionModalClose() {
        setDisplayEditScenarioDescriptionModal(false);
    }
    return (
        <>
            {sInput.input !== undefined ? (
                <>
                    <Section>
                        <div className="space-between">
                            <div className="section-header">
                                {sInput.name}{" "}
                                <span
                                    className="material-symbols-outlined accent icon outlined"
                                    alt="Edit"
                                    onClick={handleEditScenarioDescriptionClick}
                                >
                                    edit
                                </span>
                            </div>
                            <div className="comment">Scenario id: {sInput.scenario_id}</div>
                        </div>
                        <Modal
                            title="Edit scenario description"
                            display={displayEditScenarioDescriptionModal}
                            onClose={handleEditScenarioDescriptionModalClose}
                        >
                            <ScenarioDescriptionForm onSubmit={handleEditScenarioDescription} name={sInput.name} />
                        </Modal>
                    </Section>

                    <Section>
                        <TabView renderActiveOnly={false}>
                            <TabPanel header="Products">
                                <div className="right btn-above-table">
                                    <button className="btn" onClick={() => setDisplayCreateProductModal(true)}>
                                        Add product
                                    </button>
                                </div>
                                <Modal
                                    title="Create product"
                                    display={displayCreateProductModal}
                                    onClose={handleCreateProductModalClose}
                                >
                                    <ProductForm onSubmit={handleNewProduct} />
                                </Modal>
                                <Modal
                                    title="Edit product"
                                    display={displayEditProductModal}
                                    onClose={handleEditProductModalClose}
                                >
                                    <ProductForm onSubmit={handleEditProduct} initialData={initialProductData} />
                                </Modal>
                                <ProductsTable
                                    products={sInput.input.products}
                                    onEditClick={handleProductEditClick}
                                    onDeleteClick={handleDeleteProductClick}
                                />
                            </TabPanel>
                            <TabPanel header="Orders">
                                <div className="right btn-above-table">
                                    <button className="btn" onClick={() => setDisplayCreateOrderModal(true)}>
                                        Add order
                                    </button>
                                </div>
                                <Modal
                                    title="Create order"
                                    display={displayCreateOrderModal}
                                    onClose={handleCreateOrderModalClose}
                                >
                                    <OrderForm onSubmit={handleNewOrder} />
                                </Modal>
                                <Modal
                                    title="Edit order"
                                    display={displayEditOrderModal}
                                    onClose={handleEditOrderModalClose}
                                >
                                    <OrderForm onSubmit={handleEditOrder} initialData={initialOrderData} />
                                </Modal>
                                <OrdersTable
                                    orders={sInput.input.orders}
                                    onEditClick={handleOrderEditClick}
                                    onDeleteClick={handleDeleteOrderClick}
                                ></OrdersTable>
                            </TabPanel>
                        </TabView>
                    </Section>
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

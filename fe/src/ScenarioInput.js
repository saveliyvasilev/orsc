import axios from "./axiosInstance";
import { useState, useEffect } from "react";

import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import { Section } from "./components/Section";
import { StickyHeader } from "./components/Section/StickyHeader";
import { ProductsTable } from "./components/Inputs/ProductsTable";
import { ProductForm } from "./components/Inputs/ProductForm";
import { OrdersTable } from "./components/Inputs/OrdersTable";
import { Modal } from "./components/Modal";

// import { debounce } from "lodash";
import { TabView, TabPanel } from "primereact/tabview";

export const ScenarioInput = () => {
    const [sInput, setSInput] = useState({});
    const [displayCreateProductModal, setDisplayCreateProductModal] = useState(false);
    const [displayEditProductModal, setDisplayEditProductModal] = useState(false);
    const [initialProductData, setInitialProductData] = useState({});

    const navigate = useNavigate();

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

    function handleProductEditClick(product) {
        setInitialProductData(() => product);
        setDisplayEditProductModal(() => true);
    }

    function handleDeleteProduct(product) {
        const filteredProducts = sInput.input.products.filter((prod) => prod.product_id !== product.product_id);
        setSInput({
            ...sInput,
            input: {
                ...sInput.input,
                products: filteredProducts,
            },
        });
    }

    function handleCreateProductModalClose() {
        setDisplayCreateProductModal(false);
    }

    function handleEditProductModalClose() {
        setDisplayEditProductModal(false);
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
                                    onDeleteClick={handleDeleteProduct}
                                />
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

import { useState, useEffect } from "react";
import { Products } from "../../Interface/Products";

const Inventory = () => {
    const [products, setProducts] = useState<Products[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Products | null>(null);
    const [editingProduct, setEditingProduct] = useState<Products | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(() => {
        return localStorage.getItem("dontShowDeleteConfirm") === "true";
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoadingProducts(true);
            console.log("🌍 Fetching products from API...");
    
            const seller_id = localStorage.getItem("userId");
            // Bygg URL med query-parametern seller_id
            const response = await fetch(
                `${import.meta.env.VITE_API_GET_PRODUCTS_URL}?seller_id=${seller_id}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            );
    
            if (!response.ok) throw new Error("❌ Failed to fetch products");
    
            const data = await response.json();
            if (Array.isArray(data.data)) {
                setProducts(data.data);
            } else {
                setProducts([]);
            }
        } catch (err) {
            console.error("❌ Error fetching products:", err);
            setProducts([]);
        } finally {
            setLoadingProducts(false);
        }
    };
    

    const updateProduct = async (product: Products | null) => {
        if (!product) return;

        const seller_id = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        console.log("🛠 UPDATE REQUEST INITIATED");
        console.log("🔑 Token:", token);
        console.log("📦 Payload:", JSON.stringify(product));

        if (!token) {
            alert("Ingen token hittades, vänligen logga in igen.");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_CHANGE_PRODUCTS_URL}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ ...product, seller_id }),
            });

            const data = await response.json();
            console.log("📡 UPDATE RESPONSE BODY:", data);

            if (response.ok) {
                alert("✅ Produkt uppdaterad!");
                setShowEditModal(false);

                // Uppdatera UI genom att ersätta den gamla produkten med den nya
                setProducts((prevProducts) => prevProducts.map((prod) => (prod.product_id === product.product_id ? product : prod)));
            } else {
                alert("❌ Misslyckades: " + data.message);
            }
        } catch (error) {
            console.error("❌ Error updating product:", error);
            alert("❌ Något gick fel vid uppdatering av produkten.");
        }
    }

    const handleEditClick = (product: Products) => {
        setEditingProduct(product);
        setShowEditModal(true);
    };

    const handleDeleteClick = (product: Products) => {
        if (!dontShowAgain) {
            setSelectedProduct(product);
            setShowConfirm(true);
        } else {
            deleteProduct(product.product_id);
        }
    };

    const deleteProduct = async (product_id: string) => {
        const seller_id = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        console.log("🛠 DELETE REQUEST INITIATED");
        console.log("🔑 Token:", token);
        console.log("📦 Payload:", JSON.stringify({ product_id, seller_id }));

        if (!token) {
            alert("Ingen token hittades, vänligen logga in igen.");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_DELETE_PRODUCTS_URL}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ product_id, seller_id }),
            });

            const data = await response.json();
            console.log("📡 DELETE RESPONSE BODY:", data);

            if (response.ok) {
                alert("✅ Produkt borttagen!");

                // Uppdatera UI genom att filtrera bort produkten från listan
                setProducts((prevProducts) => prevProducts.filter((prod) => prod.product_id !== product_id));

                // Stäng bekräftelsemodalen
                setShowConfirm(false);
                setSelectedProduct(null);
            } else {
                alert("❌ Misslyckades: " + data.message);
            }
        } catch (error) {
            console.error("❌ Error deleting product:", error);
            alert("❌ Något gick fel vid radering av produkten.");
        }
    };

    return (
        <>
            <div className="w-full flex item-center justify-center">
                {loadingProducts ? (
                    <p>Loading...</p>
                ) : (
                    <table className="border-collapse border w-full">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">ID</th>
                                <th className="border p-2">Product Name</th>
                                <th className="border p-2">Price</th>
                                <th className="border p-2">Stock</th>
                                <th className="border p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.product_id} className="border text-center">
                                    <td className="border p-2">{product.product_id}</td>
                                    <td className="border p-2">{product.product_name}</td>
                                    <td className="border p-2">{product.price} kr</td>
                                    <td className="border p-2">{product.stock}</td>
                                    <td className="border p-2">
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2" onClick={() => handleEditClick(product)}>Edit</button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDeleteClick(product)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* 🔥 CONFIRMATION MODAL */}
            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this item?</h2>
                        <p>Product: {selectedProduct?.product_name}</p>
                        <div className="flex items-center mt-4">
                            <input
                                type="checkbox"
                                id="dontShowAgain"
                                className="mr-2"
                                checked={dontShowAgain}
                                onChange={(e) => {
                                    setDontShowAgain(e.target.checked);
                                    localStorage.setItem("dontShowDeleteConfirm", String(e.target.checked));
                                }}
                            />
                            <label htmlFor="dontShowAgain">Don't show again</label>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button className="bg-gray-300 text-black px-4 py-2 rounded mr-2" onClick={() => setShowConfirm(false)}>
                                Cancel
                            </button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => selectedProduct && deleteProduct(selectedProduct.product_id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

                {/* EDIT MODAL */}
            {showEditModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Edit Product</h2>

                <label className="block">Product Name</label>
                <input
                    type="text"
                    className="border w-full p-2 rounded"
                    value={editingProduct?.product_name || ""}
                    onChange={(e) => setEditingProduct(editingProduct ? { ...editingProduct, product_name: e.target.value } : null)}
                />

                <label className="block mt-4">Price</label>
                <input
                    type="text"
                    className="border w-full p-2 rounded"
                    value={editingProduct?.price || ""}
                    onChange={(e) => setEditingProduct(editingProduct ? { ...editingProduct, price: e.target.value } : null)}
                />

                <label className="block mt-4">Stock</label>
                <input
                    type="text"
                    className="border w-full p-2 rounded"
                    value={editingProduct?.stock || ""}
                    onChange={(e) => setEditingProduct(editingProduct ? { ...editingProduct, stock: e.target.value } : null)}
                />

                <div className="flex justify-end mt-4">
                    <button className="bg-gray-300 text-black px-4 py-2 rounded mr-2" onClick={() => setShowEditModal(false)}>
                    Cancel
                    </button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => updateProduct(editingProduct)}>
                    Save
                    </button>
                </div>
                </div>
            </div>
            )}
        </>
    );
};

export default Inventory;
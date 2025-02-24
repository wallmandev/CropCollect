import { useLocation, useNavigate } from "react-router-dom";

interface Product {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    unit: string;
}

const ConfirmationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addedProducts } = location.state || { addedProducts: [] };

    console.log("Mottagna produkter:", addedProducts);

    return (
        <div>
            <h1>Produkter tillagda</h1>
            {addedProducts.length === 0 ? (
                <p>Inga produkter tillagda ännu.</p>
            ) : (
                <ul>
                    {addedProducts.map((product: Product, index: number) => (
                        <li key={index}>
                            <h2>{product.name}</h2>
                            <p>Beskrivning: {product.description}</p>
                            <p>Pris per {product.unit}: {product.price} SEK</p>
                            <p>Antal i lager: {product.stock}</p>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={() => navigate("/Seller")}>Till huvudsidan</button>
        </div>
    );
};

export default ConfirmationPage;




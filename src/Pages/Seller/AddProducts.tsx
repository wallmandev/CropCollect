import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [stock, setStock] = useState<number | string>("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [unit, setUnit] = useState("styck");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [addedProducts, setAddedProducts] = useState<any[]>([]);

  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  // Funktion för att ladda upp bilden till S3 via pre-signed URL
  const uploadImageToS3 = async (file: File): Promise<string> => {
    const filename = file.name;
    const contentType = file.type;
    // Anropa din Lambda som genererar pre-signed URL (använd en GET-begäran med query parameters)
    const presignUrlEndpoint = `${import.meta.env.VITE_API_GET_UPLOAD_URL}?filename=${encodeURIComponent(filename)}&contentType=${encodeURIComponent(contentType)}`;
    
    const presignResponse = await fetch(presignUrlEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!presignResponse.ok) {
      const errorText = await presignResponse.text();
      throw new Error(`Misslyckades att få pre-signed URL: ${errorText}`);
    }
    
    const presignData = await presignResponse.json();
    const { uploadURL, key } = presignData;
    console.log("Pre-signed URL:", uploadURL, "Key:", key);
    
    // Ladda upp bilden med PUT-begäran till S3
    const uploadResponse = await fetch(uploadURL, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
      body: file,
    });
    
    if (!uploadResponse.ok) {
      throw new Error("Misslyckades att ladda upp bilden till S3");
    }
    
    // Konstruera bildens URL. Exempel: 
    // https://{BUCKET_NAME}.s3.eu-north-1.amazonaws.com/{key}
    const s3BucketUrl = import.meta.env.VITE_S3_BUCKET_URL; // t.ex. "sellerproducts-2025.s3.eu-north-1.amazonaws.com"
    const imageUrl = `https://${s3BucketUrl}/${key}`;
    return imageUrl;
  };

  const handleConfirm = async () => {
    // Validera att alla fält finns
    if (!name || !stock || !description || !price || !category || !image) {
      alert("Alla fält måste fyllas i!");
      return;
    }

    const sellerId = localStorage.getItem("userId");
    console.log("Hämtar seller_id från localStorage:", sellerId);
    if (!sellerId) {
      alert("Ingen säljare är inloggad!");
      return;
    }

    try {
      // 1. Ladda upp bilden till S3 och få bildens URL
      const imageUrl = await uploadImageToS3(image);
      console.log("Bild uppladdad, imageUrl:", imageUrl);

      // 2. Konstruera produktdata med bildens URL
      const productData = {
        seller_id: sellerId,
        product_name: name,
        description,
        price,
        stock,
        unit,
        category,
        imageUrl, // Inkludera bildens URL
      };

      const token = localStorage.getItem("token");
      console.log("Token från localStorage:", token);

      // 3. Skicka produktdata (JSON) till din produkt-Lambda
      const response = await fetch(`${import.meta.env.VITE_API_POST_PRODUCTS_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response från servern:", errorText);
        alert(`Misslyckades att lägga till produkt: ${errorText}`);
        return;
      }

      const responseData = await response.json();
      console.log("Produkt tillagd framgångsrikt:", responseData);

      setAddedProducts((prev) => [...prev, responseData.product]);
      alert("Produkten lades till framgångsrikt!");
      navigate("/confirmation", { state: { addedProducts } });
    } catch (error) {
      console.error("Fel vid uppladdning av produkt:", error);
      alert("Ett fel uppstod vid uppladdning av produkten.");
    }
  };

  const handleAddProduct = async () => {
    // Den här funktionen kan användas om du vill lägga till produkter utan att navigera direkt
    // Kan vara en variant av handleConfirm. Om du redan har handleConfirm, kanske du inte behöver handleAddProduct.
    await handleConfirm();
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lägg till ny produkt</h1>
      <div className="mb-4">
        <label className="block mb-2">Lägg till en bild</label>
        <input type="file" onChange={handleImageChange} className="w-full" />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Produktens namn</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Kategori</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Category</option>
            <option value="Drinks">Drinks</option>
            <option value="Fresh Vegetables">Fresh Vegetables</option>
            <option value="Fresh Fruits">Fresh Fruits</option>
            <option value="Dairy Products">Dairy Products</option>
            <option value="Meat">Meat</option>
            <option value="Poultry">Poultry</option>
            <option value="Eggs">Eggs</option>
            <option value="Honey & Beekeeping">Honey & Beekeeping</option>
            <option value="Bakery">Bakery</option>
            <option value="Charcuterie">Charcuterie</option>
            <option value="Herbs & Spices">Herbs & Spices</option>
            <option value="Preserves">Preserves</option>
            <option value="Local Specialties">Local Specialties</option>
            <option value="Seasonal Items">Seasonal Items</option>  

        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Antal i lager</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Pris</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Enhet</label>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="styck">Per styck</option>
          <option value="hg">Per hg</option>
          <option value="kg">Per kg</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Beskrivning</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleAddProduct}
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Lägg till fler produkter
        </button>
        <button
          onClick={handleConfirm}
          className="bg-green-500 text-white p-2 rounded w-full"
        >
          Bekräfta och visa lista
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
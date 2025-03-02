import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GeoData } from '../../Interface/GeoData';
import storeLocatorIcon from '../../assets/images/store-locator-icon.svg';

const SellerProfile: React.FC = () => {
  const [storeName, setStoreName] = useState('');
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [products, setProducts] = useState<GeoData[]>([]);
  const [stars, setStars] = useState(0);
  const navigate = useNavigate();

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBannerImage(e.target.files[0]);
    }
  };

  const handleSave = () => {
    // Save the store details
    console.log('Store details saved:', { storeName, bannerImage, products, stars });
    navigate('/seller');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Seller Profile</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Store Name</label>
        <input
          type="text"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Banner Image</label>
        <input
          type="file"
          onChange={handleBannerChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Products</label>
        <p>{products.length} products</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Stars</label>
        <p>{stars} stars</p>
      </div>
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  );
};

export default SellerProfile;

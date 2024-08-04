import React, { useEffect, useState } from 'react';
import { databases, storage } from '../utils/appwrite';
import { useParams } from 'react-router-dom';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await databases.getDocument('66ae2a72000f24a415bf', '66ae2a790028130c67c3', productId);
        const imageUrl = await storage.getFileView('66ae6d0e002f84e761b5', response.image);
        setProduct({ ...response, imageUrl: imageUrl.href });
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <img src={product.imageUrl} alt={product.name} className="w-full h-96 object-cover rounded" />
      <p>{product.description}</p>
      <p className="text-lg font-bold">${product.price}</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Add to Cart</button>
      <button className="bg-green-500 text-white px-4 py-2 rounded ml-2">Buy Now</button>
    </div>
  );
};

export default ProductDetailsPage;

import React, { useEffect, useState } from 'react';
import { account, databases, storage } from '../utils/appwrite';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
        try {
            const user = await account.get();
            setUserId(user.$id);
            console.log("addproduct: ", user);
        } catch (error) {
            console.log("addproduct error: ", error);
        }
    }

    fetchUserId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fileResponse = await storage.createFile('66ae6d0e002f84e761b5', 'unique()', image);
      const productData = {
        name,
        description,
        price: parseFloat(price),
        owner_id: userId,
        image: fileResponse.$id
      };
      const addproduct = await databases.createDocument('66ae2a72000f24a415bf', '66ae2a790028130c67c3', 'unique()', productData);
      console.log("added product: ", addproduct);
      alert('Product added successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold">Add Product</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded" />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 rounded" />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-2 rounded" />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} className="border p-2 rounded" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;

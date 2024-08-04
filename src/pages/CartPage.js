import React, { useEffect, useState } from 'react';
import { databases, account, storage, Query } from '../utils/appwrite';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await account.get();
        setUserId(user.$id);
        console.log("user: ", user);
      } catch (error) {
        alert(`Error: ${error.message}`);
        console.log("Error: ", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchCartItems = async () => {
      try {
        const response = await databases.listDocuments('66ae2a72000f24a415bf', '66ae2a860004584d0c23', [
          Query.equal('user_id', userId)
        ]);
        
        const itemsWithImages = response.documents.map(item => ({
          ...item,
          imageUrl: item.image,
        }));

        setCartItems(itemsWithImages);
        console.log("cart: ", response);
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
      }
    };

    fetchCartItems();
  }, [userId]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      console.log("Updating item:", itemId, "New Quantity:", newQuantity, "Cartitem: ", cartItems);
      await databases.updateDocument('66ae2a72000f24a415bf', '66ae2a860004584d0c23', itemId, { quantity: newQuantity });
      
      const response = await databases.listDocuments('66ae2a72000f24a415bf', '66ae2a860004584d0c23', [
        Query.equal('user_id', userId)
      ]);

      const itemsWithImages = response.documents.map(item => ({
        ...item,
        imageUrl: item.image,
      }));

      setCartItems(itemsWithImages);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await databases.deleteDocument('66ae2a72000f24a415bf', '66ae2a860004584d0c23', itemId);
      
      // Update the cart items list after deletion
      const response = await databases.listDocuments('66ae2a72000f24a415bf', '66ae2a860004584d0c23', [
        Query.equal('user_id', userId)
      ]);

      const itemsWithImages = response.documents.map(item => ({
        ...item,
        imageUrl: item.image,
      }));

      setCartItems(itemsWithImages);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    // Implement checkout logic here
    alert("Checkout functionality not implemented yet.");
  };

  if (!userId) return <div>Loading...</div>;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold">Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map(item => (
          <div key={item.$id} className="border p-4 rounded flex items-center space-x-4">
            {item.imageUrl && (
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-20 h-20 object-cover rounded"
              />
            )}
            <div className="flex-grow">
              <p className="text-lg font-semibold">{item.name}</p>
              <p className="text-lg font-bold">${item.price}</p>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.$id, parseInt(e.target.value))}
                className="border p-1 rounded"
              />
            </div>
            <button 
              onClick={() => handleRemoveItem(item.$id)}
              className="bg-red-500 text-white px-4 py-2 rounded">
                Remove
            </button>
          </div>
        ))
      )}
      {cartItems.length > 0 && (
        <div className="mt-4">
          <p className="text-xl font-bold">Grand Total: ${calculateTotal().toFixed(2)}</p>
          <button
            onClick={handleCheckout}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
              Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;

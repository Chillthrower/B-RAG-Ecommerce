import React, { useEffect, useState } from 'react';
import { databases, account, storage } from '../utils/appwrite';
import { addToCart, getCartItems } from '../api/cart';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await account.get();
        setUserId(user.$id);
        console.log("Fetching user id : ", user);
      } catch (error) {
        alert(`Error: ${error.message}`);
        console.log("Error: ", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await databases.listDocuments('66ae2a72000f24a415bf', '66ae2a790028130c67c3');
        const productsWithImages = await Promise.all(response.documents.map(async product => {
          const imageUrl = await storage.getFileView('66ae6d0e002f84e761b5', product.image);
          return { ...product, imageUrl: imageUrl.href };
        }));
        setProducts(productsWithImages);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId) return;
      try {
        const response = await getCartItems(userId);
        setCartItems(response.documents.map(item => item.product_id));
      } catch (error) {
        console.error("Error fetching cart items: ", error);
      }
    };

    fetchCartItems();
  }, [userId]);

  const handleAddToCart = async (productId, productName, productPrice, productImage) => {
    if (!userId) {
      alert("Login Please");
      return;
    }

    try {
      await addToCart(userId, productId, 1, productName, productPrice, productImage);
      alert("Item added to cart");
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.log("Error: ", error);
    }
  }

  const handleMoreInfo = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleImageClick = async (fileId) => {
    try {
      const previewUrl = await storage.getFilePreview(
        '66ae6d0e002f84e761b5', 
        fileId, 
        500, 
        500, 
      );
      setSelectedImage(previewUrl.href);
    } catch (error) {
      console.error("Error fetching image preview: ", error);
    }
  };

  const handleClosePreview = () => {
    setSelectedImage(null);
  };

  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold">Products</h1>
      <div className="grid grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.$id} className="border p-4 rounded">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-48 object-cover rounded" 
              onClick={() => handleImageClick(product.image)}
            />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p>{product.description}</p>
            <p className="text-lg font-bold">${product.price}</p>
            {userId !== product.owner_id && (
              <>
                {cartItems.includes(product.$id) ? (
                  <button 
                    disabled
                    className="bg-gray-500 text-white px-4 py-2 rounded">
                      Added
                  </button>
                ) : (
                  <button 
                    onClick={() => handleAddToCart(product.$id, product.name, product.price, product.imageUrl)}
                    className="bg-blue-500 text-white px-4 py-2 rounded">
                      Add to Cart
                  </button>
                )}
                <button className="bg-green-500 text-white px-4 py-2 rounded ml-2">Buy Now</button>
                <button 
                  onClick={() => handleMoreInfo(product.$id)}
                  className="bg-orange-500 text-white px-4 py-2 rounded ml-2">
                    More Info
                </button>
              </>
            )}
            {userId === product.owner_id && (
              <p className="text-red-500">You cannot add your own product to the cart.</p>
            )}
          </div>
        ))}
      </div>
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center" onClick={handleClosePreview}>
          <img src={selectedImage} alt="Preview" className="max-w-full max-h-full" />
        </div>
      )}
    </div>
  );
};

export default HomePage;

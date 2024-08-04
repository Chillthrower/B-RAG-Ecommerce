import { databases, Query } from "../utils/appwrite";

export const addToCart = async (userId, productId, quantity, name, price, image) => {
    try {
        const cartItem = {
            user_id: userId,
            product_id: productId,
            quantity,
            name: name,
            price: price,
            image: image
        };
        const items = await databases.createDocument('66ae2a72000f24a415bf', '66ae2a860004584d0c23', 'unique()', cartItem);
        console.log("cartitem: ", items);
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

export const getCartItems = async (userId) => {
    try {
        // Query the cart collection to get documents where `user_id` matches the provided userId
        const response = await databases.listDocuments('66ae2a72000f24a415bf', '66ae2a860004584d0c23', [
            Query.equal('user_id', userId)
        ]);
        
        // Return the list of cart items
        return response;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error; // Optionally, rethrow the error for further handling
    }
};
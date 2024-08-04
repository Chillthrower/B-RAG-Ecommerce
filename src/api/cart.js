import { databases } from "../utils/appwrite";

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
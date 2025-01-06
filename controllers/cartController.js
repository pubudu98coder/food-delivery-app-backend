import userModel from '../models/userModel.js'

//add items to user cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findOne({_id: req.body.userId});
        let cartData = userData.cartData;

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1 ;
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData})
        res.json({success: true, message: "Item added to cart"})
    } catch (error) {
        res.json({success: false, message: "Internal server error"});
    }
}

//remove items from cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData;

        if (cartData[req.body.itemId]> 0) {
            cartData[req.body.itemId] -= 1;
        } else {
            return res.json({success: false, message: "Item not found in the cart"});
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.json({success: true, message: "Item removed from the cart"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Internal server error"});
    }
}

//get cart data
const getCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.body.userId);
        const cartData =  userData.cartData;
        res.json({success: true, cartData});
    } catch (error) {
        console.log(error);
        res.json({success:false, message: "Internal server error"});
    }
}

export {addToCart, removeFromCart, getCart}


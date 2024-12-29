import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = "http://localhost:5173"

//placing order for frontend
const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, {cartData: {}})

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data:{
                    name: item.name,
                },
                unit_amount: item.price*100*80
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount: 2*100*80
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`
        });

        res.json({success:true, session_url: session.url});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Internal server error"});
    }
}

const verifyOrder = async (req, res) => {
    const {orderId, success} = req.body;

    try {
        if (success == "true") {
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            res.json({success:true, message: "Paid"});
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({success: false, message: "Not paid"});
        }
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Internal server error"});
    }
}

const userOrders = async (req, res) => {
    //const userId = req.body.userId;
    try {
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success: true, data: orders});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Internal server error"});
    }
}

//get all orders for admin panel
const listOrders = async (req, res) => {
    try {
        const ordersList = await orderModel.find();
        res.json({success: true, data: ordersList});
    } catch (error) {
        console.log(error);
        res.json({success:false, message: "Internal server error"});
    }
}

const updateOrderStatus = async (req, res) => {
    console.log(req.body)
    try{
        await orderModel.findByIdAndUpdate(req.body.orderId, {status:req.body.status});
        res.json({success:true, message:"Status updated"});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Internal server error"});
    }
}

export {placeOrder, verifyOrder, userOrders, listOrders, updateOrderStatus}
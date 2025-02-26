import express from 'express';
import authMiddleWare from '../middleware/authMiddleWare.js';
import { listOrders, placeOrder, updateOrderStatus, userOrders, verifyOrder } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/place', authMiddleWare, placeOrder);
orderRouter.post('/verify', verifyOrder);
orderRouter.post('/userorders', authMiddleWare, userOrders);
orderRouter.get('/list', listOrders);
orderRouter.post('/status', updateOrderStatus);

export default orderRouter;


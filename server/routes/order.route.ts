import express, { Request, Response, NextFunction } from "express";
import { createCheckoutSession, stripeWebhook, getOrders, createPaymentIntent, confirmOrder, getOrderById, updateOrderStatus, cancelOrder } from "../controller/order.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();


const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

router.route("/").get(isAuthenticated, asyncHandler(getOrders));
router.route("/checkout/create-checkout-session").post(isAuthenticated, asyncHandler(createCheckoutSession));
// Test endpoint for debugging
router.route("/test").get((req, res) => {
    res.json({ success: true, message: "Order API is working", timestamp: new Date().toISOString() });
});

// Test authenticated endpoint
router.route("/auth-test").get(isAuthenticated, (req, res) => {
    res.json({ 
        success: true, 
        message: "Authentication working", 
        userId: req.id, 
        timestamp: new Date().toISOString() 
    });
});

// Mock payment intent for development (when Stripe is unreachable)
router.route("/mock-payment-intent").post(isAuthenticated, asyncHandler(async (req, res) => {
    console.log('Mock payment intent created for development');
    
    // Create order without Stripe
    const { amount, cartItems, deliveryDetails, restaurantId } = req.body;
    const userId = req.id;
    
    const order = new (await import('../models/order.model')).Order({
        user: userId,
        restaurant: restaurantId,
        deliveryDetails,
        cartItems: cartItems.map((item: any) => ({
            menuId: item._id,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity
        })),
        totalAmount: amount / 100,
        status: "pending",
        paymentIntentId: 'mock_pi_' + Date.now()
    });
    
    await order.save();
    
    res.json({
        success: true,
        clientSecret: 'mock_client_secret_' + Date.now(),
        orderId: order._id,
        message: 'Mock payment intent created (Stripe unavailable)'
    });
}));
router.route("/create-payment-intent").post(isAuthenticated, asyncHandler(createPaymentIntent));
router.route("/confirm-order").post(isAuthenticated, asyncHandler(confirmOrder));
router.route("/:orderId").get(isAuthenticated, asyncHandler(getOrderById));
router.route("/:orderId/cancel").put(isAuthenticated, asyncHandler(cancelOrder)); // User cancel order
router.route("/:orderId/status").put(asyncHandler(updateOrderStatus)); // Admin route - no auth for now
router.route("/webhook").post(express.raw({type: 'application/json'}), asyncHandler(stripeWebhook));

// Debug endpoint to inspect database state
router.route("/debug/inspect").get(asyncHandler(async (req, res) => {
    const { Order } = await import('../models/order.model');
    const { Restaurant } = await import('../models/resturant.model');
    
    const allOrders = await Order.find({}).lean();
    const allRestaurants = await Restaurant.find({}).lean();
    
    console.log('=== DEBUG INSPECTION ===');
    console.log('All orders:', allOrders.length);
    console.log('All restaurants:', allRestaurants.length);
    
    // Check for field name issues
    allOrders.forEach((order, index) => {
        console.log(`Order ${index + 1}:`, {
            _id: order._id,
            hasRestaurant: !!order.restaurant,
            hasResturant: !!(order as any).resturant,
            restaurantId: order.restaurant || (order as any).resturant,
            user: order.user
        });
    });
    
    allRestaurants.forEach((restaurant, index) => {
        console.log(`Restaurant ${index + 1}:`, {
            _id: restaurant._id,
            name: restaurant.restaurantName,
            user: restaurant.user
        });
    });
    
    res.json({
        success: true,
        data: {
            orders: allOrders.map(o => ({
                _id: o._id,
                restaurant: o.restaurant,
                resturant: (o as any).resturant,
                user: o.user,
                status: o.status
            })),
            restaurants: allRestaurants.map(r => ({
                _id: r._id,
                name: r.restaurantName,
                user: r.user
            }))
        }
    });
}));

export default router;




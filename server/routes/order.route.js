"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controller/order.controller");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const router = express_1.default.Router();
const asyncHandler = (fn) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield fn(req, res, next);
        }
        catch (error) {
            next(error);
        }
    });
};
router.route("/").get(isAuthenticated_1.isAuthenticated, asyncHandler(order_controller_1.getOrders));
router.route("/checkout/create-checkout-session").post(isAuthenticated_1.isAuthenticated, asyncHandler(order_controller_1.createCheckoutSession));
// Test endpoint for debugging
router.route("/test").get((req, res) => {
    res.json({ success: true, message: "Order API is working", timestamp: new Date().toISOString() });
});
// Test authenticated endpoint
router.route("/auth-test").get(isAuthenticated_1.isAuthenticated, (req, res) => {
    res.json({
        success: true,
        message: "Authentication working",
        userId: req.id,
        timestamp: new Date().toISOString()
    });
});
// Mock payment intent for development (when Stripe is unreachable)
router.route("/mock-payment-intent").post(isAuthenticated_1.isAuthenticated, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Mock payment intent created for development');
    // Create order without Stripe
    const { amount, cartItems, deliveryDetails, restaurantId } = req.body;
    const userId = req.id;
    const order = new (yield Promise.resolve().then(() => __importStar(require('../models/order.model')))).Order({
        user: userId,
        restaurant: restaurantId,
        deliveryDetails,
        cartItems: cartItems.map((item) => ({
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
    yield order.save();
    res.json({
        success: true,
        clientSecret: 'mock_client_secret_' + Date.now(),
        orderId: order._id,
        message: 'Mock payment intent created (Stripe unavailable)'
    });
})));
router.route("/create-payment-intent").post(isAuthenticated_1.isAuthenticated, asyncHandler(order_controller_1.createPaymentIntent));
router.route("/confirm-order").post(isAuthenticated_1.isAuthenticated, asyncHandler(order_controller_1.confirmOrder));
router.route("/:orderId").get(isAuthenticated_1.isAuthenticated, asyncHandler(order_controller_1.getOrderById));
router.route("/:orderId/cancel").put(isAuthenticated_1.isAuthenticated, asyncHandler(order_controller_1.cancelOrder)); // User cancel order
router.route("/:orderId/status").put(asyncHandler(order_controller_1.updateOrderStatus)); // Admin route - no auth for now
router.route("/webhook").post(express_1.default.raw({ type: 'application/json' }), asyncHandler(order_controller_1.stripeWebhook));
// Debug endpoint to inspect database state
router.route("/debug/inspect").get(asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Order } = yield Promise.resolve().then(() => __importStar(require('../models/order.model')));
    const { Restaurant } = yield Promise.resolve().then(() => __importStar(require('../models/resturant.model')));
    const allOrders = yield Order.find({}).lean();
    const allRestaurants = yield Restaurant.find({}).lean();
    console.log('=== DEBUG INSPECTION ===');
    console.log('All orders:', allOrders.length);
    console.log('All restaurants:', allRestaurants.length);
    // Check for field name issues
    allOrders.forEach((order, index) => {
        console.log(`Order ${index + 1}:`, {
            _id: order._id,
            hasRestaurant: !!order.restaurant,
            hasResturant: !!order.resturant,
            restaurantId: order.restaurant || order.resturant,
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
                resturant: o.resturant,
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
})));
exports.default = router;

"use strict";
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
exports.updateOrderStatus = exports.cancelOrder = exports.getOrderById = exports.confirmOrder = exports.createPaymentIntent = exports.createLineItems = exports.stripeWebhook = exports.createCheckoutSession = exports.getOrders = void 0;
const order_model_1 = require("../models/order.model");
const stripe_1 = __importDefault(require("stripe"));
const resturant_model_1 = require("../models/resturant.model");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.Order.find({ user: req.id }).populate('user').populate('restaurant');
        return res.status(200).json({
            success: true,
            orders
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.getOrders = getOrders;
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkoutSessionRequest = req.body;
        const restaurant = yield resturant_model_1.Restaurant.findById(checkoutSessionRequest.restaurantId).populate('menus');
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found."
            });
        }
        ;
        // Validate delivery details to prevent placeholder text
        const validateDeliveryDetails = (details) => {
            const errors = [];
            // Check for placeholder patterns
            const isPlaceholderText = (value) => {
                if (!value || typeof value !== 'string')
                    return true;
                const placeholderPatterns = [
                    /^update your (address|city|country)$/i,
                    /^enter your (address|city|country)$/i,
                    /^(address|city|country)$/i,
                    /^unknown$/i
                ];
                return placeholderPatterns.some(pattern => pattern.test(value.trim()));
            };
            if (!details.name || details.name.trim().length < 2) {
                errors.push('Valid full name is required');
            }
            if (!details.email || !details.email.includes('@')) {
                errors.push('Valid email is required');
            }
            if (!details.city || isPlaceholderText(details.city) || details.city.trim().length < 2) {
                errors.push('Valid city name is required');
            }
            if (!details.address || isPlaceholderText(details.address) || details.address.trim().length < 10) {
                errors.push('Valid complete address is required');
            }
            return errors;
        };
        const validationErrors = validateDeliveryDetails(checkoutSessionRequest.deliveryDetails);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid delivery details: " + validationErrors.join(', ')
            });
        }
        // Calculate total amount
        const totalAmount = checkoutSessionRequest.cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        const order = new order_model_1.Order({
            restaurant: restaurant._id,
            user: req.id,
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            cartItems: checkoutSessionRequest.cartItems,
            totalAmount: totalAmount,
            status: "pending"
        });
        // line items
        const menuItems = restaurant.menus;
        const lineItems = (0, exports.createLineItems)(checkoutSessionRequest, menuItems);
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['GB', 'US', 'CA', 'IN']
            },
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/order/status`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
            metadata: {
                orderId: order._id.toString(),
                images: JSON.stringify(menuItems.map((item) => item.image))
            }
        });
        if (!session.url) {
            return res.status(400).json({ success: false, message: "Error while creating session" });
        }
        yield order.save();
        return res.status(200).json({
            session
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.createCheckoutSession = createCheckoutSession;
const stripeWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let event;
    try {
        const signature = req.headers["stripe-signature"];
        // Construct the payload string for verification
        const payloadString = JSON.stringify(req.body, null, 2);
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET;
        // Generate test header string for event construction
        const header = stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret,
        });
        // Construct the event using the payload string and header
        event = stripe.webhooks.constructEvent(payloadString, header, secret);
    }
    catch (error) {
        console.error('Webhook error:', error.message);
        return res.status(400).send(`Webhook error: ${error.message}`);
    }
    // Handle the checkout session completed event
    if (event.type === "checkout.session.completed") {
        try {
            const session = event.data.object;
            const order = yield order_model_1.Order.findById((_a = session.metadata) === null || _a === void 0 ? void 0 : _a.orderId);
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }
            if (session.amount_total) {
                order.totalAmount = session.amount_total;
            }
            order.status = "confirmed";
            yield order.save();
        }
        catch (error) {
            console.error('Error handling event:', error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    // Handle payment intent succeeded event
    if (event.type === "payment_intent.succeeded") {
        try {
            const paymentIntent = event.data.object;
            const order = yield order_model_1.Order.findOne({ paymentIntentId: paymentIntent.id });
            if (!order) {
                return res.status(404).json({ message: "Order not found for payment intent" });
            }
            order.status = "confirmed";
            yield order.save();
            console.log(`Order ${order._id} confirmed via payment intent ${paymentIntent.id}`);
        }
        catch (error) {
            console.error('Error handling payment intent succeeded:', error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    res.status(200).send();
});
exports.stripeWebhook = stripeWebhook;
const createLineItems = (checkoutSessionRequest, menuItems) => {
    const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find((item) => item._id.toString() === cartItem.menuId);
        if (!menuItem)
            throw new Error(`Menu item id not found`);
        return {
            price_data: {
                currency: 'inr',
                product_data: {
                    name: menuItem.name,
                    images: [menuItem.image],
                },
                unit_amount: menuItem.price * 100
            },
            quantity: cartItem.quantity,
        };
    });
    return lineItems;
};
exports.createLineItems = createLineItems;
const createPaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('\n=== PAYMENT INTENT REQUEST RECEIVED ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    console.log('Request headers:', {
        'content-type': req.headers['content-type'],
        'user-agent': req.headers['user-agent'],
        'cookie': req.headers.cookie ? 'Present' : 'Missing'
    });
    console.log('Auth middleware result - User ID:', req.id);
    try {
        console.log('=== CREATE PAYMENT INTENT SERVER DEBUG ===');
        console.log('Request body:', req.body);
        console.log('User ID from auth:', req.id);
        const { amount, cartItems, deliveryDetails, restaurantId } = req.body;
        const userId = req.id;
        console.log('Parsed values:', { amount, cartItemsCount: cartItems === null || cartItems === void 0 ? void 0 : cartItems.length, restaurantId, userId });
        // Quick validation
        if (!amount || !cartItems || !deliveryDetails || !restaurantId || !userId) {
            console.log('Validation failed - missing required fields');
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }
        // Validate delivery details to prevent placeholder text
        const validateDeliveryDetails = (details) => {
            const errors = [];
            // Check for placeholder patterns
            const isPlaceholderText = (value, field) => {
                if (!value || typeof value !== 'string')
                    return true;
                const placeholderPatterns = [
                    /^update your (address|city|country)$/i,
                    /^enter your (address|city|country)$/i,
                    /^(address|city|country)$/i,
                    /^unknown$/i
                ];
                return placeholderPatterns.some(pattern => pattern.test(value.trim()));
            };
            // Name validation
            if (!details.name || details.name.trim().length < 2) {
                errors.push('Valid full name is required');
            }
            // Email validation (basic check)
            if (!details.email || !details.email.includes('@')) {
                errors.push('Valid email is required');
            }
            // Contact validation removed - not part of user profile
            // City validation
            if (!details.city || isPlaceholderText(details.city, 'city') || details.city.trim().length < 2) {
                errors.push('Valid city name is required');
            }
            // Address validation
            if (!details.address || isPlaceholderText(details.address, 'address') || details.address.trim().length < 10) {
                errors.push('Valid complete address is required');
            }
            // Country validation
            if (!details.country || isPlaceholderText(details.country, 'country') || details.country.trim().length < 2) {
                errors.push('Valid country name is required');
            }
            return errors;
        };
        // Validate delivery details
        console.log('Validating delivery details:', deliveryDetails);
        const validationErrors = validateDeliveryDetails(deliveryDetails);
        if (validationErrors.length > 0) {
            console.log('Delivery details validation failed:', validationErrors);
            return res.status(400).json({
                success: false,
                message: "Invalid delivery details: " + validationErrors.join(', ')
            });
        }
        // Optimize: Use lean() for faster query and only check existence
        console.log('Checking if restaurant exists:', restaurantId);
        const restaurantExists = yield resturant_model_1.Restaurant.exists({ _id: restaurantId });
        console.log('Restaurant exists:', restaurantExists);
        if (!restaurantExists) {
            console.log('Restaurant not found');
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }
        // Create payment intent and order in parallel for better performance
        console.log('Creating payment intent with Stripe...');
        const [paymentIntent, orderData] = yield Promise.all([
            // Create payment intent with Stripe
            Promise.race([
                stripe.paymentIntents.create({
                    amount: amount, // Amount in paise (already converted from frontend)
                    currency: 'inr',
                    automatic_payment_methods: {
                        enabled: true,
                    },
                    metadata: {
                        userId: userId.toString(),
                        restaurantId: restaurantId.toString(),
                        // Reduce metadata size for faster processing
                        itemCount: cartItems.length.toString(),
                        totalAmount: (amount / 100).toString()
                    }
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Stripe API timeout')), 15000))
            ]),
            // Prepare order data (but don't save yet)
            Promise.resolve({
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
                totalAmount: amount / 100, // Convert back to rupees for storage
                status: "pending"
            })
        ]);
        // Save order with payment intent ID
        console.log('Saving order to database...');
        const order = new order_model_1.Order(Object.assign(Object.assign({}, orderData), { paymentIntentId: paymentIntent.id }));
        yield order.save();
        console.log('Order saved successfully:', order._id);
        // Return response quickly
        console.log('Returning payment intent response');
        return res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            orderId: order._id
        });
    }
    catch (error) {
        console.error('=== PAYMENT INTENT ERROR ===');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        // Handle different error types
        if (error.message === 'Stripe API timeout') {
            console.error('Stripe API timeout occurred');
            return res.status(408).json({
                success: false,
                message: "Payment service is temporarily unavailable. Please try again."
            });
        }
        // Handle specific Stripe errors
        if (error.type === 'StripeCardError' || error.type === 'StripeRateLimitError') {
            console.error('Stripe error occurred:', error.type);
            return res.status(402).json({
                success: false,
                message: "Payment processing error. Please try again."
            });
        }
        // Handle MongoDB errors
        if (error.name === 'MongoError' || error.name === 'MongoServerError') {
            console.error('Database error occurred');
            return res.status(503).json({
                success: false,
                message: "Database temporarily unavailable. Please try again."
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later."
        });
    }
});
exports.createPaymentIntent = createPaymentIntent;
const confirmOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.body;
        const userId = req.id;
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }
        // Find and update the order
        const order = yield order_model_1.Order.findOne({
            _id: orderId,
            user: userId
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        order.status = "confirmed";
        yield order.save();
        return res.status(200).json({
            success: true,
            message: "Order confirmed successfully",
            order
        });
    }
    catch (error) {
        console.error('Error confirming order:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.confirmOrder = confirmOrder;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const userId = req.id;
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }
        // Find order with restaurant details
        const order = yield order_model_1.Order.findOne({
            _id: orderId,
            user: userId
        }).populate('restaurant', 'restaurantName city address');
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        return res.status(200).json({
            success: true,
            order
        });
    }
    catch (error) {
        console.error('Error fetching order:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.getOrderById = getOrderById;
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const userId = req.id;
        console.log('User requesting to cancel order:', { orderId, userId });
        // Find the order and verify it belongs to the user
        const order = yield order_model_1.Order.findOne({
            _id: orderId,
            user: userId
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found or you don't have permission to cancel this order"
            });
        }
        // Check if order can be cancelled (only pending and confirmed orders)
        const cancellableStatuses = ['pending', 'confirmed'];
        if (!cancellableStatuses.includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel order. Order is already ${order.status}. Only pending and confirmed orders can be cancelled.`
            });
        }
        // Update order status to cancelled
        order.status = 'cancelled';
        order.updatedAt = new Date();
        yield order.save();
        console.log('Order cancelled successfully:', orderId, 'by user:', userId);
        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order: {
                _id: order._id,
                status: order.status,
                updatedAt: order.updatedAt
            }
        });
    }
    catch (error) {
        console.error('Error cancelling order:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.cancelOrder = cancelOrder;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        console.log('Updating order status:', { orderId, status });
        const validStatuses = ['pending', 'confirmed', 'preparing', 'outfordelivery', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }
        // Check if order exists first with lean query to see raw fields
        const orderDoc = yield order_model_1.Order.findById(orderId).lean();
        console.log('Order found:', {
            _id: orderDoc === null || orderDoc === void 0 ? void 0 : orderDoc._id,
            hasRestaurant: !!(orderDoc === null || orderDoc === void 0 ? void 0 : orderDoc.restaurant),
            hasResturant: !!(orderDoc === null || orderDoc === void 0 ? void 0 : orderDoc.resturant),
            restaurantId: (orderDoc === null || orderDoc === void 0 ? void 0 : orderDoc.restaurant) || (orderDoc === null || orderDoc === void 0 ? void 0 : orderDoc.resturant),
            currentStatus: orderDoc === null || orderDoc === void 0 ? void 0 : orderDoc.status
        });
        if (!orderDoc) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        const order = yield order_model_1.Order.findByIdAndUpdate(orderId, { status, updatedAt: new Date() }, { new: true }).populate('restaurant', 'restaurantName');
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found after update"
            });
        }
        console.log('Order status updated successfully:', orderId, 'from', orderDoc.status, 'to', status);
        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });
    }
    catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.updateOrderStatus = updateOrderStatus;

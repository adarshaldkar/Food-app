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
exports.fixDuplicateRestaurants = exports.getSingleRestaurant = exports.getAllRestaurants = exports.searchRestaurant = exports.updateOrderStatus = exports.getRestaurantOrder = exports.updateRestaurant = exports.getRestaurant = exports.createRestaurant = void 0;
const resturant_model_1 = require("../models/resturant.model");
const order_model_1 = require("../models/order.model");
const imageUpload_1 = __importDefault(require("../utils/imageUpload"));
const createRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('=== Start of createRestaurant ===');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        console.log('Request headers:', req.headers);
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
        console.log('Parsed values:', { restaurantName, city, country, deliveryTime, cuisines });
        // Check if user already has a restaurant
        const existingRestaurant = yield resturant_model_1.Restaurant.findOne({ user: req.id });
        if (existingRestaurant) {
            console.log('User already has a restaurant:', existingRestaurant.restaurantName);
            return res.status(400).json({
                success: false,
                message: 'You can only create one restaurant per account'
            });
        }
        const file = req.file;
        if (!file) {
            console.log('No file uploaded');
            return res.status(400).json({
                success: false,
                message: 'Please upload an image'
            });
        }
        console.log('File details:', {
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size
        });
        try {
            console.log('Attempting to upload image to cloudinary');
            const imageUrl = yield (0, imageUpload_1.default)(file);
            console.log('Image uploaded successfully:', imageUrl);
            console.log('Creating restaurant with data:', {
                restaurantName,
                city,
                country,
                deliveryTime,
                cuisines,
                user: req.id,
                imageUrl
            });
            yield resturant_model_1.Restaurant.create({
                restaurantName,
                city,
                country,
                deliveryTime,
                cuisines: JSON.parse(cuisines),
                user: req.id,
                imageUrl
            });
            console.log('Restaurant created successfully');
            return res.status(201).json({
                success: true,
                message: 'Restaurant added successfully'
            });
        }
        catch (innerError) {
            console.error('Inner operation failed:', innerError);
            return res.status(500).json({
                success: false,
                message: 'Failed to process restaurant data'
            });
        }
    }
    catch (error) {
        console.error('Error in createRestaurant:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
});
exports.createRestaurant = createRestaurant;
const getRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('=== GET RESTAURANT DEBUG ===');
        console.log('Authenticated user ID:', req.id);
        console.log('Request headers:', req.headers.authorization || 'No auth header');
        // Check if user ID exists
        if (!req.id) {
            console.log('ERROR: No user ID found in request');
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        // First, let's see all restaurants in the database for debugging
        const allRestaurants = yield resturant_model_1.Restaurant.find({}).select('user restaurantName');
        console.log('All restaurants in DB:', allRestaurants.map(r => ({
            id: r._id,
            userId: r.user,
            name: r.restaurantName
        })));
        const restaurant = yield resturant_model_1.Restaurant.findOne({ user: req.id }).populate('menus');
        console.log('Query result for user', req.id, ':', restaurant ? {
            id: restaurant._id,
            name: restaurant.restaurantName,
            user: restaurant.user
        } : 'null');
        if (!restaurant) {
            console.log('No restaurant found for user:', req.id);
            return res.status(404).json({
                success: false,
                restaurant: null,
                message: 'Restaurant not found'
            });
        }
        console.log('Returning restaurant:', restaurant.restaurantName);
        return res.status(200).json({
            success: true,
            restaurant
        });
    }
    catch (error) {
        console.error('Error fetching restaurant:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.getRestaurant = getRestaurant;
const updateRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Update Request body:', req.body);
        console.log('Update Request files:', req.files);
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
        console.log('Update destructured values:', { restaurantName, city, country, deliveryTime, cuisines });
        // Use req.id from auth middleware instead of params
        const userId = req.id;
        console.log('Using authenticated userId:', userId);
        const restaurant = yield resturant_model_1.Restaurant.findOne({ user: userId });
        console.log('Found restaurant for update:', restaurant);
        if (!restaurant) {
            console.log('Restaurant not found for update');
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }
        // Update restaurant properties
        restaurant.restaurantName = restaurantName || restaurant.restaurantName;
        restaurant.city = city || restaurant.city;
        restaurant.country = country || restaurant.country;
        restaurant.deliveryTime = deliveryTime || restaurant.deliveryTime;
        restaurant.cuisines = cuisines ? JSON.parse(cuisines) : restaurant.cuisines;
        // Handle image update if provided
        const files = req.files;
        if (files && files.length > 0) {
            const imageUrl = yield (0, imageUpload_1.default)(files[0]);
            restaurant.imageUrl = imageUrl;
        }
        yield restaurant.save();
        console.log('Restaurant updated successfully:', restaurant);
        return res.status(200).json({
            success: true,
            message: 'Restaurant updated successfully',
            restaurant
        });
    }
    catch (error) {
        console.error('Update restaurant error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.updateRestaurant = updateRestaurant;
const getRestaurantOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('\n=== RESTAURANT ORDERS DEBUG ===');
        console.log('Request user ID:', req.id);
        // First, let's see ALL orders to debug
        const allOrders = yield order_model_1.Order.find({}).lean();
        console.log('Total orders in database:', allOrders.length);
        allOrders.forEach((order, index) => {
            console.log(`Order ${index + 1}:`, {
                _id: order._id,
                restaurant: order.restaurant,
                resturant: order.resturant, // Check if old field exists
                user: order.user,
                status: order.status
            });
        });
        // Find restaurant for current user
        const restaurantData = yield resturant_model_1.Restaurant.findOne({ user: req.id });
        if (!restaurantData) {
            console.log('❌ Restaurant not found for user:', req.id);
            // Let's see all restaurants to debug
            const allRestaurants = yield resturant_model_1.Restaurant.find({}).lean();
            console.log('All restaurants:');
            allRestaurants.forEach((r, index) => {
                console.log(`Restaurant ${index + 1}:`, {
                    _id: r._id,
                    name: r.restaurantName,
                    user: r.user
                });
            });
            return res.status(404).json({
                success: false,
                message: "Restaurant not found",
                debug: {
                    userId: req.id,
                    totalRestaurants: allRestaurants.length,
                    restaurants: allRestaurants.map(r => ({ id: r._id, user: r.user, name: r.restaurantName }))
                }
            });
        }
        console.log('✅ Found restaurant:', restaurantData.restaurantName, 'ID:', restaurantData._id);
        // Use $or to search both old and new field names for backward compatibility
        const orders = yield order_model_1.Order.find({
            $or: [
                { restaurant: restaurantData._id },
                { resturant: restaurantData._id }
            ]
        })
            .populate('restaurant', 'restaurantName')
            .populate('user', 'fullName email contact')
            .sort({ createdAt: -1 });
        console.log('Total orders found:', orders.length);
        return res.status(200).json({
            success: true,
            orders: orders,
            debug: {
                restaurantId: restaurantData._id,
                restaurantName: restaurantData.restaurantName,
                totalOrders: orders.length,
                searchedForBothFields: true
            }
        });
    }
    catch (error) {
        console.error('❌ Error getting restaurant orders:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error'
        });
    }
});
exports.getRestaurantOrder = getRestaurantOrder;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        console.log('Updating order status:', { orderId, status });
        // Validate status
        const validStatuses = ['pending', 'confirmed', 'preparing', 'outfordelivery', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be one of: " + validStatuses.join(', ')
            });
        }
        // Use lean() to get raw database document with both field names
        const orderDoc = yield order_model_1.Order.findById(orderId).lean();
        if (!orderDoc) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        // Verify that this order belongs to the restaurant owned by the authenticated user
        const restaurant = yield resturant_model_1.Restaurant.findOne({ user: req.id });
        if (!restaurant) {
            return res.status(403).json({
                success: false,
                message: "Restaurant not found for authenticated user"
            });
        }
        // Check both restaurant and resturant fields for backward compatibility
        const orderRestaurantId = orderDoc.restaurant || orderDoc.resturant;
        console.log('Authorization check:', {
            orderRestaurantId,
            restaurantId: restaurant._id,
            hasRestaurant: !!orderDoc.restaurant,
            hasResturant: !!orderDoc.resturant,
            orderDoc: { _id: orderDoc._id, restaurant: orderDoc.restaurant, resturant: orderDoc.resturant }
        });
        if (!orderRestaurantId || orderRestaurantId.toString() !== restaurant._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this order"
            });
        }
        // Now get the actual order model for updating
        const order = yield order_model_1.Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found for update"
            });
        }
        order.status = status;
        yield order.save();
        console.log('Order status updated successfully:', orderId, 'to', status);
        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order: {
                _id: order._id,
                status: order.status
            }
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
const searchRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("=== Restaurant Search Request ===");
        console.log("Params:", req.params);
        console.log("Query:", req.query);
        const searchText = req.params.searchText || "";
        const searchQuery = req.query.searchQuery || "";
        const selectedCuisines = (req.query.selectedCuisines || "")
            .split(",")
            .map(cuisine => cuisine.trim())
            .filter(cuisine => cuisine.length > 0);
        console.log("Parsed search params:", {
            searchText,
            searchQuery,
            selectedCuisines
        });
        let query = {};
        let searchConditions = [];
        // Build search conditions - NORMAL search (not inverse)
        if (searchText && searchText !== 'all' && searchText.trim() !== '') {
            const searchTerm = searchText.trim();
            searchConditions.push({
                $or: [
                    { restaurantName: { $regex: searchTerm, $options: 'i' } },
                    { city: { $regex: searchTerm, $options: 'i' } },
                    { country: { $regex: searchTerm, $options: 'i' } },
                    { cuisines: { $regex: searchTerm, $options: 'i' } }
                ]
            });
        }
        // Additional search query
        if (searchQuery && searchQuery.trim() !== '') {
            const queryTerm = searchQuery.trim();
            searchConditions.push({
                $or: [
                    { restaurantName: { $regex: queryTerm, $options: 'i' } },
                    { city: { $regex: queryTerm, $options: 'i' } },
                    { country: { $regex: queryTerm, $options: 'i' } },
                    { cuisines: { $regex: queryTerm, $options: 'i' } }
                ]
            });
        }
        // Combine search conditions
        if (searchConditions.length > 0) {
            if (searchConditions.length === 1) {
                query = searchConditions[0];
            }
            else {
                query = { $and: searchConditions };
            }
        }
        // Add cuisine filter
        if (selectedCuisines.length > 0) {
            const cuisineFilter = {
                cuisines: {
                    $in: selectedCuisines.map(cuisine => new RegExp(cuisine, 'i'))
                }
            };
            if (Object.keys(query).length > 0) {
                query = {
                    $and: [
                        query,
                        cuisineFilter
                    ]
                };
            }
            else {
                query = cuisineFilter;
            }
        }
        console.log("Final MongoDB Query:", JSON.stringify(query, null, 2));
        // Execute the search
        const restaurants = yield resturant_model_1.Restaurant.find(query).populate('menus');
        console.log("Search Results:", {
            totalFound: restaurants.length,
            restaurants: restaurants.map(r => ({
                name: r.restaurantName,
                city: r.city,
                country: r.country,
                cuisines: r.cuisines
            }))
        });
        return res.status(200).json({
            success: true,
            restaurants: restaurants
        });
    }
    catch (error) {
        console.error("Error in searchRestaurant:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.searchRestaurant = searchRestaurant;
const getAllRestaurants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Getting all restaurants");
        const restaurants = yield resturant_model_1.Restaurant.find({}).populate('menus');
        console.log(`Found ${restaurants.length} restaurants`);
        return res.status(200).json({
            success: true,
            restaurants: restaurants
        });
    }
    catch (error) {
        console.error("Error in getAllRestaurants:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.getAllRestaurants = getAllRestaurants;
const getSingleRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: restaurantId } = req.params;
        console.log('Getting single restaurant with ID:', restaurantId);
        const restaurant = yield resturant_model_1.Restaurant.findById(restaurantId).populate({
            path: 'menus',
            options: { createdAt: -1 }
        });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }
        console.log('Found restaurant:', restaurant.restaurantName);
        return res.status(200).json({
            success: true,
            restaurant
        });
    }
    catch (error) {
        console.log('Error in getSingleRestaurant:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getSingleRestaurant = getSingleRestaurant;
const fixDuplicateRestaurants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('=== FIXING DUPLICATE RESTAURANTS ===');
        // Find all restaurants grouped by user
        const duplicates = yield resturant_model_1.Restaurant.aggregate([
            {
                $group: {
                    _id: "$user",
                    restaurants: { $push: "$$ROOT" },
                    count: { $sum: 1 }
                }
            },
            {
                $match: { count: { $gt: 1 } }
            }
        ]);
        console.log(`Found ${duplicates.length} users with duplicate restaurants`);
        let deletedCount = 0;
        for (const duplicate of duplicates) {
            const restaurants = duplicate.restaurants;
            // Keep the most recent restaurant, delete the rest
            restaurants.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            const toKeep = restaurants[0];
            const toDelete = restaurants.slice(1);
            console.log(`User ${duplicate._id}: Keeping restaurant "${toKeep.restaurantName}", deleting ${toDelete.length} duplicates`);
            for (const restaurant of toDelete) {
                yield resturant_model_1.Restaurant.findByIdAndDelete(restaurant._id);
                deletedCount++;
            }
        }
        console.log(`Cleanup complete. Deleted ${deletedCount} duplicate restaurants.`);
        return res.status(200).json({
            success: true,
            message: `Successfully removed ${deletedCount} duplicate restaurants`,
            duplicatesFixed: duplicates.length,
            restaurantsDeleted: deletedCount
        });
    }
    catch (error) {
        console.error('Error fixing duplicate restaurants:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.fixDuplicateRestaurants = fixDuplicateRestaurants;

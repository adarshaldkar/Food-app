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
exports.deleteMenu = exports.editMenu = exports.addMenu = void 0;
const menu_model_1 = require("../models/menu.model");
const resturant_model_1 = require("../models/resturant.model");
const imageUpload_1 = __importDefault(require("../utils/imageUpload"));
const addMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price } = req.body;
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                success: false,
                message: " file need to be  uploaded",
            });
        }
        const restaurant = yield resturant_model_1.Restaurant.findOne({ user: req.id });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found. Please create a restaurant first.",
            });
        }
        const imageURL = yield (0, imageUpload_1.default)(file);
        const menu = new menu_model_1.Menu({
            name,
            description,
            price,
            image: imageURL,
            restaurant: restaurant._id, // Associate menu with restaurant
        });
        yield menu.save();
        // Add menu to restaurant's menus array
        restaurant.menus.push(menu._id);
        yield restaurant.save();
        res.status(200).json({
            success: true,
            message: "Menu added successfully",
            menu,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.addMenu = addMenu;
const editMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;
        const file = req.file;
        // First, find the restaurant that owns this menu to verify authorization
        const restaurant = yield resturant_model_1.Restaurant.findOne({ user: req.id, menus: id });
        if (!restaurant) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to edit this menu"
            });
        }
        const menu = yield menu_model_1.Menu.findById(id);
        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menu not found!"
            });
        }
        if (name)
            menu.name = name;
        if (description)
            menu.description = description;
        if (price)
            menu.price = price;
        if (file) {
            const imageUrl = yield (0, imageUpload_1.default)(file);
            menu.image = imageUrl;
        }
        yield menu.save();
        return res.status(200).json({
            success: true,
            message: "Menu updated",
            menu,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.editMenu = editMenu;
const deleteMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // First, verify that the user owns the restaurant that has this menu
        const restaurant = yield resturant_model_1.Restaurant.findOne({ user: req.id, menus: id });
        if (!restaurant) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this menu"
            });
        }
        const menu = yield menu_model_1.Menu.findById(id);
        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menu not found!"
            });
        }
        // Remove menu from restaurant's menus array (using the restaurant we already found)
        restaurant.menus = restaurant.menus.filter((menuId) => menuId.toString() !== id);
        yield restaurant.save();
        // Delete the menu
        yield menu_model_1.Menu.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Menu deleted successfully"
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteMenu = deleteMenu;

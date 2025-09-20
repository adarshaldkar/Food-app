import mongoose from "mongoose";

export interface IRestaurant {
    user: mongoose.Schema.Types.ObjectId;
    restaurantName: String;
    city: String;
    country: String;
    deliveryTime: Number;
    cuisines: String[];
    imageUrl: String;
    menus: mongoose.Schema.Types.ObjectId[];
}

export interface IRestaurantDocument extends IRestaurant, Document {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

const restaurantSchema = new mongoose.Schema<IRestaurantDocument>({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true, // Ensure one user can only have one restaurant
    },
    restaurantName: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    deliveryTime: {
        type: Number,
        required: true,
    }, 
    cuisines: [{type: String, required: true}],
    menus: [{type: mongoose.Schema.Types.ObjectId, ref: "Menu"}],
    imageUrl: {
        type: String,
        required: true,
    }
});

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
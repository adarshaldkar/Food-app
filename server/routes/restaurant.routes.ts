import express from "express"
import { createRestaurant, getAllRestaurants, getRestaurant, getRestaurantOrder, getSingleRestaurant, searchRestaurant, updateOrderStatus, updateRestaurant, fixDuplicateRestaurants } from "../controller/restaurant.controller";
import upload from "../middlewares/multer";
import {isAuthenticated} from "../middlewares/isAuthenticated";

const router = express.Router();

router.route("/").post(isAuthenticated, upload.single("imageFile"), createRestaurant);
router.route("/").get(isAuthenticated, getRestaurant);
router.route("/").put(isAuthenticated, upload.single("imageFile"), updateRestaurant);
router.route("/all").get(getAllRestaurants);
router.route("/order").get(isAuthenticated,  getRestaurantOrder);
router.route("/order/:orderId/status").put(isAuthenticated, updateOrderStatus);
router.route("/search/:searchText").get(searchRestaurant);
router.route("/fix-duplicates").post(fixDuplicateRestaurants); // Admin cleanup route
router.route("/:id").get(isAuthenticated, getSingleRestaurant);

export default router;

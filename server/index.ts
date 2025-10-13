import express from "express";
import connectDB from "./db/connectDB";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.routes";
import restaurantRoute from "./routes/restaurant.routes";
import menuRoute from "./routes/menu.route";
import orderRoute from "./routes/order.route";
import ownerRequestRoute from "./routes/ownerRequest.route";



dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;
app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({ extended: true,limit:"10mb" }));
app.use(cookieParser());

const corsOptions = {
  origin: [process.env.FRONTEND_URL || "http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
};

app.use(cors(corsOptions));

app.use("/api/v1/users",userRoute);
app.use("/api/v1/restaurant",restaurantRoute);
app.use("/api/v1/menu",menuRoute);
app.use("/api/v1/orders",orderRoute);
app.use("/api/v1/owner-request", ownerRequestRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server listening at port ${PORT}`);
});
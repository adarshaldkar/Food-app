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

const PORT = parseInt(process.env.PORT || '5001', 10);
app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({ extended: true,limit:"10mb" }));
app.use(cookieParser());

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173", 
    "http://localhost:5174", 
    "http://localhost:3000",
    "https://food-app-clone-eight.vercel.app", // Production frontend URL
    "https://food-app-alpha-rose.vercel.app" // Alternative frontend URL
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
};

app.use(cors(corsOptions));

// Health check endpoint for Render - Updated CORS config
app.get("/", (req, res) => {
  res.json({ 
    success: true, 
    message: "Food App Server is running!",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

app.get("/health", (req, res) => {
  res.json({ 
    success: true, 
    message: "Server is healthy",
    timestamp: new Date().toISOString()
  });
});

// Temporary endpoint to check server IP
app.get("/ip", async (req, res) => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const ipData = await response.json();
    res.json({ 
      success: true,
      serverIP: ipData.ip,
      timestamp: new Date().toISOString(),
      message: "Add this IP to MongoDB Atlas whitelist"
    });
  } catch (error) {
    res.json({ 
      success: false, 
      error: "Could not fetch IP",
      fallbackIP: req.ip || req.connection.remoteAddress
    });
  }
});

// Debug endpoint to check environment variables
app.get("/debug", (req, res) => {
  res.json({
    success: true,
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      MONGO_URI: process.env.MONGO_URI ? 'SET' : 'NOT SET',
      FRONTEND_URL: process.env.FRONTEND_URL || 'NOT SET',
      JWT_SECRET_KEY: process.env.JWT_SECRET_KEY ? 'SET' : 'NOT SET',
      USE_PRODUCTION_EMAIL: process.env.USE_PRODUCTION_EMAIL || 'NOT SET',
      EMAIL_USER: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? 'SET' : 'NOT SET'
    },
    timestamp: new Date().toISOString()
  });
});

app.use("/api/v1/users",userRoute);
app.use("/api/v1/restaurant",restaurantRoute);
app.use("/api/v1/menu",menuRoute);
app.use("/api/v1/orders",orderRoute);
app.use("/api/v1/owner-request", ownerRequestRoute);

app.listen(PORT, '0.0.0.0', () => {
  connectDB();
  console.log(`Server listening at port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

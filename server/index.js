"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connectDB_1 = __importDefault(require("./db/connectDB"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const restaurant_routes_1 = __importDefault(require("./routes/restaurant.routes"));
const menu_route_1 = __importDefault(require("./routes/menu.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const ownerRequest_route_1 = __importDefault(require("./routes/ownerRequest.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((0, cookie_parser_1.default)());
const corsOptions = {
    origin: [process.env.FRONTEND_URL || "http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
};
app.use((0, cors_1.default)(corsOptions));
app.use("/api/v1/users", user_routes_1.default);
app.use("/api/v1/restaurant", restaurant_routes_1.default);
app.use("/api/v1/menu", menu_route_1.default);
app.use("/api/v1/orders", order_route_1.default);
app.use("/api/v1/owner-request", ownerRequest_route_1.default);
app.listen(PORT, () => {
    (0, connectDB_1.default)();
    console.log(`Server listening at port ${PORT}`);
});

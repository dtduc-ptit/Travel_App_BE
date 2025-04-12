"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const phongtuc_routes_1 = __importDefault(require("./routes/phongtuc.routes"));
const media_routes_1 = __importDefault(require("./routes/media.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Kết nối MongoDB
mongoose_1.default
    .connect(process.env.MONGO_URI, {
// Chú ý: Trong Mongoose >= 6, không cần các option này nữa
})
    .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
})
    .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
});
// Sử dụng route
app.use('/api/phongtucs', phongtuc_routes_1.default);
app.use('/api/media', media_routes_1.default);
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

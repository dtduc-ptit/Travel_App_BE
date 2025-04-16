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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const os_1 = __importDefault(require("os"));
const phongtuc_routes_1 = __importDefault(require("./routes/phongtuc.routes"));
const media_routes_1 = __importDefault(require("./routes/media.routes"));
const nguoidung_routes_1 = __importDefault(require("./routes/nguoidung.routes"));
const ditich_routes_1 = __importDefault(require("./routes/ditich.routes"));
const lichtrinh_routes_1 = __importDefault(require("./routes/lichtrinh.routes"));
const sukien_routes_1 = __importDefault(require("./routes/sukien.routes"));
const thongbaosukien_routes_1 = __importDefault(require("./routes/thongbaosukien.routes"));
const kienthuc_routes_1 = __importDefault(require("./routes/kienthuc.routes"));
const notificationScheduler_1 = require("./utils/notificationScheduler"); // Import hàm
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
const host = '0.0.0.0'; // Cho phép các thiết bị khác trong mạng truy cập
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Kết nối MongoDB
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('✅ Connected to MongoDB successfully!');
}))
    .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
});
// Routes
app.use('/api/phongtucs', phongtuc_routes_1.default);
app.use('/api/media', media_routes_1.default);
app.use('/api/nguoidung', nguoidung_routes_1.default);
app.use('/api/ditich', ditich_routes_1.default);
app.use('/api/sukien', sukien_routes_1.default);
app.use('/api/lichtrinh', lichtrinh_routes_1.default);
app.use('/api/kienthuc', kienthuc_routes_1.default);
app.use('/api/thongbao', thongbaosukien_routes_1.default);
// Route test
app.get('/', (req, res) => {
    res.send('🚀 API Travel đang chạy!');
});
// Lấy IP LAN của máy tính
const networkInterfaces = os_1.default.networkInterfaces();
let localIP = 'localhost';
for (const iface of Object.values(networkInterfaces)) {
    for (const config of iface || []) {
        if (config.family === 'IPv4' && !config.internal) {
            localIP = config.address;
        }
    }
}
// Gọi hàm createEventNotifications ngay khi server khởi động
mongoose_1.default.connection.once('open', () => {
    (0, notificationScheduler_1.createEventNotifications)(); // Gọi hàm tạo thông báo khi khởi động server
});
app.listen(Number(port), host, () => {
    console.log(`🚀 Server đang chạy tại http://${localIP}:${port}`);
});

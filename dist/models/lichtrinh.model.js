"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LichTrinh = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const hoatDongSchema = new mongoose_1.default.Schema({
    thoiGian: {
        type: String, // ví dụ: "08:00"
        required: true,
    },
    noiDung: {
        type: String, // ví dụ: "Đến nhà nghỉ"
        required: true,
    },
    diaDiem: {
        type: String, // ví dụ: "Nhà nghỉ Hà Tĩnh"
    },
    ghiChu: String,
});
const lichTrinhSchema = new mongoose_1.default.Schema({
    tenLichTrinh: {
        type: String,
        required: true,
    },
    ngay: {
        type: Date, // ví dụ: ngày áp dụng lịch trình
        required: true,
    },
    suKien: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'SuKien',
    },
    diTich: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'DiTich',
    },
    hoatDongs: [hoatDongSchema], // danh sách hoạt động theo giờ
});
exports.LichTrinh = mongoose_1.default.model('LichTrinh', lichTrinhSchema);

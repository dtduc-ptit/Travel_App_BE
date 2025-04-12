"use strict";
// src/schemas/bai-viet.schema.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaiVietSchema = void 0;
const mongoose_1 = require("mongoose");
exports.BaiVietSchema = new mongoose_1.Schema({
    // Tham chiếu người dùng viết bài
    nguoiDung: {
        type: mongoose_1.Types.ObjectId,
        ref: 'NguoiDung',
        required: true,
    },
    // Đường dẫn hình ảnh đại diện của bài viết
    hinhAnh: {
        type: String,
        required: true,
    },
    noiDung: {
        type: String,
        required: true,
    },
    // Thời gian đăng bài
    thoiGian: {
        type: Date,
        default: Date.now,
    },
    // Danh sách lượt thích liên kết
    luotThich: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: 'LuotThich',
        },
    ],
    // Danh sách bình luận liên kết
    luotBinhLuan: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: 'LuotBinhLuan',
        },
    ],
}, {
    timestamps: true, // tự động tạo createdAt & updatedAt
});

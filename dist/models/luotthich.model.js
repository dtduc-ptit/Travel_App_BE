"use strict";
// src/schemas/luot-thich.schema.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuotThichSchema = void 0;
const mongoose_1 = require("mongoose");
exports.LuotThichSchema = new mongoose_1.Schema({
    // Người dùng thực hiện hành động "thích"
    nguoiDung: {
        type: mongoose_1.Types.ObjectId,
        ref: 'NguoiDung',
        required: true,
    },
    // Bài viết được thích
    baiViet: {
        type: mongoose_1.Types.ObjectId,
        ref: 'BaiViet',
        required: true,
    },
    // Thời điểm thích
    thoiGian: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // thêm createdAt, updatedAt
});
exports.LuotThichSchema.index({ nguoiDung: 1, baiViet: 1 }, { unique: true });

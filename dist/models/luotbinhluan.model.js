"use strict";
// src/schemas/luot-binh-luan.schema.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuotBinhLuanSchema = void 0;
const mongoose_1 = require("mongoose");
exports.LuotBinhLuanSchema = new mongoose_1.Schema({
    // Người viết bình luận
    nguoiDung: {
        type: mongoose_1.Types.ObjectId,
        ref: 'NguoiDung',
        required: true,
    },
    // Bài viết được bình luận
    baiViet: {
        type: mongoose_1.Types.ObjectId,
        ref: 'BaiViet',
        required: true,
    },
    // Nội dung của bình luận
    noiDung: {
        type: String,
        required: true,
        trim: true,
    },
    //Trường mới: Bình luận này là phản hồi cho bình luận nào?
    phanHoiCho: {
        type: mongoose_1.Types.ObjectId,
        ref: 'LuotBinhLuan',
        default: null, // Nếu null tức là bình luận gốc
    },
    // Thời gian bình luận
    thoiGian: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Tự động tạo createdAt và updatedAt
});
exports.LuotBinhLuanSchema.index({ baiViet: 1 });
exports.LuotBinhLuanSchema.index({ nguoiDung: 1 });

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaiViet = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_2 = require("mongoose");
const BaiVietSchema = new mongoose_1.Schema({
    // Tham chiếu người dùng viết bài
    nguoiDung: {
        type: mongoose_2.Types.ObjectId,
        ref: 'NguoiDung',
        required: [true, 'Người dùng là bắt buộc'],
    },
    // Đường dẫn hình ảnh đại diện của bài viết
    hinhAnh: {
        type: String,
        required: [true, 'Hình ảnh là bắt buộc'],
        trim: true,
        validate: {
            validator: function (v) {
                return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/.test(v);
            },
            message: 'URL hình ảnh không hợp lệ',
        },
    },
    noiDung: {
        type: String,
        required: [true, 'Nội dung không được để trống'],
        trim: true,
        minlength: [10, 'Nội dung phải có ít nhất 10 ký tự'],
        maxlength: [5000, 'Nội dung không được vượt quá 5000 ký tự'],
    },
    // Thời gian đăng bài
    thoiGian: {
        type: Date,
        default: Date.now,
    },
    // Danh sách lượt thích liên kết
    luotThich: [
        {
            type: mongoose_2.Types.ObjectId,
            ref: 'LuotThich',
        },
    ],
    // Danh sách bình luận liên kết
    luotBinhLuan: [
        {
            type: mongoose_2.Types.ObjectId,
            ref: 'LuotBinhLuan',
        },
    ],
}, {
    timestamps: true, // tự động tạo createdAt & updatedAt
});
exports.BaiViet = mongoose_1.default.model('BaiViet', BaiVietSchema);

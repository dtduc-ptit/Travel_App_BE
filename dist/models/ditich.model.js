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
exports.DTTich = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const danhGiaNguoiDungSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    diem: { type: Number, required: true, min: 1, max: 5 },
}, { _id: false });
const diTichSchema = new mongoose_1.Schema({
    ten: {
        type: String,
        required: [true, 'Tên di tích là bắt buộc'],
        trim: true,
        minlength: [2, 'Tên phải có ít nhất 2 ký tự'],
        maxlength: [100, 'Tên không được vượt quá 100 ký tự'],
    },
    moTa: {
        type: String,
        trim: true,
        maxlength: [1000, 'Mô tả không được vượt quá 1000 ký tự'],
    },
    viTri: {
        type: String,
        trim: true,
        maxlength: [500, 'Vị trí không được vượt quá 500 ký tự'],
    },
    danhGia: {
        type: Number,
        default: 0,
        min: [0, 'Đánh giá không thể nhỏ hơn 0'],
        max: [5, 'Đánh giá không thể lớn hơn 5'],
    },
    thoiGianCapNhat: {
        type: Date,
        default: Date.now,
    },
    soNguoiDanhGia: {
        type: Number,
        default: 0
    },
    luotXem: {
        type: Number,
        default: 0,
        min: [0, 'Lượt xem không thể âm'],
    },
    huongDan: {
        type: String,
        trim: true,
    },
    noiDungLuuTruId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'NoiDungLuuTru',
    },
    media: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Media',
        },
    ],
    danhGiaNguoiDung: [danhGiaNguoiDungSchema],
}, {
    timestamps: true,
});
exports.DTTich = mongoose_1.default.model('DTTich', diTichSchema);

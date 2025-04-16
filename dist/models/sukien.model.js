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
exports.SuKien = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const danhGiaNguoiDungSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    diem: { type: Number, required: true, min: 1, max: 5 },
}, { _id: false });
const suKienSchema = new mongoose_1.default.Schema({
    ten: {
        type: String,
        required: [true, 'Tên sự kiện là bắt buộc'],
        trim: true,
        minlength: [2, 'Tên phải có ít nhất 2 ký tự'],
    },
    moTa: {
        type: String,
        trim: true,
    },
    thoiGianBatDau: {
        type: String,
        required: [true, 'Thời gian bắt đầu là bắt buộc'],
        match: [/^([0-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, 'Thời gian không hợp lệ (dd/mm/yyyy)'],
    },
    thoiGianKetThuc: {
        type: String,
        match: [/^([0-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, 'Thời gian không hợp lệ (dd/mm/yyyy)'],
    },
    thoiGianCapNhat: {
        type: String,
    },
    diaDiem: {
        type: String,
        trim: true,
    },
    danhGia: {
        type: Number,
        default: 0,
        min: [0, 'Đánh giá không được âm'],
        max: [5, 'Đánh giá tối đa là 5'],
    },
    soNguoiDanhGia: {
        type: Number,
        default: 0,
    },
    danhGiaNguoiDung: [danhGiaNguoiDungSchema],
    luotXem: {
        type: Number,
        default: 0,
        min: [0, 'Lượt xem không được âm'],
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
        }
    ]
}, {
    timestamps: true
});
exports.SuKien = mongoose_1.default.model('SuKien', suKienSchema);

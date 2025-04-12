"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoiDungLuuTru = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const noiDungLuuTruSchema = new mongoose_1.default.Schema({
    nguoiDung: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'NguoiDung',
        required: true,
    },
    loaiNoiDung: {
        type: String,
        enum: ['SuKien', 'DiTich', 'PhongTuc'],
        required: true,
    },
    idNoiDung: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    thoiGianLuu: {
        type: Date,
        default: Date.now,
    },
});
exports.NoiDungLuuTru = mongoose_1.default.model('NoiDungLuuTru', noiDungLuuTruSchema);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuKien = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const suKienSchema = new mongoose_1.default.Schema({
    ten: { type: String, required: true },
    moTa: { type: String },
    thoiGianBatDau: { type: String, required: true }, // time (hh:mm:ss)
    thoiGianKetThuc: { type: String },
    thoiGianCapNhat: { type: String },
    diaDiem: { type: String },
    danhGia: { type: Number, default: 0 },
    luotXem: { type: Number, default: 0 },
    huongDan: { type: String },
    // Liên kết tới nội dung chi tiết
    noiDungLuuTruId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'NoiDungLuuTru',
    },
    // Danh sách media
    media: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Media',
        }
    ]
});
exports.SuKien = mongoose_1.default.model('SuKien', suKienSchema);

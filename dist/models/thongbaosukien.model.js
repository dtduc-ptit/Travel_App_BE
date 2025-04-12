"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThongBaoSuKien = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const thongBaoSuKienSchema = new mongoose_1.default.Schema({
    nguoiDung: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'NguoiDung',
        required: true
    },
    suKien: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'SuKien',
        required: true
    },
    tieuDe: {
        type: String,
        required: true,
        default: 'Thông báo sự kiện sắp diễn ra'
    },
    noiDung: {
        type: String,
        required: true
    },
    thoiGianGui: {
        type: Date,
        default: Date.now
    },
    daDoc: {
        type: Boolean,
        default: false
    }
});
exports.ThongBaoSuKien = mongoose_1.default.model('ThongBaoSuKien', thongBaoSuKienSchema);

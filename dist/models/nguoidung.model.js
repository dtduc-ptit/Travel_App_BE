"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NguoiDung = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const nguoiDungSchema = new mongoose_1.default.Schema({
    ten: {
        type: String,
        required: true,
    },
    taiKhoan: {
        type: String,
        required: true,
        unique: true,
    },
    matKhau: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    anhDaiDien: String,
    moTa: String,
    ngayTao: {
        type: Date,
        default: Date.now,
    },
    yeuThich: {
        type: Number,
        default: 0,
    },
    // Một người dùng có thể viết nhiều bài viết
    baiViets: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'BaiViet',
        }],
    // Lượt thích mà người dùng đã thực hiện
    luotThichs: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'LuotThich',
        }],
    // Bình luận mà người dùng đã đăng
    binhLuans: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'LuotBinhLuan',
        }],
    // Nội dung lưu trữ của người dùng
    noiDungLuuTrus: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'NoiDungLuuTru',
        }],
    // Thông báo gửi tới người dùng
    thongBaos: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'ThongBao',
        }],
    // Lịch sử tìm kiếm
    lichSuTimKiems: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'LichSuTimKiem',
        }],
});
exports.NguoiDung = mongoose_1.default.model('NguoiDung', nguoiDungSchema);

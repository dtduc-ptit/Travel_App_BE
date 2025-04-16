"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNguoiDungInfo = exports.loginNguoiDung = exports.registerNguoiDung = exports.getAllNguoiDung = exports.createNguoiDung = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nguoidung_model_1 = require("../models/nguoidung.model"); // Giả sử model dùng .ts
// Tạo người dùng mới
const createNguoiDung = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = new nguoidung_model_1.NguoiDung(req.body);
        const savedUser = yield user.save();
        res.status(201).json({ message: 'Tạo thành công', user: savedUser });
    }
    catch (err) {
        res.status(400).json({ message: 'Tạo thất bại', error: err.message });
    }
});
exports.createNguoiDung = createNguoiDung;
// Lấy danh sách người dùng
const getAllNguoiDung = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield nguoidung_model_1.NguoiDung.find();
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
});
exports.getAllNguoiDung = getAllNguoiDung;
// Đăng ký
const registerNguoiDung = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ten, taiKhoan, matKhau, email } = req.body;
    try {
        // Kiểm tra tài khoản đã tồn tại
        const existsAccount = yield nguoidung_model_1.NguoiDung.findOne({ taiKhoan });
        if (existsAccount) {
            res.status(400).json({ message: 'Tài khoản đã tồn tại' });
            return;
        }
        // Kiểm tra email đã tồn tại
        const existsEmail = yield nguoidung_model_1.NguoiDung.findOne({ email });
        if (existsEmail) {
            res.status(400).json({ message: 'Email đã được sử dụng' });
            return;
        }
        // Tạo người dùng mới
        const newUser = new nguoidung_model_1.NguoiDung({ ten, taiKhoan, matKhau, email });
        yield newUser.save();
        // Phản hồi thành công
        res.status(201).json({
            message: 'Đăng ký thành công',
            user: {
                _id: newUser._id,
                ten: newUser.ten,
                taiKhoan: newUser.taiKhoan,
                email: newUser.email,
                ngayTao: newUser.ngayTao,
            },
        });
    }
    catch (err) {
        console.error('❌ Lỗi đăng ký:', err);
        if (err.name === 'ValidationError') {
            const errors = {};
            for (const field in err.errors) {
                errors[field] = err.errors[field].message;
            }
            res.status(400).json({
                message: 'Lỗi xác thực dữ liệu',
                errors,
            });
        }
        else {
            res.status(500).json({ message: 'Lỗi server', error: err.message });
        }
    }
});
exports.registerNguoiDung = registerNguoiDung;
// Đăng nhập
const loginNguoiDung = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taiKhoan, matKhau } = req.body;
        const nguoiDung = yield nguoidung_model_1.NguoiDung.findOne({ taiKhoan });
        if (!nguoiDung) {
            res.status(400).json({ message: 'Tài khoản không tồn tại' });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(matKhau, nguoiDung.matKhau);
        if (!isMatch) {
            res.status(400).json({ message: 'Mật khẩu không đúng' });
            return;
        }
        res.status(200).json({
            message: 'Đăng nhập thành công',
            idNguoiDung: nguoiDung._id, // 👈 Gửi luôn ID người dùng
            nguoiDung,
        });
    }
    catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});
exports.loginNguoiDung = loginNguoiDung;
// Lấy thông tin chi tiết người dùng theo ID
const getNguoiDungInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const nguoiDung = yield nguoidung_model_1.NguoiDung.findById(id);
        if (!nguoiDung) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }
        res.json(nguoiDung);
    }
    catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
});
exports.getNguoiDungInfo = getNguoiDungInfo;

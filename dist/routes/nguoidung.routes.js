"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const nguoidung_controller_1 = require("../controllers/nguoidung.controller");
router.post('/', nguoidung_controller_1.createNguoiDung); // ✅ Dùng Postman để đẩy user đầy đủ
router.get('/', nguoidung_controller_1.getAllNguoiDung); // ✅ Lấy danh sách
router.post('/register', nguoidung_controller_1.registerNguoiDung); // ✅ Đăng ký
router.post('/login', nguoidung_controller_1.loginNguoiDung); // ✅ Đăng nhập
router.get('/:id', nguoidung_controller_1.getNguoiDungInfo); // ✅ Lấy thông tin người dùng theo ID
exports.default = router;

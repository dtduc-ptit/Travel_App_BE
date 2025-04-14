const express = require('express');
const router = express.Router();
import {
    createNguoiDung,
    getAllNguoiDung,
    registerNguoiDung,
    loginNguoiDung,
    getNguoiDungInfo
  } from '../controllers/nguoidung.controller';
  
router.post('/', createNguoiDung);          // ✅ Dùng Postman để đẩy user đầy đủ
router.get('/', getAllNguoiDung);           // ✅ Lấy danh sách
router.post('/register', registerNguoiDung); // ✅ Đăng ký
router.post('/login', loginNguoiDung);       // ✅ Đăng nhập
router.get('/:id', getNguoiDungInfo);       // ✅ Lấy thông tin người dùng theo ID

export default router;

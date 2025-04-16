const express = require('express');
const router = express.Router();
import {
    createNguoiDung,
    getAllNguoiDung,
    registerNguoiDung,
    loginNguoiDung,
    getNguoiDungInfo,
    updateUserProfile,
    verifyPassword
  } from '../controllers/nguoidung.controller';
  
router.post('/', createNguoiDung);          // ✅ Dùng Postman để đẩy user đầy đủ
router.get('/', getAllNguoiDung);           // ✅ Lấy danh sách
router.post('/register', registerNguoiDung); // ✅ Đăng ký
router.post('/login', loginNguoiDung);       // ✅ Đăng nhập
router.get('/:id', getNguoiDungInfo);       // ✅ Lấy thông tin người dùng theo ID
router.patch('/:id', updateUserProfile); // ✅ Cập nhật thông tin người dùng theo ID
router.post('/verify-password', verifyPassword); // ✅ Xác thực mật khẩu người dùng
export default router;

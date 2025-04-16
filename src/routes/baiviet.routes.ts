import express from 'express';
import {
  createBaiViet,
  getDanhSachBaiViet,
  getBaiVietById,
  updateBaiViet,
  tangLuotThichBaiViet,
  tangLuotBinhLuanBaiViet
} from '../controllers/baiviet.controller';

const router = express.Router();

// GET /api/baiviet
router.get('/', getDanhSachBaiViet);

// GET /api/baiviet/:id
router.get('/:id', getBaiVietById);

// POST /api/baiviet
router.post('/', createBaiViet);  // Kết nối với controller tạo bài viết

// PATCH /api/baiviet/:id
router.patch('/:id', updateBaiViet);

// PATCH /api/baiviet/:id/luotthich
router.patch('/:id/luotthich', tangLuotThichBaiViet);

// PATCH /api/baiviet/:id/luotbinhluan
router.patch('/:id/luotbinhluan', tangLuotBinhLuanBaiViet);

export default router;

import express from 'express';
import {
  getAllDiTich,
  getNoiBatDiTich,
  getPhoBienDiTich,
  createDiTich,
  updateDiTich,
  getDiTichXemNhieu
} from '../controllers/ditich.controller';

const router = express.Router();

// Lấy toàn bộ di tích
router.get('/', getAllDiTich);

// Lấy di tích nổi bật
router.get('/noibat', getNoiBatDiTich);

// Lấy di tích phổ biến
router.get('/phobien', getPhoBienDiTich);

// Thêm di tích mới
router.post('/', createDiTich);

// Cập nhật thông tin di tích
router.patch('/:id', updateDiTich);
router.get("/xemnhieu", getDiTichXemNhieu);
export default router;

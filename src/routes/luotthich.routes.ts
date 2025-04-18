import express from 'express';
import { addLike, removeLike } from '../controllers/luothich.controller';  // Import controller đã tạo

const router = express.Router();

// API xử lý tạo lượt thích
router.post('/like', addLike);

// API xử lý xóa lượt thích
router.delete('/like', removeLike);

export default router;

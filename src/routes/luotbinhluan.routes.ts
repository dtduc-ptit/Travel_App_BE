import express from 'express';
import { createBinhLuan, getBinhLuanByBaiViet } from '../controllers/luotbinhluan.controller';

const router = express.Router();

router.post('/', createBinhLuan);
router.get('/:baiVietId', getBinhLuanByBaiViet);

export default router;

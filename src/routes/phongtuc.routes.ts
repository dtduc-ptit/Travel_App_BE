import express from 'express';
import {
  getAllPhongTuc,
  getNoiBatPhongTuc,
  getPhoBienPhongTuc,
  createPhongTuc,
  updatePhongTuc,
  getPhongTucXemNhieu,
  getPhongTucById,
  tangLuotXemPhongTuc,
} from '../controllers/phongtuc.controller';

const router = express.Router();

router.get('/', getAllPhongTuc);
router.get('/noibat', getNoiBatPhongTuc);
router.get('/phobien', getPhoBienPhongTuc);
router.post('/', createPhongTuc);
router.patch('/:id', updatePhongTuc);
router.get("/xemnhieu", getPhongTucXemNhieu);
router.get('/:id', getPhongTucById);
// PATCH tăng lượt xem
router.patch('/:id/luotxem', tangLuotXemPhongTuc);

export default router;

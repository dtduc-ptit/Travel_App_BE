import express from 'express';
import {
getDanhSachKienThucTheoLoai,
  getNoiBatKienThuc,
  getDocDaoKienThuc,
  getMoiCapNhatKienThuc,
  getPhoBienKienThuc,
  createKienThuc,
  updateKienThuc,
  getKienThucXemNhieu,
  getKienThucById,
  tangLuotXemKienThuc
} from '../controllers/kienthuc.controller';

const router = express.Router();

router.get('/', getDanhSachKienThucTheoLoai);
router.get('/noibat', getNoiBatKienThuc);
router.get('/phobien', getPhoBienKienThuc);
router.get('/xemnhieu', getKienThucXemNhieu);
router.get('/docdao', getDocDaoKienThuc);
router.get('/moicapnhat', getMoiCapNhatKienThuc);
router.get('/:id', getKienThucById);
router.post('/', createKienThuc);
router.patch('/:id', updateKienThuc);
router.patch('/:id/luotxem', tangLuotXemKienThuc);

export default router;

import express from 'express';
import {
  getAllDiTich,
  getNoiBatDiTich,
  getPhoBienDiTich,
  createDiTich,
  updateDiTich,
  getDiTichXemNhieu,
  getDiTichById,
  tangLuotXemDiTich,
  searchDiTichByTen,
  danhGiaDiTich ,
  layDanhGiaDiTich,
} from '../controllers/ditich.controller';

const router = express.Router();
router.get('/', getAllDiTich);
router.get('/noibat', getNoiBatDiTich);
router.get('/phobien', getPhoBienDiTich);
router.post('/', createDiTich);
router.patch('/:id', updateDiTich);
router.get("/xemnhieu", getDiTichXemNhieu);
router.get('/:id', getDiTichById);
router.get('/search', searchDiTichByTen);
router.patch('/:id/danhgia', danhGiaDiTich);
router.get('/:id/danhgia', layDanhGiaDiTich);
router.patch('/:id/luotxem', tangLuotXemDiTich);
export default router;



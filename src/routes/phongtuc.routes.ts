import express from 'express';
import {
  getAllPhongTuc,
  getNoiBatPhongTuc,
  getPhoBienPhongTuc,
  createPhongTuc,
  updatePhongTuc,
  getPhongTucXemNhieu,
} from '../controllers/phongtuc.controller';

const router = express.Router();

router.get('/', getAllPhongTuc);
router.get('/noibat', getNoiBatPhongTuc);
router.get('/phobien', getPhoBienPhongTuc);
router.post('/', createPhongTuc);
router.patch('/:id', updatePhongTuc);
router.get("/xemnhieu", getPhongTucXemNhieu);

export default router;

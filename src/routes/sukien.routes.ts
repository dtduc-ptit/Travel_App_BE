import express from 'express';
import {
  getAllSuKien,
  getNoiBatSuKien,
  getPhoBienSuKien,
  createSuKien,
  updateSuKien,
  getSuKienXemNhieu,
  getSuKienById,
  tangLuotXemSuKien,
  searchSuKienByTen,
} from '../controllers/sukien.controller';

const router = express.Router();

router.get('/', getAllSuKien);
router.get('/noibat', getNoiBatSuKien);
router.get('/phobien', getPhoBienSuKien);
router.get('/xemnhieu', getSuKienXemNhieu);
router.get('/:id', getSuKienById);
router.post('/', createSuKien);
router.patch('/:id', updateSuKien);
router.patch('/:id/luotxem', tangLuotXemSuKien);
router.get('/search', searchSuKienByTen)
export default router;

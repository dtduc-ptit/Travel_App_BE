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
  getSuKienSapDienRa,
  getAllSuKienSorted,
  danhGiaSuKien,
  layDanhGiaSuKien,
} from '../controllers/sukien.controller';

const router = express.Router();

router.get('/', getAllSuKien);
router.get('/noibat', getNoiBatSuKien);
router.get('/phobien', getPhoBienSuKien);
router.get('/xemnhieu', getSuKienXemNhieu);
router.get("/sapdienra", getSuKienSapDienRa);
router.get('/sapxepsukien', getAllSuKienSorted);
router.get('/:id', getSuKienById);
router.post('/', createSuKien);
router.patch('/:id/danhgia', danhGiaSuKien);
router.get('/:id/danhgia', layDanhGiaSuKien);
router.patch('/:id', updateSuKien);
router.patch('/:id/luotxem', tangLuotXemSuKien);
router.get('/search', searchSuKienByTen)


export default router;

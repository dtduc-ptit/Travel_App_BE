import express from 'express';
import { 
    createLichTrinh,
    updateLichTrinh, 
    getAllLichTrinh, 
    getLichTrinhById ,
    getLichTrinhBySuKienId,
    getLichTrinhByDiTichId
} from '../controllers/lichtrinh.controller';

const router = express.Router();

router.post('/', createLichTrinh);
router.patch('/:id', updateLichTrinh); // Cập nhật lịch trình theo ID
router.get('/', getAllLichTrinh);
router.get('/:id',getLichTrinhById); 
router.get('/sukien/:suKienId', getLichTrinhBySuKienId); // ✅ theo sự kiện
router.get('/ditich/:diTichId', getLichTrinhByDiTichId); // ✅ theo di tích

export default router;

import { 
    createNoiDungLuuTru, 
    checkNoiDungLuuTru , 
    getDiaDiemDaLuu,
    deleteNoiDungLuuTru
} from '../controllers/noidungluutru.controller';
const express = require('express');
const router = express.Router();

router.post('/', createNoiDungLuuTru);
router.delete('/', deleteNoiDungLuuTru);
router.get('/kiemtra', checkNoiDungLuuTru);
router.get('/diadiem', getDiaDiemDaLuu);

export default router;



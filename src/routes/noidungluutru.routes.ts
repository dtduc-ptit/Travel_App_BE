import { 
    createNoiDungLuuTru, 
    checkNoiDungLuuTru , 
    getDiaDiemDaLuu,
    deleteNoiDungLuuTru,
    getPhongTucDaLuu
} from '../controllers/noidungluutru.controller';
const express = require('express');
const router = express.Router();

router.post('/', createNoiDungLuuTru);
router.delete('/', deleteNoiDungLuuTru);
router.get('/kiemtra', checkNoiDungLuuTru);
router.get('/diadiem', getDiaDiemDaLuu);
router.get('/phongtuc', getPhongTucDaLuu);

export default router;



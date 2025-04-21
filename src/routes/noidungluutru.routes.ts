import { 
    createNoiDungLuuTru, 
    checkNoiDungLuuTru , 
    getDiTichDaLuu,
    deleteNoiDungLuuTru,
    getPhongTucDaLuu,
    getSuKienDaLuu,
    getNoiDungDaLuu
} from '../controllers/noidungluutru.controller';
const express = require('express');
const router = express.Router();

router.post('/', createNoiDungLuuTru);
router.delete('/', deleteNoiDungLuuTru);
router.get('/kiemtra', checkNoiDungLuuTru);
router.get('/ditich', getDiTichDaLuu);
router.get('/phongtuc', getPhongTucDaLuu);
router.get('/sukien', getSuKienDaLuu);
router.get('/', getNoiDungDaLuu);


export default router;



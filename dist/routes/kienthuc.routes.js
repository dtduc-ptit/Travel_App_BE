"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const kienthuc_controller_1 = require("../controllers/kienthuc.controller");
const router = express_1.default.Router();
router.get('/', kienthuc_controller_1.getDanhSachKienThucTheoLoai);
router.get('/noibat', kienthuc_controller_1.getNoiBatKienThuc);
router.get('/phobien', kienthuc_controller_1.getPhoBienKienThuc);
router.get('/xemnhieu', kienthuc_controller_1.getKienThucXemNhieu);
router.get('/:id', kienthuc_controller_1.getKienThucById);
router.post('/', kienthuc_controller_1.createKienThuc);
router.patch('/:id', kienthuc_controller_1.updateKienThuc);
router.patch('/:id/luotxem', kienthuc_controller_1.tangLuotXemKienThuc);
exports.default = router;

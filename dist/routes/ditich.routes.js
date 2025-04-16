"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ditich_controller_1 = require("../controllers/ditich.controller");
const router = express_1.default.Router();
// Lấy toàn bộ di tích
router.get('/', ditich_controller_1.getAllDiTich);
// Lấy di tích nổi bật
router.get('/noibat', ditich_controller_1.getNoiBatDiTich);
// Lấy di tích phổ biến
router.get('/phobien', ditich_controller_1.getPhoBienDiTich);
// Thêm di tích mới
router.post('/', ditich_controller_1.createDiTich);
// Cập nhật thông tin di tích
router.patch('/:id', ditich_controller_1.updateDiTich);
router.get("/xemnhieu", ditich_controller_1.getDiTichXemNhieu);
router.get('/:id', ditich_controller_1.getDiTichById);
router.get('/search', ditich_controller_1.searchDiTichByTen);
router.patch('/:id/danhgia', ditich_controller_1.danhGiaDiTich);
router.patch('/:id/luotxem', ditich_controller_1.tangLuotXemDiTich);
exports.default = router;

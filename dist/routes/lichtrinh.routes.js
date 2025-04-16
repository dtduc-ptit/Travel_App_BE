"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lichtrinh_controller_1 = require("../controllers/lichtrinh.controller");
const router = express_1.default.Router();
router.post('/', lichtrinh_controller_1.createLichTrinh);
router.patch('/:id', lichtrinh_controller_1.updateLichTrinh); // Cập nhật lịch trình theo ID
router.get('/', lichtrinh_controller_1.getAllLichTrinh);
router.get('/:id', lichtrinh_controller_1.getLichTrinhById);
router.get('/sukien/:suKienId', lichtrinh_controller_1.getLichTrinhBySuKienId); // ✅ theo sự kiện
router.get('/ditich/:diTichId', lichtrinh_controller_1.getLichTrinhByDiTichId); // ✅ theo di tích
exports.default = router;

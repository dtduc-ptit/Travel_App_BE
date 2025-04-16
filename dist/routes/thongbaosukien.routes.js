"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const thongbaosukien_controller_1 = require("../controllers/thongbaosukien.controller");
const router = express_1.default.Router();
// Quan trọng: Route cụ thể phải đặt TRƯỚC route có params động
router.get('/chuadoc/:userId', thongbaosukien_controller_1.getSoLuongThongBaoChuaDoc);
router.patch('/:idThongBao/doc', thongbaosukien_controller_1.danhDauThongBaoDaDoc);
router.get('/:userId', thongbaosukien_controller_1.layThongBaoTheoNguoiDung); // <-- Đặt sau cùng
exports.default = router;

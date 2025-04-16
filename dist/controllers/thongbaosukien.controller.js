"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.danhDauThongBaoDaDoc = exports.getSoLuongThongBaoChuaDoc = exports.layThongBaoTheoNguoiDung = void 0;
const thongbaosukien_model_1 = require("../models/thongbaosukien.model");
const layThongBaoTheoNguoiDung = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const thongBaos = yield thongbaosukien_model_1.ThongBaoSuKien.find({ nguoiDung: userId })
            .populate('suKien', 'ten ngayBatDau') // nếu muốn lấy tên sự kiện
            .sort({ thoiGianGui: -1 });
        res.status(200).json(thongBaos);
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
});
exports.layThongBaoTheoNguoiDung = layThongBaoTheoNguoiDung;
const getSoLuongThongBaoChuaDoc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId; // hoặc req.user._id nếu có auth
        const soLuongChuaDoc = yield thongbaosukien_model_1.ThongBaoSuKien.countDocuments({
            nguoiDung: userId,
            daDoc: false
        });
        res.json({ soLuongChuaDoc });
    }
    catch (err) {
        console.error('Lỗi khi lấy thông báo chưa đọc:', err);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
exports.getSoLuongThongBaoChuaDoc = getSoLuongThongBaoChuaDoc;
const danhDauThongBaoDaDoc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idThongBao } = req.params;
        const thongBao = yield thongbaosukien_model_1.ThongBaoSuKien.findByIdAndUpdate(idThongBao, { daDoc: true }, { new: true });
        if (!thongBao) {
            return res.status(404).json({ message: 'Không tìm thấy thông báo' });
        }
        return res.status(200).json({ message: 'Đã đánh dấu thông báo là đã đọc', thongBao });
    }
    catch (error) {
        console.error('Lỗi khi đánh dấu thông báo đã đọc:', error);
        return res.status(500).json({ message: 'Lỗi server' });
    }
});
exports.danhDauThongBaoDaDoc = danhDauThongBaoDaDoc;

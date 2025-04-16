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
exports.updateKienThuc = exports.createKienThuc = exports.tangLuotXemKienThuc = exports.getKienThucById = exports.getKienThucXemNhieu = exports.getPhoBienKienThuc = exports.getNoiBatKienThuc = exports.getDanhSachKienThucTheoLoai = void 0;
const kienthuc_model_1 = require("../models/kienthuc.model");
// GET /api/kienthuc
// Thay thế getAllKienThuc
const getDanhSachKienThucTheoLoai = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [noibat, xemnhieu, docdao, moicapnhat] = yield Promise.all([
            kienthuc_model_1.KienThuc.find({ daDuyet: true }).sort({ createdAt: -1 }).limit(10),
            kienthuc_model_1.KienThuc.find({ daDuyet: true }).sort({ soLuotXem: -1 }).limit(10),
            kienthuc_model_1.KienThuc.find({ daDuyet: true, the: { $in: ["độc đáo", "docdao"] } }).sort({ createdAt: -1 }).limit(10),
            kienthuc_model_1.KienThuc.find({ daDuyet: true }).sort({ createdAt: -1 }).limit(10),
        ]);
        res.json({ noibat, xemnhieu, docdao, moicapnhat });
    }
    catch (err) {
        console.error("❌ Lỗi khi lấy danh sách kiến thức:", err);
        res.status(500).json({ error: "Lỗi khi lấy danh sách kiến thức" });
    }
});
exports.getDanhSachKienThucTheoLoai = getDanhSachKienThucTheoLoai;
// GET /api/kienthuc/noibat?the=vanhoa
const getNoiBatKienThuc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { the } = req.query;
        const filter = { daDuyet: true };
        if (the)
            filter.the = { $in: [the] };
        const kienThucList = yield kienthuc_model_1.KienThuc.find(filter).sort({ createdAt: -1 }).limit(10);
        res.json(kienThucList);
    }
    catch (err) {
        console.error('❌ Lỗi khi lấy kiến thức nổi bật:', err);
        res.status(500).json({ error: 'Lỗi khi lấy kiến thức nổi bật' });
    }
});
exports.getNoiBatKienThuc = getNoiBatKienThuc;
// GET /api/kienthuc/phobien
const getPhoBienKienThuc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const kienThucList = yield kienthuc_model_1.KienThuc.find({ daDuyet: true })
            .sort({ createdAt: -1 }) // Mới đăng
            .limit(10);
        res.json(kienThucList);
    }
    catch (err) {
        console.error('❌ Lỗi khi lấy kiến thức phổ biến:', err);
        res.status(500).json({ error: 'Lỗi khi lấy kiến thức phổ biến' });
    }
});
exports.getPhoBienKienThuc = getPhoBienKienThuc;
// GET /api/kienthuc/xemnhieu
const getKienThucXemNhieu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const kienThucList = yield kienthuc_model_1.KienThuc.find()
            .sort({ soLuotXem: -1 }) // Sắp xếp giảm dần theo số lượt xem
            .limit(10); // Giới hạn 10 bài viết
        res.json(kienThucList);
    }
    catch (err) {
        console.error('❌ Lỗi khi lấy kiến thức xem nhiều:', err);
        res.status(500).json({ error: 'Lỗi khi lấy kiến thức xem nhiều' });
    }
});
exports.getKienThucXemNhieu = getKienThucXemNhieu;
// GET /api/kienthuc/:id
const getKienThucById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const kienThuc = yield kienthuc_model_1.KienThuc.findById(id).populate('tacGia', 'hoTen email'); // Nếu muốn
        if (!kienThuc) {
            res.status(404).json({ error: 'Không tìm thấy kiến thức' });
            return;
        }
        res.json(kienThuc);
    }
    catch (err) {
        console.error('❌ Lỗi khi lấy chi tiết kiến thức:', err);
        res.status(500).json({ error: 'Lỗi khi lấy chi tiết kiến thức' });
    }
});
exports.getKienThucById = getKienThucById;
// PATCH /api/kienthuc/:id/luotxem
const tangLuotXemKienThuc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const kienThuc = yield kienthuc_model_1.KienThuc.findById(id);
        if (!kienThuc) {
            res.status(404).json({ error: 'Không tìm thấy kiến thức' });
            return;
        }
        kienThuc.soLuotXem = (kienThuc.soLuotXem || 0) + 1;
        yield kienThuc.save();
        res.status(200).json({ success: true, soLuotXem: kienThuc.soLuotXem });
    }
    catch (err) {
        console.error('❌ Lỗi khi tăng lượt xem:', err);
        res.status(500).json({ error: 'Lỗi server khi tăng lượt xem' });
    }
});
exports.tangLuotXemKienThuc = tangLuotXemKienThuc;
// POST /api/kienthuc
const createKienThuc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tieuDe, noiDung, moTaNgan, tacGia, hinhAnh, the, daDuyet } = req.body;
        const kienThuc = new kienthuc_model_1.KienThuc({
            tieuDe,
            noiDung,
            moTaNgan,
            tacGia,
            hinhAnh: hinhAnh || [],
            the: the || [],
            daDuyet: daDuyet || false
        });
        const saved = yield kienThuc.save();
        res.status(201).json(saved);
    }
    catch (err) {
        console.error('❌ Lỗi khi tạo kiến thức:', err);
        res.status(500).json({ error: 'Lỗi khi tạo kiến thức' });
    }
});
exports.createKienThuc = createKienThuc;
// PATCH /api/kienthuc/:id
const updateKienThuc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const kienThuc = yield kienthuc_model_1.KienThuc.findById(id);
        if (!kienThuc) {
            res.status(404).json({ error: 'Kiến thức không tồn tại' });
            return;
        }
        Object.assign(kienThuc, updateData);
        const updated = yield kienThuc.save();
        res.json(updated);
    }
    catch (err) {
        console.error('❌ Lỗi khi cập nhật kiến thức:', err);
        res.status(500).json({ error: 'Lỗi khi cập nhật kiến thức' });
    }
});
exports.updateKienThuc = updateKienThuc;

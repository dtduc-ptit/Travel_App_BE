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
exports.danhGiaDiTich = exports.tangLuotXemDiTich = exports.searchDiTichByTen = exports.getDiTichById = exports.updateDiTich = exports.createDiTich = exports.getDiTichXemNhieu = exports.getPhoBienDiTich = exports.getNoiBatDiTich = exports.getAllDiTich = void 0;
const ditich_model_1 = require("../models/ditich.model");
const media_model_1 = require("../models/media.model");
const getAllDiTich = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ditichs = yield ditich_model_1.DTTich.find();
        res.json(ditichs);
    }
    catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách di tích' });
    }
});
exports.getAllDiTich = getAllDiTich;
const getNoiBatDiTich = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { viTri } = req.query;
        const filter = { danhGia: { $gte: 4.5 } };
        if (viTri) {
            filter.viTri = viTri;
        }
        const diTichList = yield ditich_model_1.DTTich.find(filter);
        const diTichIds = diTichList.map(dt => dt._id);
        const medias = yield media_model_1.Media.find({
            doiTuong: 'DTTich',
            doiTuongId: { $in: diTichIds },
            type: 'image',
        });
        const mediaMap = new Map();
        medias.forEach(media => {
            mediaMap.set(media.doiTuongId.toString(), media.url);
        });
        const result = diTichList.map(dt => (Object.assign(Object.assign({}, dt.toObject()), { imageUrl: mediaMap.get(dt._id.toString()) || null })));
        res.json(result);
    }
    catch (error) {
        console.error("Lỗi khi lấy di tích nổi bật:", error);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách di tích nổi bật' });
    }
});
exports.getNoiBatDiTich = getNoiBatDiTich;
const getPhoBienDiTich = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const diTichs = yield ditich_model_1.DTTich.find({ danhGia: { $lt: 4.5 } });
        const ids = diTichs.map(dt => dt._id.toString());
        const medias = yield media_model_1.Media.find({
            doiTuong: 'DTTich',
            doiTuongId: { $in: ids },
            type: 'image'
        });
        const mediaMap = new Map();
        medias.forEach(m => mediaMap.set(m.doiTuongId, m.url));
        const result = diTichs.map(dt => (Object.assign(Object.assign({}, dt.toObject()), { imageUrl: mediaMap.get(dt._id.toString()) || null })));
        res.json(result);
    }
    catch (err) {
        console.error("Lỗi khi lấy di tích phổ biến:", err);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
exports.getPhoBienDiTich = getPhoBienDiTich;
const getDiTichXemNhieu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const diTichs = yield ditich_model_1.DTTich.find({ luotXem: { $gt: 200 } }).sort({ luotXem: -1 });
        const ids = diTichs.map(dt => dt._id.toString());
        const medias = yield media_model_1.Media.find({
            doiTuong: 'DTTich',
            doiTuongId: { $in: ids },
            type: 'image'
        });
        const mediaMap = new Map();
        medias.forEach(m => mediaMap.set(m.doiTuongId, m.url));
        const result = diTichs.map(dt => (Object.assign(Object.assign({}, dt.toObject()), { imageUrl: mediaMap.get(dt._id.toString()) || null })));
        res.json(result);
    }
    catch (error) {
        console.error("Lỗi khi lấy di tích xem nhiều:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});
exports.getDiTichXemNhieu = getDiTichXemNhieu;
const createDiTich = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ten, moTa, viTri, danhGia, huongDan, soNguoiDanhGia, luotXem, noiDungLuuTru, media } = req.body;
        const diTich = new ditich_model_1.DTTich({
            ten,
            moTa,
            viTri,
            danhGia,
            huongDan,
            soNguoiDanhGia,
            luotXem,
            thoiGianCapNhat: new Date(),
            noiDungLuuTru: noiDungLuuTru || null,
            media: media || []
        });
        const saved = yield diTich.save();
        const savedId = saved._id; // 👈 Dòng này bạn thêm vào đây
        if (Array.isArray(media) && media.length > 0) {
            yield media_model_1.Media.updateMany({ _id: { $in: media } }, {
                $set: {
                    doiTuong: 'DTTich',
                    doiTuongId: saved._id.toString()
                }
            });
        }
        res.status(201).json(saved);
    }
    catch (err) {
        console.error('❌ Lỗi khi tạo DiTich:', err);
        res.status(500).json({ error: 'Lỗi khi tạo di tích' });
    }
});
exports.createDiTich = createDiTich;
const updateDiTich = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { ten, moTa, viTri, danhGia, huongDan, noiDungLuuTru, media } = req.body;
        const diTich = yield ditich_model_1.DTTich.findById(id);
        if (!diTich) {
            res.status(404).json({ error: 'Di tích không tồn tại' });
            return;
        }
        if (ten !== undefined)
            diTich.ten = ten;
        if (moTa !== undefined)
            diTich.moTa = moTa;
        if (viTri !== undefined)
            diTich.viTri = viTri;
        if (danhGia !== undefined)
            diTich.danhGia = danhGia;
        if (huongDan !== undefined)
            diTich.huongDan = huongDan;
        if (media !== undefined)
            diTich.media = media;
        const updated = yield diTich.save();
        if (Array.isArray(media) && media.length > 0) {
            yield media_model_1.Media.updateMany({ _id: { $in: media } }, {
                $set: {
                    doiTuong: 'DTTich',
                    doiTuongId: diTich._id.toString()
                }
            });
        }
        res.json(updated);
    }
    catch (err) {
        console.error('❌ Lỗi khi cập nhật DiTich:', err);
        res.status(500).json({ error: 'Lỗi khi cập nhật di tích' });
    }
});
exports.updateDiTich = updateDiTich;
const getDiTichById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const ditich = yield ditich_model_1.DTTich.findById(id);
        if (!ditich) {
            res.status(404).json({ error: "Không tìm thấy di tích" });
            return;
        }
        const media = yield media_model_1.Media.findOne({
            doiTuong: "DTTich",
            doiTuongId: id,
            type: "image",
        });
        const result = Object.assign(Object.assign({}, ditich.toObject()), { imageUrl: (media === null || media === void 0 ? void 0 : media.url) || null });
        res.json(result);
    }
    catch (error) {
        console.error("Lỗi khi lấy chi tiết di tích:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});
exports.getDiTichById = getDiTichById;
const searchDiTichByTen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            res.status(400).json({ error: 'Thiếu từ khóa tìm kiếm' });
            return;
        }
        // Tìm các di tích có tên chứa chuỗi q (không phân biệt hoa thường)
        const regex = new RegExp(q, 'i');
        const ditichs = yield ditich_model_1.DTTich.find({ ten: regex });
        // Lấy media tương ứng
        const ids = ditichs.map(dt => dt._id.toString());
        const medias = yield media_model_1.Media.find({
            doiTuong: 'DTTich',
            doiTuongId: { $in: ids },
            type: 'image'
        });
        const mediaMap = new Map();
        medias.forEach(m => mediaMap.set(m.doiTuongId, m.url));
        const result = ditichs.map(dt => (Object.assign(Object.assign({}, dt.toObject()), { imageUrl: mediaMap.get(dt._id.toString()) || null })));
        res.json(result);
    }
    catch (error) {
        console.error('❌ Lỗi khi tìm kiếm di tích:', error);
        res.status(500).json({ error: 'Lỗi khi tìm kiếm di tích' });
    }
});
exports.searchDiTichByTen = searchDiTichByTen;
const tangLuotXemDiTich = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const ditich = yield ditich_model_1.DTTich.findById(id);
        if (!ditich) {
            res.status(404).json({ error: 'Không tìm thấy di tích' });
            return;
        }
        ditich.luotXem = (ditich.luotXem || 0) + 1;
        yield ditich.save();
        res.status(200).json({ success: true, luotXem: ditich.luotXem });
    }
    catch (err) {
        console.error('❌ Lỗi khi tăng lượt xem:', err);
        res.status(500).json({ error: 'Lỗi server khi tăng lượt xem' });
    }
});
exports.tangLuotXemDiTich = tangLuotXemDiTich;
const danhGiaDiTich = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const { id } = req.params; // ID di tích
        const { diem, userId } = req.body; // Lấy cả điểm và userId
        console.log('DiTich ID:', id);
        console.log('Điểm đánh giá:', diem);
        console.log('UserId:', userId);
        // Kiểm tra dữ liệu đầu vào
        if (!diem || typeof diem !== 'number' || diem < 1 || diem > 5) {
            res.status(400).json({ message: "Điểm đánh giá phải là số từ 1 đến 5" });
            return;
        }
        // Tìm di tích
        const ditich = yield ditich_model_1.DTTich.findById(id);
        if (!ditich) {
            res.status(404).json({ message: "Không tìm thấy di tích" });
            return;
        }
        // Kiểm tra người dùng đã đánh giá chưa
        const userRating = (_a = ditich.danhGiaNguoiDung) === null || _a === void 0 ? void 0 : _a.find((dg) => dg.userId === userId);
        if (userRating) {
            // Cập nhật lại điểm của người dùng
            userRating.diem = diem;
        }
        else {
            // Nếu chưa có đánh giá của người dùng, thêm mới
            (_b = ditich.danhGiaNguoiDung) === null || _b === void 0 ? void 0 : _b.push({ userId, diem });
        }
        // Tính điểm trung bình mới
        const totalRating = ((_c = ditich.danhGiaNguoiDung) === null || _c === void 0 ? void 0 : _c.reduce((sum, dg) => sum + dg.diem, 0)) || 0;
        const avgRating = totalRating / (((_d = ditich.danhGiaNguoiDung) === null || _d === void 0 ? void 0 : _d.length) || 1);
        ditich.danhGia = avgRating;
        ditich.soNguoiDanhGia = ((_e = ditich.danhGiaNguoiDung) === null || _e === void 0 ? void 0 : _e.length) || 0;
        yield ditich.save();
        res.status(200).json({
            message: "Đánh giá thành công",
            danhGia: parseFloat(avgRating.toFixed(1)),
            soNguoiDanhGia: ditich.soNguoiDanhGia,
        });
    }
    catch (error) {
        const err = error;
        console.error("Lỗi đánh giá:", err.message);
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});
exports.danhGiaDiTich = danhGiaDiTich;

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
exports.danhGiaSuKien = exports.getAllSuKienSorted = exports.getSuKienSapDienRa = exports.searchSuKienByTen = exports.tangLuotXemSuKien = exports.updateSuKien = exports.createSuKien = exports.getSuKienById = exports.getSuKienXemNhieu = exports.getPhoBienSuKien = exports.getNoiBatSuKien = exports.getAllSuKien = void 0;
const sukien_model_1 = require("../models/sukien.model");
const media_model_1 = require("../models/media.model");
const getAllSuKien = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sukien = yield sukien_model_1.SuKien.find();
        res.json(sukien);
    }
    catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách sự kiện' });
    }
});
exports.getAllSuKien = getAllSuKien;
const getNoiBatSuKien = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { diaDiem } = req.query;
        const filter = { danhGia: { $gte: 4 } };
        if (diaDiem)
            filter.diaDiem = diaDiem;
        const suKiens = yield sukien_model_1.SuKien.find(filter);
        const ids = suKiens.map(sk => sk._id);
        const medias = yield media_model_1.Media.find({
            doiTuong: 'SuKien',
            doiTuongId: { $in: ids },
            type: 'image',
        });
        const mediaMap = new Map();
        medias.forEach(media => {
            mediaMap.set(media.doiTuongId.toString(), media.url);
        });
        const result = suKiens.map(sk => (Object.assign(Object.assign({}, sk.toObject()), { imageUrl: mediaMap.get(sk._id.toString()) || null })));
        res.json(result);
    }
    catch (err) {
        console.error("Lỗi khi lấy sự kiện nổi bật:", err);
        res.status(500).json({ error: 'Lỗi khi lấy sự kiện nổi bật' });
    }
});
exports.getNoiBatSuKien = getNoiBatSuKien;
const getPhoBienSuKien = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const suKiens = yield sukien_model_1.SuKien.find({ danhGia: { $lt: 4 } });
        const ids = suKiens.map(sk => sk._id);
        const medias = yield media_model_1.Media.find({
            doiTuong: 'SuKien',
            doiTuongId: { $in: ids },
            type: 'image',
        });
        const mediaMap = new Map();
        medias.forEach(media => {
            mediaMap.set(media.doiTuongId.toString(), media.url);
        });
        const result = suKiens.map(sk => (Object.assign(Object.assign({}, sk.toObject()), { imageUrl: mediaMap.get(sk._id.toString()) || null })));
        res.json(result);
    }
    catch (err) {
        console.error("Lỗi khi lấy sự kiện phổ biến:", err);
        res.status(500).json({ error: 'Lỗi khi lấy sự kiện phổ biến' });
    }
});
exports.getPhoBienSuKien = getPhoBienSuKien;
const getSuKienXemNhieu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const suKiens = yield sukien_model_1.SuKien.find({ luotXem: { $gt: 200 } }).sort({ luotXem: -1 });
        const ids = suKiens.map(sk => sk._id);
        const medias = yield media_model_1.Media.find({
            doiTuong: 'SuKien',
            doiTuongId: { $in: ids },
            type: 'image',
        });
        const mediaMap = new Map();
        medias.forEach(media => {
            mediaMap.set(media.doiTuongId.toString(), media.url);
        });
        const result = suKiens.map(sk => (Object.assign(Object.assign({}, sk.toObject()), { imageUrl: mediaMap.get(sk._id.toString()) || null })));
        res.json(result);
    }
    catch (err) {
        console.error("Lỗi khi lấy sự kiện xem nhiều:", err);
        res.status(500).json({ error: 'Lỗi khi lấy sự kiện xem nhiều' });
    }
});
exports.getSuKienXemNhieu = getSuKienXemNhieu;
const getSuKienById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const suKien = yield sukien_model_1.SuKien.findById(id);
        if (!suKien) {
            res.status(404).json({ error: 'Không tìm thấy sự kiện' });
            return;
        }
        const media = yield media_model_1.Media.findOne({
            doiTuong: 'SuKien',
            doiTuongId: id,
            type: 'image',
        });
        res.json(Object.assign(Object.assign({}, suKien.toObject()), { imageUrl: (media === null || media === void 0 ? void 0 : media.url) || null }));
    }
    catch (err) {
        console.error("Lỗi khi lấy chi tiết sự kiện:", err);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
exports.getSuKienById = getSuKienById;
const createSuKien = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ten, moTa, thoiGianBatDau, thoiGianKetThuc, thoiGianCapNhat, diaDiem, danhGia, luotXem, huongDan, noiDungLuuTruId, media } = req.body;
        const suKien = new sukien_model_1.SuKien({
            ten,
            moTa,
            thoiGianBatDau,
            thoiGianKetThuc,
            thoiGianCapNhat,
            diaDiem,
            danhGia,
            luotXem,
            huongDan,
            noiDungLuuTruId,
            media: media || [],
        });
        const saved = yield suKien.save();
        if (Array.isArray(media) && media.length > 0) {
            yield media_model_1.Media.updateMany({ _id: { $in: media } }, {
                $set: {
                    doiTuong: 'SuKien',
                    doiTuongId: saved._id.toString(),
                },
            });
        }
        res.status(201).json(saved);
    }
    catch (err) {
        console.error('❌ Lỗi khi tạo SuKien:', err);
        res.status(500).json({ error: 'Lỗi khi tạo sự kiện' });
    }
});
exports.createSuKien = createSuKien;
const updateSuKien = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { ten, moTa, thoiGianBatDau, thoiGianKetThuc, thoiGianCapNhat, diaDiem, danhGia, luotXem, huongDan, noiDungLuuTruId, media } = req.body;
        const suKien = yield sukien_model_1.SuKien.findById(id);
        if (!suKien) {
            res.status(404).json({ error: 'Không tìm thấy sự kiện' });
            return;
        }
        if (ten !== undefined)
            suKien.ten = ten;
        if (moTa !== undefined)
            suKien.moTa = moTa;
        if (thoiGianBatDau !== undefined)
            suKien.thoiGianBatDau = thoiGianBatDau;
        if (thoiGianKetThuc !== undefined)
            suKien.thoiGianKetThuc = thoiGianKetThuc;
        if (thoiGianCapNhat !== undefined)
            suKien.thoiGianCapNhat = thoiGianCapNhat;
        if (diaDiem !== undefined)
            suKien.diaDiem = diaDiem;
        if (danhGia !== undefined)
            suKien.danhGia = danhGia;
        if (luotXem !== undefined)
            suKien.luotXem = luotXem;
        if (huongDan !== undefined)
            suKien.huongDan = huongDan;
        if (noiDungLuuTruId !== undefined)
            suKien.noiDungLuuTruId = noiDungLuuTruId;
        if (media !== undefined)
            suKien.media = media;
        const updated = yield suKien.save();
        if (Array.isArray(media) && media.length > 0) {
            yield media_model_1.Media.updateMany({ _id: { $in: media } }, {
                $set: {
                    doiTuong: 'SuKien',
                    doiTuongId: suKien._id.toString(),
                },
            });
        }
        res.json(updated);
    }
    catch (err) {
        console.error('❌ Lỗi khi cập nhật SuKien:', err);
        res.status(500).json({ error: 'Lỗi khi cập nhật sự kiện' });
    }
});
exports.updateSuKien = updateSuKien;
const tangLuotXemSuKien = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const suKien = yield sukien_model_1.SuKien.findById(id);
        if (!suKien) {
            res.status(404).json({ error: 'Không tìm thấy sự kiện' });
            return;
        }
        suKien.luotXem = (suKien.luotXem || 0) + 1;
        yield suKien.save();
        res.status(200).json({ success: true, luotXem: suKien.luotXem });
    }
    catch (err) {
        console.error('❌ Lỗi khi tăng lượt xem:', err);
        res.status(500).json({ error: 'Lỗi server khi tăng lượt xem' });
    }
});
exports.tangLuotXemSuKien = tangLuotXemSuKien;
const searchSuKienByTen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            res.status(400).json({ error: 'Thiếu từ khóa tìm kiếm' });
            return;
        }
        // Tìm các sự kiện có tên chứa chuỗi q (không phân biệt hoa thường)
        const regex = new RegExp(q, 'i');
        const suKiens = yield sukien_model_1.SuKien.find({ ten: regex });
        // Lấy media tương ứng
        const ids = suKiens.map(sk => sk._id.toString());
        const medias = yield media_model_1.Media.find({
            doiTuong: 'SuKien',
            doiTuongId: { $in: ids },
            type: 'image',
        });
        const mediaMap = new Map();
        medias.forEach(m => mediaMap.set(m.doiTuongId, m.url));
        const result = suKiens.map(sk => (Object.assign(Object.assign({}, sk.toObject()), { imageUrl: mediaMap.get(sk._id.toString()) || null })));
        res.json(result);
    }
    catch (error) {
        console.error('❌ Lỗi khi tìm kiếm sự kiện:', error);
        res.status(500).json({ error: 'Lỗi khi tìm kiếm sự kiện' });
    }
});
exports.searchSuKienByTen = searchSuKienByTen;
const getSuKienSapDienRa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        const suKiens = yield sukien_model_1.SuKien.find().sort({ thoiGianBatDau: 1 });
        // Chuyển đổi chuỗi thoiGianBatDau => Date để so sánh
        const upcomingEvents = suKiens.filter(sk => {
            const [day, month, year] = sk.thoiGianBatDau.split('/');
            const eventDate = new Date(`${year}-${month}-${day}`);
            return eventDate >= today;
        });
        const ids = upcomingEvents.map(sk => sk._id);
        const medias = yield media_model_1.Media.find({
            doiTuong: 'SuKien',
            doiTuongId: { $in: ids },
            type: 'image',
        });
        const mediaMap = new Map();
        medias.forEach(media => {
            mediaMap.set(media.doiTuongId.toString(), media.url);
        });
        const result = upcomingEvents.map(sk => (Object.assign(Object.assign({}, sk.toObject()), { imageUrl: mediaMap.get(sk._id.toString()) || null })));
        res.json(result);
    }
    catch (err) {
        console.error("Lỗi khi lấy sự kiện sắp diễn ra:", err);
        res.status(500).json({ error: 'Lỗi khi lấy sự kiện sắp diễn ra' });
    }
});
exports.getSuKienSapDienRa = getSuKienSapDienRa;
const getAllSuKienSorted = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Lấy toàn bộ sự kiện
        const suKiens = yield sukien_model_1.SuKien.find();
        // Sắp xếp theo thời gian: chuyển string → Date để so sánh/sắp xếp
        const sortedSuKiens = suKiens
            .map(sk => {
            const [day, month, year] = sk.thoiGianBatDau.split('/');
            const eventDate = new Date(`${year}-${month}-${day}`);
            return Object.assign(Object.assign({}, sk.toObject()), { eventDate });
        })
            .sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());
        // Lấy danh sách ID
        const ids = sortedSuKiens.map(sk => sk._id);
        // Tìm media image của các sự kiện
        const medias = yield media_model_1.Media.find({
            doiTuong: 'SuKien',
            doiTuongId: { $in: ids },
            type: 'image',
        });
        // Map media vào đúng sự kiện
        const mediaMap = new Map();
        medias.forEach(media => {
            mediaMap.set(media.doiTuongId.toString(), media.url);
        });
        // Gắn imageUrl cho mỗi sự kiện
        const result = sortedSuKiens.map(sk => (Object.assign(Object.assign({}, sk), { imageUrl: mediaMap.get(sk._id.toString()) || null })));
        res.json(result);
    }
    catch (err) {
        console.error("Lỗi khi lấy tất cả sự kiện:", err);
        res.status(500).json({ error: 'Lỗi khi lấy tất cả sự kiện' });
    }
});
exports.getAllSuKienSorted = getAllSuKienSorted;
const danhGiaSuKien = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const { id } = req.params; // ID sự kiện
        const { diem, userId } = req.body; // Lấy điểm và userId từ body
        console.log('SuKien ID:', id);
        console.log('Điểm đánh giá:', diem);
        console.log('UserId:', userId);
        if (!diem || typeof diem !== 'number' || diem < 1 || diem > 5) {
            res.status(400).json({ message: "Điểm đánh giá phải là số từ 1 đến 5" });
            return;
        }
        const sukien = yield sukien_model_1.SuKien.findById(id);
        if (!sukien) {
            res.status(404).json({ message: "Không tìm thấy sự kiện" });
            return;
        }
        const userRating = (_a = sukien.danhGiaNguoiDung) === null || _a === void 0 ? void 0 : _a.find((dg) => dg.userId === userId);
        if (userRating) {
            userRating.diem = diem;
        }
        else {
            (_b = sukien.danhGiaNguoiDung) === null || _b === void 0 ? void 0 : _b.push({ userId, diem });
        }
        const totalRating = ((_c = sukien.danhGiaNguoiDung) === null || _c === void 0 ? void 0 : _c.reduce((sum, dg) => sum + dg.diem, 0)) || 0;
        const avgRating = totalRating / (((_d = sukien.danhGiaNguoiDung) === null || _d === void 0 ? void 0 : _d.length) || 1);
        sukien.danhGia = avgRating;
        sukien.soNguoiDanhGia = ((_e = sukien.danhGiaNguoiDung) === null || _e === void 0 ? void 0 : _e.length) || 0;
        yield sukien.save();
        res.status(200).json({
            message: "Đánh giá sự kiện thành công",
            danhGia: parseFloat(avgRating.toFixed(1)),
            soNguoiDanhGia: sukien.soNguoiDanhGia,
        });
    }
    catch (error) {
        const err = error;
        console.error("Lỗi đánh giá sự kiện:", err.message);
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});
exports.danhGiaSuKien = danhGiaSuKien;

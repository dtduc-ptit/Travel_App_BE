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
exports.danhGiaPhongTuc = exports.tangLuotXemPhongTuc = exports.getPhongTucById = exports.getPhongTucXemNhieu = exports.updatePhongTuc = exports.createPhongTuc = exports.getPhoBienPhongTuc = exports.getNoiBatPhongTuc = exports.getAllPhongTuc = void 0;
const phongtuc_model_1 = require("../models/phongtuc.model");
const media_model_1 = require("../models/media.model"); // Giả sử Media được import từ đâu đó
const getAllPhongTuc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phongtuc = yield phongtuc_model_1.PhongTuc.find();
        res.json(phongtuc);
    }
    catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách phong tục' });
    }
});
exports.getAllPhongTuc = getAllPhongTuc;
const getNoiBatPhongTuc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { diaDiem } = req.query;
        const filter = { danhGia: { $gte: 4 } };
        if (diaDiem) {
            filter.diaDiem = diaDiem;
        }
        const phongTucs = yield phongtuc_model_1.PhongTuc.find(filter);
        const phongTucIds = phongTucs.map(pt => pt._id);
        const medias = yield media_model_1.Media.find({
            doiTuong: 'PhongTuc',
            doiTuongId: { $in: phongTucIds },
            type: 'image',
        });
        const mediaMap = new Map();
        medias.forEach(media => {
            mediaMap.set(media.doiTuongId.toString(), media.url);
        });
        const result = phongTucs.map(pt => (Object.assign(Object.assign({}, pt.toObject()), { imageUrl: mediaMap.get(pt._id.toString()) || null })));
        res.json(result);
    }
    catch (err) {
        console.error("Lỗi khi lấy phong tục nổi bật:", err);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách phong tục nổi bật' });
    }
});
exports.getNoiBatPhongTuc = getNoiBatPhongTuc;
const getPhoBienPhongTuc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phongTucs = yield phongtuc_model_1.PhongTuc.find({ danhGia: { $lt: 4 } });
        const phongTucIds = phongTucs.map(pt => pt._id);
        const medias = yield media_model_1.Media.find({
            doiTuong: 'PhongTuc',
            doiTuongId: { $in: phongTucIds },
            type: 'image',
        });
        const mediaMap = new Map();
        medias.forEach(media => {
            mediaMap.set(media.doiTuongId.toString(), media.url);
        });
        const result = phongTucs.map(pt => (Object.assign(Object.assign({}, pt.toObject()), { imageUrl: mediaMap.get(pt._id.toString()) || null })));
        res.json(result);
    }
    catch (err) {
        console.error("Lỗi khi lấy phong tục phổ biếnbiến:", err);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách phong tục phổ biến' });
    }
});
exports.getPhoBienPhongTuc = getPhoBienPhongTuc;
const createPhongTuc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ten, moTa, yNghia, loai, danhGia, diaDiem, huongDan, luotXem, noiDungLuuTru, media // Array các media ID hoặc null nếu chưa có
         } = req.body;
        // Tạo phong tục mới
        const phongTuc = new phongtuc_model_1.PhongTuc({
            ten,
            moTa,
            yNghia,
            loai,
            danhGia,
            thoiGianCapNhat: new Date(),
            luotXem,
            diaDiem,
            huongDan,
            noiDungLuuTru: noiDungLuuTru || null,
            media: media || []
        });
        const saved = yield phongTuc.save();
        // Nếu có media, cập nhật liên kết ngược
        if (Array.isArray(media) && media.length > 0) {
            yield media_model_1.Media.updateMany({ _id: { $in: media } }, {
                $set: {
                    doiTuong: 'PhongTuc',
                    doiTuongId: saved._id.toString()
                }
            });
        }
        res.status(201).json(saved);
    }
    catch (err) {
        console.error('❌ Lỗi khi tạo PhongTuc:', err);
        res.status(500).json({ error: 'Lỗi khi tạo phong tục' });
    }
});
exports.createPhongTuc = createPhongTuc;
const updatePhongTuc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { ten, moTa, yNghia, loai, danhGia, soNguoiDanhGia, diaDiem, huongDan, noiDungLuuTru, media // Có thể là mảng mới hoặc không gửi
         } = req.body;
        const phongTuc = yield phongtuc_model_1.PhongTuc.findById(id);
        if (!phongTuc) {
            res.status(404).json({ error: 'Phong tục không tồn tại' });
            return;
        }
        // Cập nhật các trường nếu có
        if (ten !== undefined)
            phongTuc.ten = ten;
        if (moTa !== undefined)
            phongTuc.moTa = moTa;
        if (yNghia !== undefined)
            phongTuc.yNghia = yNghia;
        if (loai !== undefined)
            phongTuc.loai = loai;
        if (danhGia !== undefined)
            phongTuc.danhGia = danhGia;
        if (diaDiem !== undefined)
            phongTuc.diaDiem = diaDiem;
        if (huongDan !== undefined)
            phongTuc.huongDan = huongDan;
        if (noiDungLuuTru !== undefined)
            phongTuc.noiDungLuuTru = noiDungLuuTru;
        if (media !== undefined)
            phongTuc.media = media;
        phongTuc.thoiGianCapNhat = new Date();
        const updated = yield phongTuc.save();
        // Nếu cập nhật media, cũng update ngược lại trong bảng Media
        if (Array.isArray(media) && media.length > 0) {
            yield media_model_1.Media.updateMany({ _id: { $in: media } }, {
                $set: {
                    doiTuong: 'PhongTuc',
                    doiTuongId: phongTuc._id.toString()
                }
            });
        }
        res.json(updated);
    }
    catch (err) {
        console.error('❌ Lỗi khi cập nhật PhongTuc:', err);
        res.status(500).json({ error: 'Lỗi khi cập nhật phong tục' });
    }
});
exports.updatePhongTuc = updatePhongTuc;
const getPhongTucXemNhieu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phongTucs = yield phongtuc_model_1.PhongTuc.find({ luotXem: { $gt: 200 } }).sort({ luotXem: -1 });
        const phongTucIds = phongTucs.map(pt => pt._id);
        const medias = yield media_model_1.Media.find({
            doiTuong: "PhongTuc",
            doiTuongId: { $in: phongTucIds },
            type: "image",
        });
        const mediaMap = new Map();
        medias.forEach(media => {
            mediaMap.set(media.doiTuongId.toString(), media.url);
        });
        const result = phongTucs.map(pt => (Object.assign(Object.assign({}, pt.toObject()), { imageUrl: mediaMap.get(pt._id.toString()) || null })));
        res.json(result);
    }
    catch (error) {
        console.error("Lỗi khi lấy phong tục xem nhiều:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});
exports.getPhongTucXemNhieu = getPhongTucXemNhieu;
// GET /api/phongtucs/:id
const getPhongTucById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const phongTuc = yield phongtuc_model_1.PhongTuc.findById(id);
        if (!phongTuc) {
            res.status(404).json({ error: "Không tìm thấy phong tục" });
            return;
        }
        const media = yield media_model_1.Media.findOne({
            doiTuong: "PhongTuc",
            doiTuongId: id,
            type: "image",
        });
        const result = Object.assign(Object.assign({}, phongTuc.toObject()), { imageUrl: (media === null || media === void 0 ? void 0 : media.url) || null });
        res.json(result);
    }
    catch (error) {
        console.error("Lỗi khi lấy chi tiết phong tục:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});
exports.getPhongTucById = getPhongTucById;
// PATCH /api/phongtucs/:id/luotxem
const tangLuotXemPhongTuc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const phongTuc = yield phongtuc_model_1.PhongTuc.findById(id);
        if (!phongTuc) {
            res.status(404).json({ error: 'Không tìm thấy phong tục' });
            return;
        }
        phongTuc.luotXem = (phongTuc.luotXem || 0) + 1;
        yield phongTuc.save();
        res.status(200).json({ success: true, luotXem: phongTuc.luotXem });
    }
    catch (err) {
        console.error('❌ Lỗi khi tăng lượt xem:', err);
        res.status(500).json({ error: 'Lỗi server khi tăng lượt xem' });
    }
});
exports.tangLuotXemPhongTuc = tangLuotXemPhongTuc;
const danhGiaPhongTuc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const { id } = req.params; // ID phong tục
        const { diem, userId } = req.body; // Lấy cả điểm và userId
        console.log('PhongTuc ID:', id);
        console.log('Điểm đánh giá:', diem);
        console.log('UserId:', userId);
        // Kiểm tra dữ liệu đầu vào
        if (!diem || typeof diem !== 'number' || diem < 1 || diem > 5) {
            res.status(400).json({ message: "Điểm đánh giá phải là số từ 1 đến 5" });
            return;
        }
        // Tìm phong tục
        const phongtuc = yield phongtuc_model_1.PhongTuc.findById(id);
        if (!phongtuc) {
            res.status(404).json({ message: "Không tìm thấy phong tục" });
            return;
        }
        // Kiểm tra người dùng đã đánh giá chưa
        const userRating = (_a = phongtuc.danhGiaNguoiDung) === null || _a === void 0 ? void 0 : _a.find((dg) => dg.userId.toString() === userId.toString());
        let isNewRating = false;
        if (userRating) {
            // Nếu người dùng đã đánh giá, chỉ cập nhật lại điểm của người dùng đó
            userRating.diem = diem;
        }
        else {
            // Nếu chưa có đánh giá, thêm mới
            (_b = phongtuc.danhGiaNguoiDung) === null || _b === void 0 ? void 0 : _b.push({ userId, diem });
            isNewRating = true;
        }
        // Tính điểm trung bình mới
        const totalRating = ((_c = phongtuc.danhGiaNguoiDung) === null || _c === void 0 ? void 0 : _c.reduce((sum, dg) => sum + dg.diem, 0)) || 0;
        const avgRating = totalRating / (((_d = phongtuc.danhGiaNguoiDung) === null || _d === void 0 ? void 0 : _d.length) || 1);
        phongtuc.danhGia = avgRating;
        // Chỉ tăng số người đánh giá khi có đánh giá mới
        if (isNewRating) {
            phongtuc.soNguoiDanhGia = ((_e = phongtuc.danhGiaNguoiDung) === null || _e === void 0 ? void 0 : _e.length) || 0;
        }
        yield phongtuc.save();
        res.status(200).json({
            message: "Đánh giá thành công",
            danhGia: parseFloat(avgRating.toFixed(1)),
            soNguoiDanhGia: phongtuc.soNguoiDanhGia,
        });
    }
    catch (error) {
        const err = error;
        console.error("Lỗi đánh giá:", err.message);
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});
exports.danhGiaPhongTuc = danhGiaPhongTuc;

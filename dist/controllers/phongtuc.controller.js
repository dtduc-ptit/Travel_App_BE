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
exports.updatePhongTuc = exports.createPhongTuc = exports.getNoiBatPhongTuc = exports.getAllPhongTuc = void 0;
const phongtuc_model_js_1 = require("../models/phongtuc.model.js");
const media_model_js_1 = require("../models/media.model.js"); // Giả sử Media được import từ đâu đó
const getAllPhongTuc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phongtuc = yield phongtuc_model_js_1.PhongTuc.find();
        res.json(phongtuc);
    }
    catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách phong tục' });
    }
});
exports.getAllPhongTuc = getAllPhongTuc;
const getNoiBatPhongTuc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phongTucs = yield phongtuc_model_js_1.PhongTuc.find({ danhGia: { $gt: 4 } });
        const phongTucsWithImage = yield Promise.all(phongTucs.map((phongTuc) => __awaiter(void 0, void 0, void 0, function* () {
            const image = yield media_model_js_1.Media.findOne({
                doiTuong: 'PhongTuc',
                doiTuongId: phongTuc._id,
                type: 'image',
            });
            return Object.assign(Object.assign({}, phongTuc.toObject()), { imageUrl: (image === null || image === void 0 ? void 0 : image.url) || null });
        })));
        res.json(phongTucsWithImage);
    }
    catch (err) {
        console.error("Lỗi khi lấy phong tục nổi bật:", err);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách phong tục nổi bật' });
    }
});
exports.getNoiBatPhongTuc = getNoiBatPhongTuc;
const createPhongTuc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ten, moTa, yNghia, loai, danhGia, diaDiem, huongDan, luotXem, noiDungLuuTru, media // Array các media ID hoặc null nếu chưa có
         } = req.body;
        // Tạo phong tục mới
        const phongTuc = new phongtuc_model_js_1.PhongTuc({
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
            yield media_model_js_1.Media.updateMany({ _id: { $in: media } }, {
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
        const { ten, moTa, yNghia, loai, danhGia, diaDiem, huongDan, noiDungLuuTru, media // Có thể là mảng mới hoặc không gửi
         } = req.body;
        const phongTuc = yield phongtuc_model_js_1.PhongTuc.findById(id);
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
            yield media_model_js_1.Media.updateMany({ _id: { $in: media } }, {
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

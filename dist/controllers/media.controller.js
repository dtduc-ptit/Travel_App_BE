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
exports.getMediaByDoiTuong = exports.updateMedia = exports.getMediaById = exports.createMedia = void 0;
const media_model_1 = require("../models/media.model");
const phongtuc_model_1 = require("../models/phongtuc.model");
const ditich_model_1 = require("../models/ditich.model");
const sukien_model_1 = require("../models/sukien.model");
const createMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, url, doiTuong, doiTuongId, moTa } = req.body;
        // 1. Validate loại đối tượng
        const validTypes = ['SuKien', 'DTTich', 'PhongTuc'];
        if (!validTypes.includes(doiTuong)) {
            res.status(400).json({ error: 'Loại đối tượng không hợp lệ' });
            return;
        }
        // 2. Kiểm tra ID đối tượng có tồn tại không
        let doiTuongModel;
        if (doiTuong === 'PhongTuc')
            doiTuongModel = phongtuc_model_1.PhongTuc;
        else if (doiTuong === 'DTTich')
            doiTuongModel = ditich_model_1.DTTich;
        else if (doiTuong === 'SuKien')
            doiTuongModel = sukien_model_1.SuKien;
        const exists = yield doiTuongModel.exists({ _id: doiTuongId });
        if (!exists) {
            res.status(400).json({ error: `${doiTuong} với ID này không tồn tại` });
            return;
        }
        // 3. Tạo media mới
        const media = new media_model_1.Media({ type, url, doiTuong, doiTuongId, moTa });
        yield media.save();
        // 4. Gắn media._id vào media[] của đối tượng tương ứng
        yield doiTuongModel.findByIdAndUpdate(doiTuongId, {
            $push: { media: media._id }
        });
        res.status(201).json(media);
    }
    catch (err) {
        console.error('❌ Lỗi khi tạo Media:', err);
        res.status(500).json({ error: 'Lỗi khi tạo media' });
    }
});
exports.createMedia = createMedia;
const getMediaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const media = yield media_model_1.Media.findById(id);
        if (!media) {
            res.status(404).json({ error: 'Không tìm thấy media' });
            return;
        }
        res.status(200).json(media);
    }
    catch (err) {
        console.error('❌ Lỗi khi lấy media:', err);
        res.status(500).json({ error: 'Lỗi server khi lấy media' });
    }
});
exports.getMediaById = getMediaById;
const updateMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mediaId = req.params.id;
        const { type, url, doiTuong, doiTuongId, moTa } = req.body;
        // 1. Tìm media cũ
        const media = yield media_model_1.Media.findById(mediaId);
        if (!media) {
            res.status(404).json({ error: 'Media không tồn tại' });
            return;
        }
        const doiTuongCu = media.doiTuong;
        const doiTuongIdCu = media.doiTuongId;
        // 2. Nếu đổi đối tượng, cần xử lý ref cũ và mới
        if (doiTuong && doiTuongId && (doiTuong !== doiTuongCu || doiTuongId !== doiTuongIdCu)) {
            const removeFromOld = () => __awaiter(void 0, void 0, void 0, function* () {
                if (doiTuongCu === 'PhongTuc') {
                    yield phongtuc_model_1.PhongTuc.findByIdAndUpdate(doiTuongIdCu, { $pull: { media: media._id } });
                }
                else if (doiTuongCu === 'DTTich') {
                    yield ditich_model_1.DTTich.findByIdAndUpdate(doiTuongIdCu, { $pull: { media: media._id } });
                }
                else if (doiTuongCu === 'SuKien') {
                    yield sukien_model_1.SuKien.findByIdAndUpdate(doiTuongIdCu, { $pull: { media: media._id } });
                }
            });
            const addToNew = () => __awaiter(void 0, void 0, void 0, function* () {
                if (doiTuong === 'PhongTuc') {
                    const exists = yield phongtuc_model_1.PhongTuc.exists({ _id: doiTuongId });
                    if (!exists) {
                        res.status(400).json({ error: 'PhongTuc mới không tồn tại' });
                        return;
                    }
                    yield phongtuc_model_1.PhongTuc.findByIdAndUpdate(doiTuongId, { $addToSet: { media: media._id } });
                }
                else if (doiTuong === 'DTTich') {
                    const exists = yield ditich_model_1.DTTich.exists({ _id: doiTuongId });
                    if (!exists) {
                        res.status(400).json({ error: 'DTTich mới không tồn tại' });
                        return;
                    }
                    yield ditich_model_1.DTTich.findByIdAndUpdate(doiTuongId, { $addToSet: { media: media._id } });
                }
                else if (doiTuong === 'SuKien') {
                    const exists = yield sukien_model_1.SuKien.exists({ _id: doiTuongId });
                    if (!exists) {
                        res.status(400).json({ error: 'SuKien mới không tồn tại' });
                        return;
                    }
                    yield sukien_model_1.SuKien.findByIdAndUpdate(doiTuongId, { $addToSet: { media: media._id } });
                }
            });
            yield removeFromOld();
            yield addToNew();
            media.doiTuong = doiTuong;
            media.doiTuongId = doiTuongId;
        }
        // 3. Cập nhật các trường còn lại nếu có
        if (type)
            media.type = type;
        if (url)
            media.url = url;
        if (moTa !== undefined)
            media.moTa = moTa;
        yield media.save();
        res.status(200).json(media);
    }
    catch (err) {
        console.error("❌ Lỗi khi cập nhật media:", err);
        res.status(500).json({ error: "Lỗi khi cập nhật media" });
    }
});
exports.updateMedia = updateMedia;
const getMediaByDoiTuong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { doiTuong, doiTuongId, type } = req.query;
        // Kiểm tra các tham số bắt buộc
        if (!doiTuong || !doiTuongId || !type) {
            res.status(400).json({ error: "Thiếu thông tin doiTuong, doiTuongId hoặc type" });
            return;
        }
        // Xác nhận loại đối tượng hợp lệ
        const validTargets = ["PhongTuc", "SuKien", "DTTich"];
        if (!validTargets.includes(String(doiTuong))) {
            res.status(400).json({ error: "Loại đối tượng không hợp lệ" });
            return;
        }
        // Truy vấn Media phù hợp
        const mediaList = yield media_model_1.Media.find({
            doiTuong: doiTuong,
            doiTuongId: doiTuongId,
            type: type,
        }).sort({ createdAt: -1 }); // sắp xếp mới nhất lên đầu
        res.json(mediaList);
    }
    catch (err) {
        console.error("❌ Lỗi khi lấy media theo đối tượng:", err);
        res.status(500).json({ error: "Lỗi server khi lấy media" });
    }
});
exports.getMediaByDoiTuong = getMediaByDoiTuong;

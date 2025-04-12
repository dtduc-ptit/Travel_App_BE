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
exports.createMedia = void 0;
const media_model_1 = require("../models/media.model");
const createMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, url, doiTuong, doiTuongId, moTa } = req.body;
        if (!['SuKien', 'DTTich', 'PhongTuc'].includes(doiTuong)) {
            res.status(400).json({ error: 'Loại đối tượng không hợp lệ' });
            return;
        }
        const media = new media_model_1.Media({ type, url, doiTuong, doiTuongId, moTa });
        yield media.save();
        res.status(201).json(media);
    }
    catch (err) {
        console.error('Lỗi khi tạo Media:', err);
        res.status(500).json({ error: 'Lỗi khi tạo media' });
    }
});
exports.createMedia = createMedia;

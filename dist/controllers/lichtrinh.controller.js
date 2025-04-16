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
exports.getLichTrinhByDiTichId = exports.getLichTrinhBySuKienId = exports.getLichTrinhById = exports.getAllLichTrinh = exports.updateLichTrinh = exports.createLichTrinh = void 0;
const lichtrinh_model_1 = require("../models/lichtrinh.model");
const createLichTrinh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tenLichTrinh, ngay, suKien, diTich, hoatDongs } = req.body;
        // Kiểm tra các trường bắt buộc
        if (!tenLichTrinh || !ngay || !hoatDongs || !Array.isArray(hoatDongs) || hoatDongs.length === 0) {
            return res.status(400).json({ message: 'Thiếu dữ liệu bắt buộc hoặc không hợp lệ' });
        }
        // Tạo lịch trình
        const newLichTrinh = new lichtrinh_model_1.LichTrinh({
            tenLichTrinh,
            ngay,
            suKien,
            diTich,
            hoatDongs,
        });
        const saved = yield newLichTrinh.save();
        return res.status(201).json(saved);
    }
    catch (error) {
        return res.status(500).json({ message: 'Lỗi khi tạo lịch trình', error: error.message });
    }
});
exports.createLichTrinh = createLichTrinh;
// json tạo lịch trình mẫu 
// {
//     "tenLichTrinh": "Tham quan khu di tích lịch sử",
//     "ngay": "2025-04-20T00:00:00.000Z",
//     "suKien": null,
//     "diTich": "67fcc7edf874020fef98fe05",
//     "hoatDongs": [
//       {
//         "thoiGian": "08:30",
//         "noiDung": "Tập trung tại điểm hẹn",
//         "diaDiem": "Cổng chính công viên",
//         "ghiChu": "Đến sớm 10 phút"
//       },
//       {
//         "thoiGian": "09:00",
//         "noiDung": "Tham quan bảo tàng",
//         "diaDiem": "Bảo tàng lịch sử",
//         "ghiChu": ""
//       },
//       {
//         "thoiGian": "11:30",
//         "noiDung": "Ăn trưa",
//         "diaDiem": "Nhà hàng gần khu di tích",
//         "ghiChu": ""
//       }
//     ]
//   }
const updateLichTrinh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { tenLichTrinh, ngay, suKien, diTich, hoatDongs } = req.body;
        const lichTrinh = yield lichtrinh_model_1.LichTrinh.findById(id);
        if (!lichTrinh) {
            return res.status(404).json({ message: 'Không tìm thấy lịch trình' });
        }
        // Cập nhật các trường nếu có trong request
        if (tenLichTrinh !== undefined)
            lichTrinh.tenLichTrinh = tenLichTrinh;
        if (ngay !== undefined)
            lichTrinh.ngay = ngay;
        if (hoatDongs !== undefined)
            lichTrinh.hoatDongs = hoatDongs;
        // Kiểm tra và cập nhật suKien - diTich theo logic: chỉ 1 cái có giá trị
        const newSuKien = suKien !== undefined ? suKien : lichTrinh.suKien;
        const newDiTich = diTich !== undefined ? diTich : lichTrinh.diTich;
        if ((newSuKien && newDiTich) || (!newSuKien && !newDiTich)) {
            return res.status(400).json({ message: 'Phải có đúng một trong hai: suKien hoặc diTich (không được cả hai, không được thiếu cả hai)' });
        }
        if (suKien !== undefined)
            lichTrinh.suKien = suKien;
        if (diTich !== undefined)
            lichTrinh.diTich = diTich;
        const updated = yield lichTrinh.save();
        return res.status(200).json(updated);
    }
    catch (error) {
        return res.status(500).json({ message: 'Lỗi khi cập nhật lịch trình', error: error.message });
    }
});
exports.updateLichTrinh = updateLichTrinh;
const getAllLichTrinh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const danhSachLichTrinh = yield lichtrinh_model_1.LichTrinh.find()
            .populate('suKien') // Lấy thông tin chi tiết nếu có
            .populate('diTich') // Lấy thông tin chi tiết nếu có
            .sort({ ngay: -1 }); // Sắp xếp theo ngày giảm dần (mới nhất trước)
        return res.status(200).json(danhSachLichTrinh);
    }
    catch (error) {
        return res.status(500).json({ message: 'Lỗi khi lấy danh sách lịch trình', error: error.message });
    }
});
exports.getAllLichTrinh = getAllLichTrinh;
const getLichTrinhById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const lichTrinh = yield lichtrinh_model_1.LichTrinh.findById(id)
            .populate('suKien')
            .populate('diTich');
        if (!lichTrinh) {
            return res.status(404).json({ message: 'Không tìm thấy lịch trình' });
        }
        return res.status(200).json(lichTrinh);
    }
    catch (error) {
        return res.status(500).json({ message: 'Lỗi khi lấy chi tiết lịch trình', error: error.message });
    }
});
exports.getLichTrinhById = getLichTrinhById;
const getLichTrinhBySuKienId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { suKienId } = req.params;
        const lichTrinhs = yield lichtrinh_model_1.LichTrinh.find({ suKien: suKienId })
            .populate('suKien')
            .populate('diTich')
            .sort({ ngay: -1 });
        return res.status(200).json(lichTrinhs);
    }
    catch (error) {
        return res.status(500).json({ message: 'Lỗi khi lấy lịch trình theo sự kiện', error: error.message });
    }
});
exports.getLichTrinhBySuKienId = getLichTrinhBySuKienId;
const getLichTrinhByDiTichId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { diTichId } = req.params;
        const lichTrinhs = yield lichtrinh_model_1.LichTrinh.find({ diTich: diTichId })
            .populate('suKien')
            .populate('diTich')
            .sort({ ngay: -1 });
        return res.status(200).json(lichTrinhs);
    }
    catch (error) {
        return res.status(500).json({ message: 'Lỗi khi lấy lịch trình theo di tích', error: error.message });
    }
});
exports.getLichTrinhByDiTichId = getLichTrinhByDiTichId;

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
exports.createEventNotifications = void 0;
const sukien_model_1 = require("../models/sukien.model");
const nguoidung_model_1 = require("../models/nguoidung.model");
const thongbaosukien_model_1 = require("../models/thongbaosukien.model");
const createEventNotifications = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Lấy thời gian hiện tại
        const now = new Date();
        const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 ngày tới
        // Tìm các sự kiện có ngày tổ chức trong vòng 30 ngày tới
        const suKienSapToi = yield sukien_model_1.SuKien.find({
            // Chuyển thoiGianBatDau từ chuỗi dạng 'dd/mm/yyyy' sang đối tượng Date
            $expr: {
                $and: [
                    {
                        $gte: [
                            {
                                $toDate: {
                                    $concat: [
                                        { $substr: ["$thoiGianBatDau", 6, 4] },
                                        "-",
                                        { $substr: ["$thoiGianBatDau", 3, 2] },
                                        "-",
                                        { $substr: ["$thoiGianBatDau", 0, 2] }
                                    ]
                                }
                            },
                            now
                        ]
                    },
                    {
                        $lte: [
                            {
                                $toDate: {
                                    $concat: [
                                        { $substr: ["$thoiGianBatDau", 6, 4] },
                                        "-",
                                        { $substr: ["$thoiGianBatDau", 3, 2] },
                                        "-",
                                        { $substr: ["$thoiGianBatDau", 0, 2] }
                                    ]
                                }
                            },
                            in30Days
                        ]
                    }
                ]
            }
        }).exec();
        if (suKienSapToi.length === 0) {
            console.log('Không có sự kiện nào trong vòng 30 ngày tới.');
            return;
        }
        // Lấy tất cả người dùng
        const nguoiDungList = yield nguoidung_model_1.NguoiDung.find();
        // Gửi thông báo cho tất cả người dùng
        for (const suKien of suKienSapToi) {
            // Chuyển thoiGianBatDau từ chuỗi thành Date
            const eventStartTime = new Date(`${suKien.thoiGianBatDau.split('/')[2]}-${suKien.thoiGianBatDau.split('/')[1]}-${suKien.thoiGianBatDau.split('/')[0]}`);
            for (const nguoiDung of nguoiDungList) {
                // Kiểm tra xem người dùng đã nhận thông báo này chưa
                const existingNotification = yield thongbaosukien_model_1.ThongBaoSuKien.findOne({
                    nguoiDung: nguoiDung._id,
                    suKien: suKien._id,
                });
                // Nếu chưa gửi thông báo cho người dùng này về sự kiện này, thì tạo mới thông báo
                if (!existingNotification) {
                    // Tính số ngày còn lại đến sự kiện
                    const diffTime = eventStartTime.getTime() - now.getTime();
                    const remainingDays = Math.ceil(diffTime / (1000 * 3600 * 24)); // Số ngày còn lại
                    // Tạo thông báo mới
                    const thongBao = new thongbaosukien_model_1.ThongBaoSuKien({
                        nguoiDung: nguoiDung._id,
                        suKien: suKien._id,
                        noiDung: `Sự kiện "${suKien.ten}" sẽ diễn ra trong ${remainingDays} ngày nữa!`,
                        thoiGianGui: now,
                    });
                    // Lưu thông báo
                    yield thongBao.save();
                }
            }
        }
        console.log('Thông báo sự kiện sắp diễn ra đã được gửi thành công.');
    }
    catch (error) {
        console.error('Lỗi khi tạo thông báo sự kiện:', error);
    }
});
exports.createEventNotifications = createEventNotifications;

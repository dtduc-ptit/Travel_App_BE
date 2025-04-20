import { Request, Response } from "express";
import { DanhGia } from "../models/danhgia.model";
import { DTTich } from "../models/ditich.model";
import { SuKien } from "../models/sukien.model";
import { PhongTuc } from "../models/phongtuc.model";
import { Model } from "mongoose";
import {NguoiDung} from '../models/nguoidung.model';
import mongoose from "mongoose";

const getModelByLoaiDoiTuong = (loai: string): Model<any> | null => {
    switch (loai) {
      case "DTTich":
        return DTTich;
      case "SuKien":
        return SuKien;
      case "PhongTuc":
        return PhongTuc;
      default:
        return null;
    }
  };

// Tạo hoặc cập nhật đánh giá
export const taoHoacCapNhatDanhGia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { doiTuongId, loaiDoiTuong, diem, noiDung } = req.body;
    const userId = (req as any).user._id;

    if (!doiTuongId || !loaiDoiTuong || !diem || !noiDung) {
      res.status(400).json({ message: "Thiếu dữ liệu cần thiết." });
      return;
    }

    const danhGiaCu = await DanhGia.findOne({
      nguoiDung: userId,
      doiTuongId,
      loaiDoiTuong,
    });

    const Model = getModelByLoaiDoiTuong(loaiDoiTuong);
    if (!Model) {
      res.status(400).json({ message: "Loại đối tượng không hợp lệ." });
      return;
    }

    if (danhGiaCu) {
      danhGiaCu.diem = diem;
      danhGiaCu.noiDung = noiDung;
      await danhGiaCu.save();
      res.status(200).json({ message: "Cập nhật đánh giá thành công", danhGia: danhGiaCu });
    } else {
      const danhGiaMoi = await DanhGia.create({
        nguoiDung: userId,
        doiTuongId,
        loaiDoiTuong,
        diem,
        noiDung,
      });

      const doiTuong = await Model.findById(doiTuongId);
      if (!doiTuong) {
        res.status(404).json({ message: "Không tìm thấy đối tượng." });
        return;
      }

      const tongDiemMoi = doiTuong.danhGia * doiTuong.soNguoiDanhGia + diem;
      const soNguoiMoi = doiTuong.soNguoiDanhGia + 1;
      doiTuong.danhGia = tongDiemMoi / soNguoiMoi;
      doiTuong.soNguoiDanhGia = soNguoiMoi;

      await doiTuong.save();

      res.status(201).json({ message: "Đánh giá thành công", danhGia: danhGiaMoi });
    }
  } catch (error) {
    console.error("Lỗi đánh giá:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Bình luận vào một đánh giá
export const binhLuanDanhGia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { danhGiaId } = req.params;
    const { noiDung } = req.body;
    const userId = (req as any).user._id;

    if (!noiDung) {
      res.status(400).json({ message: "Chưa nhập nội dung bình luận." });
      return;
    }

    const danhGia = await DanhGia.findById(danhGiaId);
    if (!danhGia) {
      res.status(404).json({ message: "Không tìm thấy đánh giá." });
      return;
    }

    danhGia.binhLuan.push({
      nguoiDung: userId,
      noiDung,
      thoiGian: new Date(),
    });

    await danhGia.save();

    res.status(200).json({ message: "Bình luận thành công", danhGia });
  } catch (error) {
    console.error("Lỗi bình luận:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Lấy toàn bộ đánh giá theo đối tượng
export const layDanhGiaTheoDoiTuong = async (req: Request, res: Response): Promise<void> => {
  try {
    const { doiTuongId } = req.params;

    const danhGia = await DanhGia.find({ doiTuongId })
      .populate("nguoiDung", "ten anhDaiDien")
      .populate("binhLuan.nguoiDung", "ten anhDaiDien")
      .sort({ updatedAt: -1 });

    res.status(200).json({ danhGia });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đánh giá:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};
export const themBinhLuanDanhGia = async (req: Request, res: Response): Promise<void> => {
    try {
      const danhGiaId = req.params.id;
      const { nguoiDung, noiDung } = req.body;
  
      if (!noiDung || !nguoiDung) {
        res.status(400).json({ message: 'Thiếu thông tin người dùng hoặc nội dung bình luận' });
        return; // Kết thúc hàm sau khi gửi phản hồi
      }
  
      const danhGia = await DanhGia.findById(danhGiaId);
      if (!danhGia) {
        res.status(404).json({ message: 'Không tìm thấy đánh giá' });
        return; // Kết thúc hàm sau khi gửi phản hồi
      }
  
      danhGia.binhLuan.push({ nguoiDung, noiDung });
      await danhGia.save();
  
      res.status(200).json({ message: 'Đã thêm bình luận' });
    } catch (err) {
      console.error("Lỗi server:", err);
      res.status(500).json({ message: 'Lỗi server', error: err });
    }
  };
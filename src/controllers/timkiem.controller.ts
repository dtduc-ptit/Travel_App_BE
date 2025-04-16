import { Request, Response } from "express";
import { DTTich } from "../models/ditich.model";
import { SuKien } from "../models/sukien.model";
import { PhongTuc } from "../models/phongtuc.model";
import { Media } from "../models/media.model";

// Controller tìm kiếm tất cả
export const timKiemTatCa = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      res.status(400).json({ message: "Thiếu từ khoá tìm kiếm" });
      return;
    }

    const regex = new RegExp(q, "i");

    const [diTichList, suKienList, phongTucList] = await Promise.all([
      DTTich.find({ ten: regex }),
      SuKien.find({ ten: regex }),
      PhongTuc.find({ ten: regex }),
    ]);

    const attachImageMedia = async (
      list: any[],
      type: "DTTich" | "SuKien" | "PhongTuc"
    ): Promise<any[]> => {
      const results = await Promise.all(
        list.map(async (item) => {
          const media = await Media.find({
            doiTuong: type,
            doiTuongId: item._id,
            type: "image", // Chỉ lấy ảnh
          });
          return { ...item.toObject(), media };
        })
      );
      return results;
    };

    const [diTichWithMedia, suKienWithMedia, phongTucWithMedia] = await Promise.all([
      attachImageMedia(diTichList, "DTTich"),
      attachImageMedia(suKienList, "SuKien"),
      attachImageMedia(phongTucList, "PhongTuc"),
    ]);

    res.status(200).json({
      diTich: diTichWithMedia,
      suKien: suKienWithMedia,
      phongTuc: phongTucWithMedia,
    });
  } catch (error) {
    console.error("Lỗi tìm kiếm:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi tìm kiếm" });
  }
};

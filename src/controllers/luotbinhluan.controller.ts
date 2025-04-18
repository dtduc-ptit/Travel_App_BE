import { Request, Response } from 'express';
import { LuotBinhLuan } from '../models/luotbinhluan.model';

export const createBinhLuan = async (req: Request, res: Response) => {
  try {
    const { nguoiDung, baiViet, noiDung } = req.body;

    const binhLuan = new LuotBinhLuan({
      nguoiDung,
      baiViet,
      noiDung,
    });

    const savedBinhLuan = await binhLuan.save();
    res.status(201).json(savedBinhLuan);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo bình luận" });
  }
};

export const getBinhLuanByBaiViet = async (req: Request, res: Response) => {
  try {
    const { baiVietId } = req.params;
    const binhLuanList = await LuotBinhLuan.find({ baiViet: baiVietId }).populate('nguoiDung', 'ten anhDaiDien');
    res.json(binhLuanList);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy bình luận" });
  }
};

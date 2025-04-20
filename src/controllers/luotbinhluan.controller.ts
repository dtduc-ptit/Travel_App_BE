import { Request, Response } from 'express';
import { LuotBinhLuan } from '../models/luotbinhluan.model';
import { BaiViet } from '../models/baiviet.model';

export const createBinhLuan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nguoiDung, baiViet, noiDung } = req.body;

    // Tạo mới bình luận
    const binhLuan = new LuotBinhLuan({
      nguoiDung,
      baiViet,
      noiDung,
    });

    // Lưu bình luận vào cơ sở dữ liệu
    const savedBinhLuan = await binhLuan.save();

    // Cập nhật bài viết để thêm _id của bình luận vào trường luotBinhLuan
    const updatedBaiViet = await BaiViet.findByIdAndUpdate(
      baiViet, // ID bài viết mà bạn muốn cập nhật
      {
        $push: { luotBinhLuan: savedBinhLuan._id }, // Thêm _id của bình luận vào mảng luotBinhLuan
      },
      { new: true } // Trả về bài viết đã được cập nhật
    );

    if (!updatedBaiViet) {
      res.status(404).json({ message: "Bài viết không tìm thấy" });
    }

    // Trả về bình luận đã được lưu và bài viết đã được cập nhật
    res.status(201).json({
      savedBinhLuan,
      updatedBaiViet,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo bình luận", error });
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

import { Request, Response } from 'express';
import { LuotThich } from '../models/luotthich.model'; // Mô hình lượt thích
import { BaiViet } from '../models/baiviet.model';   // Mô hình bài viết
import mongoose from 'mongoose';

// Hàm tạo lượt thích
export const addLike = async (req: Request, res: Response): Promise<void> => {
  const { baiVietId, nguoiDungId } = req.body;

  if (!baiVietId || !nguoiDungId) {
    res.status(400).json({ error: 'Thiếu thông tin bài viết hoặc người dùng' });
  }

  try {
    // Kiểm tra xem người dùng đã like bài viết chưa
    const existingLike = await LuotThich.findOne({ nguoiDung: nguoiDungId, baiViet: baiVietId });

    if (existingLike) {
      res.status(400).json({ message: 'Bạn đã thích bài viết này rồi' });
    }

    // Tạo mới lượt thích
    const newLike = new LuotThich({
      nguoiDung: nguoiDungId,
      baiViet: baiVietId,
    });

    await newLike.save();

    // Cập nhật số lượt thích trong bài viết
    await BaiViet.findByIdAndUpdate(baiVietId, {
      $push: { luotThich: nguoiDungId },  // Thêm nguoiDung vào danh sách likes của bài viết
      $inc: { likeCount: 1 },  // Tăng số lượt thích của bài viết
    });

    res.status(200).json({ message: 'Đã thích bài viết' });
  } catch (error) {
    console.error('Lỗi khi thêm lượt thích:', error);
    res.status(500).json({ error: 'Có lỗi xảy ra khi thêm lượt thích' });
  }
};

// Hàm xóa lượt thích
export const removeLike = async (req: Request, res: Response): Promise<void> => {
  const { baiVietId, nguoiDungId } = req.body;

  // Kiểm tra xem có đủ thông tin bài viết và người dùng không
  if (!baiVietId || !nguoiDungId) {
    res.status(400).json({ error: 'Thiếu thông tin bài viết hoặc người dùng' });
  }

  try {
    // Kiểm tra xem người dùng đã like bài viết chưa
    const existingLike = await LuotThich.findOne({ nguoiDung: nguoiDungId, baiViet: baiVietId });

    // Nếu không có lượt thích, trả về lỗi
    if (!existingLike) {
      res.status(400).json({ message: 'Bạn chưa thích bài viết này' });
    }

    // Xóa lượt thích khỏi cơ sở dữ liệu
    if (existingLike) {
      await LuotThich.findByIdAndDelete(existingLike._id);
    }

    // Cập nhật số lượt thích trong bài viết
    await BaiViet.findByIdAndUpdate(baiVietId, {
      $pull: { luotThich: nguoiDungId },  // Loại bỏ nguoiDung khỏi danh sách likes của bài viết
      $inc: { likeCount: -1 },  // Giảm số lượt thích của bài viết
    });

    // Trả về thông báo thành công
    res.status(200).json({ message: 'Đã bỏ lượt thích bài viết' });
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error('Lỗi khi xóa lượt thích:', error);
    res.status(500).json({ error: 'Có lỗi xảy ra khi xóa lượt thích' });
  }
};


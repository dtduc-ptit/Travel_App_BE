import { Request, Response } from 'express';
import ThongBao, { IThongBao } from '../models/thongbao.model';
import {NguoiDung} from '../models/nguoidung.model';
import {BaiViet} from '../models/baiviet.model';
import { Document } from 'mongoose';

// Định nghĩa interface cho NguoiDung sau khi populate
interface INguoiDung extends Document {
  _id: string;
  ten: string;
  anhDaiDien?: string;
}

// Định nghĩa interface cho BaiViet sau khi populate
interface IBaiViet extends Document {
  _id: string;
  noiDung: string;
  hinhAnh?: string;
  nguoiDung?: INguoiDung; // nguoiDung sau khi populate
}

// Lấy danh sách thông báo của người dùng
export const getThongBao = async (req: Request, res: Response):Promise<void> => {
  try {
    const nguoiNhanId = req.query.nguoiNhan as string;
    if (!nguoiNhanId) {
      res.status(400).json({ message: 'Thiếu ID người nhận' });
    }

    const thongBao = await ThongBao.find({ nguoiNhan: nguoiNhanId })
      .populate<{ nguoiGui: INguoiDung }>('nguoiGui', 'ten anhDaiDien')
      .populate<{ baiViet: IBaiViet }>('baiViet', 'noiDung hinhAnh')
      .sort({ thoiGian: -1 });

    res.status(200).json(thongBao);
  } catch (error) {
    console.error('Lỗi khi lấy thông báo:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Tạo thông báo mới
export const createThongBao = async (
  nguoiGui: string,
  nguoiNhan: string,
  loai: 'LIKE' | 'COMMENT',
  baiViet: string,
  noiDung: string
): Promise<IThongBao> => {
  try {
    const thongBao = new ThongBao({
      nguoiGui,
      nguoiNhan,
      loai,
      baiViet,
      noiDung,
      thoiGian: new Date(),
      daDoc: false,
    });
    await thongBao.save();
    return thongBao;
  } catch (error) {
    console.error('Lỗi khi tạo thông báo:', error);
    throw error;
  }
};

// Đánh dấu thông báo đã đọc
export const markAsRead = async (req: Request, res: Response):Promise<void> => {
  try {
    const thongBaoId = req.params.id;
    const thongBao = await ThongBao.findByIdAndUpdate(
      thongBaoId,
      { daDoc: true },
      { new: true }
    );

    if (!thongBao) {
      res.status(404).json({ message: 'Không tìm thấy thông báo' });
    }

    res.status(200).json(thongBao);
  } catch (error) {
    console.error('Lỗi khi đánh dấu đã đọc:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Hook tạo thông báo khi like (gọi từ controller like)
export const createLikeNotification = async (nguoiGuiId: string, baiVietId: string):Promise<void> => {
  try {
    const baiViet = await BaiViet.findById(baiVietId).populate<{ nguoiDung: INguoiDung }>('nguoiDung');
    if (!baiViet) return;

    // Kiểm tra xem nguoiDung có tồn tại không
    const nguoiNhanId = baiViet.nguoiDung?._id;
    if (!nguoiNhanId) {
      console.warn('Không tìm thấy người dùng cho bài viết:', baiVietId);
      return;
    }

    if (nguoiGuiId === nguoiNhanId.toString()) return; // Không tạo thông báo nếu tự like

    const nguoiGui = await NguoiDung.findById(nguoiGuiId) as INguoiDung | null;
    if (!nguoiGui) {
      console.warn('Không tìm thấy người gửi:', nguoiGuiId);
      return;
    }

    const noiDung = `${nguoiGui.ten} đã thích bài viết của bạn`;
    await createThongBao(nguoiGuiId, nguoiNhanId.toString(), 'LIKE', baiVietId, noiDung);
  } catch (error) {
    console.error('Lỗi khi tạo thông báo like:', error);
  }
};

// Hook tạo thông báo khi bình luận (gọi từ controller bình luận)
export const createCommentNotification = async (
  nguoiGuiId: string,
  baiVietId: string,
  noiDungBinhLuan: string
) => {
  try {
    const baiViet = await BaiViet.findById(baiVietId).populate<{ nguoiDung: INguoiDung }>('nguoiDung');
    if (!baiViet) return;

    // Kiểm tra xem nguoiDung có tồn tại không
    const nguoiNhanId = baiViet.nguoiDung?._id;
    if (!nguoiNhanId) {
      console.warn('Không tìm thấy người dùng cho bài viết:', baiVietId);
      return;
    }

    if (nguoiGuiId === nguoiNhanId.toString()) return; // Không tạo thông báo nếu tự bình luận

    const nguoiGui = await NguoiDung.findById(nguoiGuiId) as INguoiDung | null;
    if (!nguoiGui) {
      console.warn('Không tìm thấy người gửi:', nguoiGuiId);
      return;
    }

    const noiDung = `${nguoiGui.ten} đã bình luận bài viết của bạn: "${noiDungBinhLuan.slice(0, 50)}..."`;
    await createThongBao(nguoiGuiId, nguoiNhanId.toString(), 'COMMENT', baiVietId, noiDung);
  } catch (error) {
    console.error('Lỗi khi tạo thông báo bình luận:', error);
  }
};

// Xóa thông báo khi bỏ like
export const deleteLikeNotification = async (nguoiGuiId: string, baiVietId: string) => {
   try {
     const result = await ThongBao.deleteOne({
       nguoiGui: nguoiGuiId,
       baiViet: baiVietId,
       loai: 'LIKE',
     });
     if (result.deletedCount === 0) {
       console.warn('Không tìm thấy thông báo để xóa:', { nguoiGuiId, baiVietId });
     }
     return result;
   } catch (error) {
     console.error('Lỗi khi xóa thông báo:', error);
     throw error;
   }
 };
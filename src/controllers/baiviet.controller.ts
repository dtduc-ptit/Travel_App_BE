import { Request, Response, RequestHandler, NextFunction } from 'express';
import { BaiViet } from '../models/baiviet.model';

// POST /api/baiviet
export const createBaiViet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { nguoiDung, noiDung, hinhAnh } = req.body;

    // Kiểm tra dữ liệu đầu vào 
    if (!nguoiDung || !noiDung || !hinhAnh) {
      res.status(400).json({ error: 'Thiếu thông tin cần thiết' });
      return;
    }

    // Tạo mới bài viết
    const baiViet = new BaiViet({
      nguoiDung,
      noiDung,
      hinhAnh,
    });

    // Lưu bài viết vào cơ sở dữ liệu
    const savedBaiViet = await baiViet.save();

    // Trả về bài viết vừa tạo
    res.status(201).json(savedBaiViet);
  } catch (err) {
    console.error('❌ Lỗi khi tạo bài viết:', err);
    next(err);  // Gọi next để chuyển lỗi cho middleware lỗi
  }
};
// GET /api/baiviet
export const getDanhSachBaiViet = async (req: Request, res: Response) => {
  try {
    const baiVietList = await BaiViet.find()
      .populate('nguoiDung', 'ten anhDaiDien')  // Populate thông tin người dùng
      .sort({ thoiGian: -1 })  // Sắp xếp theo thời gian đăng bài (mới nhất lên đầu)
      .limit(10);

    res.json(baiVietList);
  } catch (err) {
    console.error('❌ Lỗi khi lấy danh sách bài viết:', err);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách bài viết' });
  }
};

// GET /api/baiviet/:id
export const getBaiVietById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const baiViet = await BaiViet.findById(id).populate('nguoiDung', 'ten anhDaiDien');
    
    if (!baiViet) {
      res.status(404).json({ error: 'Không tìm thấy bài viết' });
      return;
    }

    res.json(baiViet);
  } catch (err) {
    console.error('❌ Lỗi khi lấy chi tiết bài viết:', err);
    res.status(500).json({ error: 'Lỗi khi lấy chi tiết bài viết' });
  }
};

// PATCH /api/baiviet/:id
export const updateBaiViet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const baiViet = await BaiViet.findById(id);
    if (!baiViet) {
      res.status(404).json({ error: 'Bài viết không tồn tại' });
      return;
    }

    Object.assign(baiViet, updateData);
    const updatedBaiViet = await baiViet.save();

    res.json(updatedBaiViet);
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật bài viết:', err);
    res.status(500).json({ error: 'Lỗi khi cập nhật bài viết' });
  }
};

// PATCH /api/baiviet/:id/luotthich
export const tangLuotThichBaiViet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const baiViet = await BaiViet.findById(id);
    if (!baiViet) {
      res.status(404).json({ error: 'Bài viết không tồn tại' });
      return;
    }

    baiViet.luotThich.push(req.body.luotThich);  // Giả sử luotThich là ID của người thích bài
    await baiViet.save();

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Lỗi khi tăng lượt thích bài viết:', err);
    res.status(500).json({ error: 'Lỗi khi tăng lượt thích bài viết' });
  }
};

// PATCH /api/baiviet/:id/luotbinhluan
export const tangLuotBinhLuanBaiViet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const baiViet = await BaiViet.findById(id);
    if (!baiViet) {
      res.status(404).json({ error: 'Bài viết không tồn tại' });
      return;
    }

    baiViet.luotBinhLuan.push(req.body.luotBinhLuan);  // Giả sử luotBinhLuan là ID của người bình luận
    await baiViet.save();

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Lỗi khi tăng lượt bình luận bài viết:', err);
    res.status(500).json({ error: 'Lỗi khi tăng lượt bình luận bài viết' });
  }
};

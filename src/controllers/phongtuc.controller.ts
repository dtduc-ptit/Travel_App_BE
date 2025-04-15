import { Request, Response } from 'express';
import { PhongTuc } from '../models/phongtuc.model';
import { Media } from '../models/media.model'; // Giả sử Media được import từ đâu đó

export const getAllPhongTuc = async (req: Request, res: Response) => {
  try {
    const phongtuc = await PhongTuc.find(); 
    res.json(phongtuc);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách phong tục' });
  }
};

export const getNoiBatPhongTuc = async (req: Request, res: Response) => {
  try {
    const { diaDiem } = req.query;

    const filter: any = { danhGia: { $gte: 4 } };
    if (diaDiem) {
      filter.diaDiem = diaDiem;
    }

    const phongTucs = await PhongTuc.find(filter);
    const phongTucIds = phongTucs.map(pt => pt._id);

    const medias = await Media.find({
      doiTuong: 'PhongTuc',
      doiTuongId: { $in: phongTucIds },
      type: 'image',
    });

    const mediaMap = new Map();
    medias.forEach(media => {
      mediaMap.set(media.doiTuongId.toString(), media.url);
    });

    const result = phongTucs.map(pt => ({
      ...pt.toObject(),
      imageUrl: mediaMap.get(pt._id.toString()) || null,
    }));

    res.json(result);
  } catch (err) {
    console.error("Lỗi khi lấy phong tục nổi bật:", err);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách phong tục nổi bật' });
  }
};


export const getPhoBienPhongTuc = async (req: Request, res: Response) => {
  try {
    const phongTucs = await PhongTuc.find({ danhGia: { $lt: 4 } });
    const phongTucIds = phongTucs.map(pt => pt._id);

    const medias = await Media.find({
      doiTuong: 'PhongTuc',
      doiTuongId: { $in: phongTucIds },
      type: 'image',
    });

    const mediaMap = new Map();
    medias.forEach(media => {
      mediaMap.set(media.doiTuongId.toString(), media.url);
    });

    const result = phongTucs.map(pt => ({
      ...pt.toObject(),
      imageUrl: mediaMap.get(pt._id.toString()) || null,
    }));

    res.json(result);
  } catch (err) {
    console.error("Lỗi khi lấy phong tục phổ biếnbiến:", err);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách phong tục phổ biến' });
  }
};


export const createPhongTuc = async (req: Request, res: Response) => {
  try {
    const {
      ten,
      moTa,
      yNghia,
      loai,
      danhGia,
      diaDiem,
      huongDan,
      luotXem,
      noiDungLuuTru,
      media // Array các media ID hoặc null nếu chưa có
    } = req.body;

    // Tạo phong tục mới
    const phongTuc = new PhongTuc({
      ten,
      moTa,
      yNghia,
      loai,
      danhGia,
      thoiGianCapNhat: new Date(),
      luotXem,
      diaDiem,
      huongDan,
      noiDungLuuTru: noiDungLuuTru || null,
      media: media || []
    });

    const saved = await phongTuc.save();

    // Nếu có media, cập nhật liên kết ngược
    if (Array.isArray(media) && media.length > 0) {
      await Media.updateMany(
        { _id: { $in: media } },
        {
          $set: {
            doiTuong: 'PhongTuc',
            doiTuongId: saved._id.toString()
          }
        }
      );
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Lỗi khi tạo PhongTuc:', err);
    res.status(500).json({ error: 'Lỗi khi tạo phong tục' });
  }
};

export const updatePhongTuc = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const {
      ten,
      moTa,
      yNghia,
      loai,
      danhGia,
      soNguoiDanhGia,
      diaDiem,
      huongDan,
      noiDungLuuTru,
      media // Có thể là mảng mới hoặc không gửi
    } = req.body;

    const phongTuc = await PhongTuc.findById(id);
    if (!phongTuc) {
      res.status(404).json({ error: 'Phong tục không tồn tại' });
      return;
    }

    // Cập nhật các trường nếu có
    if (ten !== undefined) phongTuc.ten = ten;
    if (moTa !== undefined) phongTuc.moTa = moTa;
    if (yNghia !== undefined) phongTuc.yNghia = yNghia;
    if (loai !== undefined) phongTuc.loai = loai;
    if (danhGia !== undefined) phongTuc.danhGia = danhGia;
    if (diaDiem !== undefined) phongTuc.diaDiem = diaDiem;
    if (huongDan !== undefined) phongTuc.huongDan = huongDan;
    if (noiDungLuuTru !== undefined) phongTuc.noiDungLuuTru = noiDungLuuTru;
    if (media !== undefined) phongTuc.media = media;

    phongTuc.thoiGianCapNhat = new Date();

    const updated = await phongTuc.save();

    // Nếu cập nhật media, cũng update ngược lại trong bảng Media
    if (Array.isArray(media) && media.length > 0) {
      await Media.updateMany(
        { _id: { $in: media } },
        {
          $set: {
            doiTuong: 'PhongTuc',
            doiTuongId: phongTuc._id.toString()
          }
        }
      );
    }

    res.json(updated);
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật PhongTuc:', err);
    res.status(500).json({ error: 'Lỗi khi cập nhật phong tục' });
  }
};


export const getPhongTucXemNhieu = async (req: Request, res: Response) => {
  try {
    const phongTucs = await PhongTuc.find({ luotXem: { $gt: 200 } }).sort({ luotXem: -1 });

    const phongTucIds = phongTucs.map(pt => pt._id);

    const medias = await Media.find({
      doiTuong: "PhongTuc",
      doiTuongId: { $in: phongTucIds },
      type: "image",
    });

    const mediaMap = new Map();
    medias.forEach(media => {
      mediaMap.set(media.doiTuongId.toString(), media.url);
    });

    const result = phongTucs.map(pt => ({
      ...pt.toObject(),
      imageUrl: mediaMap.get(pt._id.toString()) || null,
    }));

    res.json(result);
  } catch (error) {
    console.error("Lỗi khi lấy phong tục xem nhiều:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// GET /api/phongtucs/:id
export const getPhongTucById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const phongTuc = await PhongTuc.findById(id);
    if (!phongTuc) {
      res.status(404).json({ error: "Không tìm thấy phong tục" });
      return;
    }

    const media = await Media.findOne({
      doiTuong: "PhongTuc",
      doiTuongId: id,
      type: "image",
    });

    const result = {
      ...phongTuc.toObject(),
      imageUrl: media?.url || null,
    };

    res.json(result);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết phong tục:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// PATCH /api/phongtucs/:id/luotxem
export const tangLuotXemPhongTuc = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const phongTuc = await PhongTuc.findById(id);
    if (!phongTuc) {
      res.status(404).json({ error: 'Không tìm thấy phong tục' });
      return;
    }

    phongTuc.luotXem = (phongTuc.luotXem || 0) + 1;
    await phongTuc.save();

    res.status(200).json({ success: true, luotXem: phongTuc.luotXem });
  } catch (err) {
    console.error('❌ Lỗi khi tăng lượt xem:', err);
    res.status(500).json({ error: 'Lỗi server khi tăng lượt xem' });
  }
};

export const danhGiaPhongTuc = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // ID phong tục
    const { diem, userId } = req.body; // Lấy cả điểm và userId

    console.log('PhongTuc ID:', id);
    console.log('Điểm đánh giá:', diem);
    console.log('UserId:', userId);

    // Kiểm tra dữ liệu đầu vào
    if (!diem || typeof diem !== 'number' || diem < 1 || diem > 5) {
      res.status(400).json({ message: "Điểm đánh giá phải là số từ 1 đến 5" });
      return;
    }

    // Tìm phong tục
    const phongtuc = await PhongTuc.findById(id);
    if (!phongtuc) {
      res.status(404).json({ message: "Không tìm thấy phong tục" });
      return;
    }

    // Kiểm tra người dùng đã đánh giá chưa
    const userRating = phongtuc.danhGiaNguoiDung?.find((dg) => dg.userId.toString() === userId.toString());
    
    let isNewRating = false;

    if (userRating) {
      // Nếu người dùng đã đánh giá, chỉ cập nhật lại điểm của người dùng đó
      userRating.diem = diem;
    } else {
      // Nếu chưa có đánh giá, thêm mới
      phongtuc.danhGiaNguoiDung?.push({ userId, diem });
      isNewRating = true;
    }

    // Tính điểm trung bình mới
    const totalRating = phongtuc.danhGiaNguoiDung?.reduce((sum, dg) => sum + dg.diem, 0) || 0;
    const avgRating = totalRating / (phongtuc.danhGiaNguoiDung?.length || 1);

    phongtuc.danhGia = avgRating;

    // Chỉ tăng số người đánh giá khi có đánh giá mới
    if (isNewRating) {
      phongtuc.soNguoiDanhGia = phongtuc.danhGiaNguoiDung?.length || 0;
    }

    await phongtuc.save();

    res.status(200).json({
      message: "Đánh giá thành công",
      danhGia: parseFloat(avgRating.toFixed(1)),
      soNguoiDanhGia: phongtuc.soNguoiDanhGia,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Lỗi đánh giá:", err.message);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};


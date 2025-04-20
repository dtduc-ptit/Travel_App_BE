import { Request, Response } from 'express';
import { DTTich } from '../models/ditich.model';
import { Media } from '../models/media.model';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { IDTTich } from '../models/ditich.model';


export const getAllDiTich = async (req: Request, res: Response) => {
  try {
    const ditichs = await DTTich.find();
    res.json(ditichs);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách di tích' });
  }
};


export const getNoiBatDiTich = async (req: Request, res: Response) => {
  try {
    const { viTri } = req.query;

    const filter: any = { danhGia: { $gte: 4.5 } };
    if (viTri) {
      filter.viTri = viTri;
    }

    const diTichList = await DTTich.find(filter);
    const diTichIds = diTichList.map(dt => dt._id);

    const medias = await Media.find({
      doiTuong: 'DTTich',
      doiTuongId: { $in: diTichIds },
      type: 'image',
    });

    const mediaMap = new Map();
    medias.forEach(media => {
      mediaMap.set(media.doiTuongId.toString(), media.url);
    });

    const result = diTichList.map(dt => ({
      ...dt.toObject(),
      imageUrl: mediaMap.get(dt._id.toString()) || null,
    }));

    res.json(result);
  } catch (error) {
    console.error("Lỗi khi lấy di tích nổi bật:", error);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách di tích nổi bật' });
  }
};


export const getPhoBienDiTich = async (req: Request, res: Response) => {
  try {
    const diTichs = await DTTich.find({ danhGia: { $lt: 4.5 } });
    const ids = diTichs.map(dt => dt._id.toString());

    const medias = await Media.find({
      doiTuong: 'DTTich',
      doiTuongId: { $in: ids },
      type: 'image'
    });

    const mediaMap = new Map<string, string>();
    medias.forEach(m => mediaMap.set(m.doiTuongId, m.url));

    const result = diTichs.map(dt => ({
      ...dt.toObject(),
      imageUrl: mediaMap.get(dt._id.toString()) || null
    }));

    res.json(result);
  } catch (err) {
    console.error("Lỗi khi lấy di tích phổ biến:", err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getDiTichXemNhieu = async (req: Request, res: Response) => {
  try {
    const diTichs = await DTTich.find({ luotXem: { $gt: 200 } }).sort({ luotXem: -1 });
    const ids = diTichs.map(dt => dt._id.toString());

    const medias = await Media.find({
      doiTuong: 'DTTich',
      doiTuongId: { $in: ids },
      type: 'image'
    });

    const mediaMap = new Map<string, string>();
    medias.forEach(m => mediaMap.set(m.doiTuongId, m.url));

    const result = diTichs.map(dt => ({
      ...dt.toObject(),
      imageUrl: mediaMap.get(dt._id.toString()) || null
    }));

    res.json(result);
  } catch (error) {
    console.error("Lỗi khi lấy di tích xem nhiều:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};


export const createDiTich = async (req: Request, res: Response) => {
  try {
    const {
      ten,
      moTa,
      viTri,
      danhGia,
      huongDan,
      soNguoiDanhGia,
      luotXem,
      noiDungLuuTru,
      media
    } = req.body;

    const diTich = new DTTich({
      ten,
      moTa,
      viTri,
      danhGia,
      huongDan,
      soNguoiDanhGia,
      luotXem,
      thoiGianCapNhat: new Date(),
      noiDungLuuTru: noiDungLuuTru || null,
      media: media || []
    });

    const saved: HydratedDocument<IDTTich> = await diTich.save();
    const savedId = saved._id as Types.ObjectId; // 👈 Dòng này bạn thêm vào đây


    if (Array.isArray(media) && media.length > 0) {
      await Media.updateMany(
        { _id: { $in: media } },
        {
          $set: {
            doiTuong: 'DTTich',
            doiTuongId: saved._id.toString()
          }
        }
      );
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Lỗi khi tạo DiTich:', err);
    res.status(500).json({ error: 'Lỗi khi tạo di tích' });
  }
};

export const updateDiTich = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const {
      ten,
      moTa,
      viTri,
      danhGia,
      huongDan,
      noiDungLuuTru,
      media
    } = req.body;

    const diTich = await DTTich.findById(id);
    if (!diTich) {
      res.status(404).json({ error: 'Di tích không tồn tại' });
      return;
    }

    if (ten !== undefined) diTich.ten = ten;
    if (moTa !== undefined) diTich.moTa = moTa;
    if (viTri !== undefined) diTich.viTri = viTri;
    if (danhGia !== undefined) diTich.danhGia = danhGia;
    if (huongDan !== undefined) diTich.huongDan = huongDan;
    if (media !== undefined) diTich.media = media;


    const updated = await diTich.save();

    if (Array.isArray(media) && media.length > 0) {
      await Media.updateMany(
        { _id: { $in: media } },
        {
          $set: {
            doiTuong: 'DTTich',
            doiTuongId: diTich._id.toString()
          }
        }
      );
    }

    res.json(updated);
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật DiTich:', err);
    res.status(500).json({ error: 'Lỗi khi cập nhật di tích' });
  }
};

export const getDiTichById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const ditich = await DTTich.findById(id);
    if (!ditich) {
      res.status(404).json({ error: "Không tìm thấy di tích" });
      return;
    }

    const media = await Media.findOne({
      doiTuong: "DTTich",
      doiTuongId: id,
      type: "image",
    });

    const result = {
      ...ditich.toObject(),
      imageUrl: media?.url || null,
    };

    res.json(result);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết di tích:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};
export const searchDiTichByTen = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({ error: 'Thiếu từ khóa tìm kiếm' });
      return;
    }

    // Tìm các di tích có tên chứa chuỗi q (không phân biệt hoa thường)
    const regex = new RegExp(q, 'i');
    const ditichs = await DTTich.find({ ten: regex });

    // Lấy media tương ứng
    const ids = ditichs.map(dt => dt._id.toString());
    const medias = await Media.find({
      doiTuong: 'DTTich',
      doiTuongId: { $in: ids },
      type: 'image'
    });

    const mediaMap = new Map<string, string>();
    medias.forEach(m => mediaMap.set(m.doiTuongId, m.url));

    const result = ditichs.map(dt => ({
      ...dt.toObject(),
      imageUrl: mediaMap.get(dt._id.toString()) || null
    }));

    res.json(result);
  } catch (error) {
    console.error('❌ Lỗi khi tìm kiếm di tích:', error);
    res.status(500).json({ error: 'Lỗi khi tìm kiếm di tích' });
  }
};


export const tangLuotXemDiTich = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const ditich = await DTTich.findById(id);
    if (!ditich) {
      res.status(404).json({ error: 'Không tìm thấy di tích' });
      return;
    }

    ditich.luotXem = (ditich.luotXem || 0) + 1;
    await ditich.save();

    res.status(200).json({ success: true, luotXem: ditich.luotXem });
  } catch (err) {
    console.error('❌ Lỗi khi tăng lượt xem:', err);
    res.status(500).json({ error: 'Lỗi server khi tăng lượt xem' });
  }
};

export const danhGiaDiTich = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; 
    const { diem, userId } = req.body; 

    console.log('DiTich ID:', id);
    console.log('Điểm đánh giá:', diem);
    console.log('UserId:', userId);
    if (!diem || typeof diem !== 'number' || diem < 1 || diem > 5) {
      res.status(400).json({ message: "Điểm đánh giá phải là số từ 1 đến 5" });
      return;
    }

    const ditich = await DTTich.findById(id);
    if (!ditich) {
      res.status(404).json({ message: "Không tìm thấy di tích" });
      return;
    }

    const userRating = ditich.danhGiaNguoiDung?.find((dg) => dg.userId === userId);
    if (userRating) {
      userRating.diem = diem;
    } else {
      ditich.danhGiaNguoiDung?.push({ userId, diem });
    }

    const totalRating = ditich.danhGiaNguoiDung?.reduce((sum, dg) => sum + dg.diem, 0) || 0;
    const avgRating = totalRating / (ditich.danhGiaNguoiDung?.length || 1);

    ditich.danhGia = avgRating;
    ditich.soNguoiDanhGia = ditich.danhGiaNguoiDung?.length || 0;

    await ditich.save();

    res.status(200).json({
      message: "Đánh giá thành công",
      danhGia: parseFloat(avgRating.toFixed(1)),
      soNguoiDanhGia: ditich.soNguoiDanhGia,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Lỗi đánh giá:", err.message);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};


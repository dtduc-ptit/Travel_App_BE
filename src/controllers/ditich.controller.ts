import { Request, Response } from 'express';
import { DTTich } from '../models/ditich.model';
import { Media } from '../models/media.model';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { IDTTich } from '../models/ditich.model';
import mongoose from 'mongoose';
import { IDanhGiaNguoiDung } from '../models/ditich.model';
import { NguoiDung } from '../models/nguoidung.model';
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
    const diTichId = req.params.id;
    const { userId, diem, binhLuan } = req.body;

    const diTich = await DTTich.findById(diTichId);
    if (!diTich) {
      res.status(404).json({ message: 'Không tìm thấy di tích' });
      return;
    }

    if (diem < 1 || diem > 5) {
      res.status(400).json({ message: 'Điểm đánh giá phải từ 1 đến 5' });
      return;
    }

    if (!diTich.danhGiaNguoiDung) {
      diTich.danhGiaNguoiDung = [];
    }

    const danhGiaMoi: IDanhGiaNguoiDung = {
      userId,
      diem,
      binhLuan,
    };

    const existingReviewIndex = diTich.danhGiaNguoiDung.findIndex(d => d.userId === userId);
    if (existingReviewIndex !== -1) {
      // Cập nhật đánh giá cũ
      diTich.danhGiaNguoiDung[existingReviewIndex] = danhGiaMoi;
    } else {
      diTich.danhGiaNguoiDung.push(danhGiaMoi);
    }

    const soNguoiDanhGia = diTich.danhGiaNguoiDung.length;
    const tongDiem = diTich.danhGiaNguoiDung.reduce((sum, item) => sum + item.diem, 0);
    const diemTrungBinh = tongDiem / soNguoiDanhGia;

    diTich.danhGia = diemTrungBinh;
    diTich.soNguoiDanhGia = soNguoiDanhGia;

    await diTich.save();

    res.json({
      message: 'Đánh giá thành công',
      diemTrungBinh,
      danhGiaNguoiDung: diTich.danhGiaNguoiDung,
    });
  } catch (err) {
    console.error('❌ Lỗi khi đánh giá di tích:', err);
    res.status(500).json({ error: 'Lỗi khi đánh giá di tích' });
  }
};



export const layDanhGiaDiTich = async (req: Request, res: Response): Promise<void> => {
  try {
    const ditichId = req.params.id;
    
    const ditich = await DTTich.findById(ditichId);
    if (!ditich) {
      res.status(404).json({ message: 'Không tìm thấy di tích' });
      return;
    }

    const danhGiaList = ditich.danhGiaNguoiDung || [];

    const userIds = danhGiaList.map(dg => dg.userId);

    const nguoiDungs = await NguoiDung.find({ _id: { $in: userIds } });

    const danhGiaChiTiet = danhGiaList.map(dg => {
      const user = nguoiDungs.find(u => (u._id as mongoose.Types.ObjectId).toString() === dg.userId);
      return {
        userId: dg.userId,
        ten: user ? user.ten : 'Ẩn danh',
        anhDaiDien: user ? user.anhDaiDien : null,
        diem: dg.diem,
        binhLuan: dg.binhLuan,
      };
    });

    res.json({
      danhGia: ditich.danhGia,
      soNguoiDanhGia: ditich.soNguoiDanhGia,
      chiTietDanhGia: danhGiaChiTiet,
    });
  } catch (err) {
    console.error('Lỗi lấy đánh giá:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

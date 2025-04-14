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
    const filter = req.query.diaDiem ? { diaDiem: req.query.diaDiem } : {};

    const diTichList = await DTTich.find({
      danhGia: { $gte: 4.5 },
      ...filter,
    });

    const ids = diTichList.map(dt => dt._id.toString());

    const medias = await Media.find({
      doiTuong: 'DTTich',
      doiTuongId: { $in: ids },
      type: 'image',
    });

    const mediaMap = new Map<string, string>();
    medias.forEach(m => {
      mediaMap.set(m.doiTuongId, m.url);
    });

    const result = diTichList.map(dt => ({
      _id: dt._id,
      ten: dt.ten,
      imageUrl: mediaMap.get(dt._id.toString()) || '',
    }));

    res.json(result);
  } catch (error) {
    console.error('Lỗi lấy di tích nổi bật:', error);
    res.status(500).json({ error: 'Lỗi server' });
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
      lichSu,
      danhGia,
      diaDiem,
      loai,
      huongDan,
      luotXem,
      noiDungLuuTru,
      media
    } = req.body;

    const diTich = new DTTich({
      ten,
      moTa,
      viTri,
      lichSu,
      danhGia,
      diaDiem,
      loai,
      huongDan,
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
      lichSu,
      danhGia,
      diaDiem,
      loai,
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

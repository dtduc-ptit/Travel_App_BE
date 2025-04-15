import { Request, Response } from 'express';
import { SuKien } from '../models/sukien.model';
import { Media } from '../models/media.model';
import mongoose from "mongoose";


export const getAllSuKien = async (req: Request, res: Response) => {
  try {
    const sukien = await SuKien.find();
    res.json(sukien);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách sự kiện' });
  }
};

export const getNoiBatSuKien = async (req: Request, res: Response) => {
  try {
    const { diaDiem } = req.query;
    const filter: any = { danhGia: { $gte: 4 } };
    if (diaDiem) filter.diaDiem = diaDiem;

    const suKiens = await SuKien.find(filter);
    const ids = suKiens.map(sk => sk._id);

    const medias = await Media.find({
      doiTuong: 'SuKien',
      doiTuongId: { $in: ids },
      type: 'image',
    });

    const mediaMap = new Map();
    medias.forEach(media => {
      mediaMap.set(media.doiTuongId.toString(), media.url);
    });

    const result = suKiens.map(sk => ({
      ...sk.toObject(),
      imageUrl: mediaMap.get(sk._id.toString()) || null,
    }));

    res.json(result);
  } catch (err) {
    console.error("Lỗi khi lấy sự kiện nổi bật:", err);
    res.status(500).json({ error: 'Lỗi khi lấy sự kiện nổi bật' });
  }
};

export const getPhoBienSuKien = async (req: Request, res: Response) => {
  try {
    const suKiens = await SuKien.find({ danhGia: { $lt: 4 } });
    const ids = suKiens.map(sk => sk._id);

    const medias = await Media.find({
      doiTuong: 'SuKien',
      doiTuongId: { $in: ids },
      type: 'image',
    });

    const mediaMap = new Map();
    medias.forEach(media => {
      mediaMap.set(media.doiTuongId.toString(), media.url);
    });

    const result = suKiens.map(sk => ({
      ...sk.toObject(),
      imageUrl: mediaMap.get(sk._id.toString()) || null,
    }));

    res.json(result);
  } catch (err) {
    console.error("Lỗi khi lấy sự kiện phổ biến:", err);
    res.status(500).json({ error: 'Lỗi khi lấy sự kiện phổ biến' });
  }
};

export const getSuKienXemNhieu = async (req: Request, res: Response) => {
  try {
    const suKiens = await SuKien.find({ luotXem: { $gt: 200 } }).sort({ luotXem: -1 });

    const ids = suKiens.map(sk => sk._id);

    const medias = await Media.find({
      doiTuong: 'SuKien',
      doiTuongId: { $in: ids },
      type: 'image',
    });

    const mediaMap = new Map();
    medias.forEach(media => {
      mediaMap.set(media.doiTuongId.toString(), media.url);
    });

    const result = suKiens.map(sk => ({
      ...sk.toObject(),
      imageUrl: mediaMap.get(sk._id.toString()) || null,
    }));

    res.json(result);
  } catch (err) {
    console.error("Lỗi khi lấy sự kiện xem nhiều:", err);
    res.status(500).json({ error: 'Lỗi khi lấy sự kiện xem nhiều' });
  }
};

export const getSuKienById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const suKien = await SuKien.findById(id);
    if (!suKien) {
      res.status(404).json({ error: 'Không tìm thấy sự kiện' });
      return;
    }

    const media = await Media.findOne({
      doiTuong: 'SuKien',
      doiTuongId: id,
      type: 'image',
    });

    res.json({
      ...suKien.toObject(),
      imageUrl: media?.url || null,
    });
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết sự kiện:", err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const createSuKien = async (req: Request, res: Response) => {
  try {
    const {
      ten,
      moTa,
      thoiGianBatDau,
      thoiGianKetThuc,
      thoiGianCapNhat,
      diaDiem,
      danhGia,
      luotXem,
      huongDan,
      noiDungLuuTruId,
      media
    } = req.body;

    const suKien = new SuKien({
      ten,
      moTa,
      thoiGianBatDau,
      thoiGianKetThuc,
      thoiGianCapNhat,
      diaDiem,
      danhGia,
      luotXem,
      huongDan,
      noiDungLuuTruId,
      media: media || [],
    });

    const saved = await suKien.save();

    if (Array.isArray(media) && media.length > 0) {
      await Media.updateMany(
        { _id: { $in: media } },
        {
          $set: {
            doiTuong: 'SuKien',
            doiTuongId: saved._id.toString(),
          },
        }
      );
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Lỗi khi tạo SuKien:', err);
    res.status(500).json({ error: 'Lỗi khi tạo sự kiện' });
  }
};

export const updateSuKien = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      ten,
      moTa,
      thoiGianBatDau,
      thoiGianKetThuc,
      thoiGianCapNhat,
      diaDiem,
      danhGia,
      luotXem,
      huongDan,
      noiDungLuuTruId,
      media
    } = req.body;

    const suKien = await SuKien.findById(id);
    if (!suKien) {
      res.status(404).json({ error: 'Không tìm thấy sự kiện' });
      return;
    }

    if (ten !== undefined) suKien.ten = ten;
    if (moTa !== undefined) suKien.moTa = moTa;
    if (thoiGianBatDau !== undefined) suKien.thoiGianBatDau = thoiGianBatDau;
    if (thoiGianKetThuc !== undefined) suKien.thoiGianKetThuc = thoiGianKetThuc;
    if (thoiGianCapNhat !== undefined) suKien.thoiGianCapNhat = thoiGianCapNhat;
    if (diaDiem !== undefined) suKien.diaDiem = diaDiem;
    if (danhGia !== undefined) suKien.danhGia = danhGia;
    if (luotXem !== undefined) suKien.luotXem = luotXem;
    if (huongDan !== undefined) suKien.huongDan = huongDan;
    if (noiDungLuuTruId !== undefined) suKien.noiDungLuuTruId = noiDungLuuTruId;
    if (media !== undefined) suKien.media = media;

    const updated = await suKien.save();

    if (Array.isArray(media) && media.length > 0) {
      await Media.updateMany(
        { _id: { $in: media } },
        {
          $set: {
            doiTuong: 'SuKien',
            doiTuongId: suKien._id.toString(),
          },
        }
      );
    }

    res.json(updated);
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật SuKien:', err);
    res.status(500).json({ error: 'Lỗi khi cập nhật sự kiện' });
  }
};

export const tangLuotXemSuKien = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const suKien = await SuKien.findById(id);
    if (!suKien) {
      res.status(404).json({ error: 'Không tìm thấy sự kiện' });
      return;
    }

    suKien.luotXem = (suKien.luotXem || 0) + 1;
    await suKien.save();

    res.status(200).json({ success: true, luotXem: suKien.luotXem });
  } catch (err) {
    console.error('❌ Lỗi khi tăng lượt xem:', err);
    res.status(500).json({ error: 'Lỗi server khi tăng lượt xem' });
  }
};
export const searchSuKienByTen = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({ error: 'Thiếu từ khóa tìm kiếm' });
      return;
    }

    // Tìm các sự kiện có tên chứa chuỗi q (không phân biệt hoa thường)
    const regex = new RegExp(q, 'i');
    const suKiens = await SuKien.find({ ten: regex });

    // Lấy media tương ứng
    const ids = suKiens.map(sk => sk._id.toString());
    const medias = await Media.find({
      doiTuong: 'SuKien',
      doiTuongId: { $in: ids },
      type: 'image',
    });

    const mediaMap = new Map<string, string>();
    medias.forEach(m => mediaMap.set(m.doiTuongId, m.url));

    const result = suKiens.map(sk => ({
      ...sk.toObject(),
      imageUrl: mediaMap.get(sk._id.toString()) || null
    }));

    res.json(result);
  } catch (error) {
    console.error('❌ Lỗi khi tìm kiếm sự kiện:', error);
    res.status(500).json({ error: 'Lỗi khi tìm kiếm sự kiện' });
  }
};

export const getSuKienSapDienRa = async (req: Request, res: Response) => {
  try {
    const today = new Date();

    const suKiens = await SuKien.find().sort({ thoiGianBatDau: 1 });

    // Chuyển đổi chuỗi thoiGianBatDau => Date để so sánh
    const upcomingEvents = suKiens.filter(sk => {
      const [day, month, year] = sk.thoiGianBatDau.split('/');
      const eventDate = new Date(`${year}-${month}-${day}`);
      return eventDate >= today;
    });

    const ids = upcomingEvents.map(sk => sk._id);

    const medias = await Media.find({
      doiTuong: 'SuKien',
      doiTuongId: { $in: ids },
      type: 'image',
    });

    const mediaMap = new Map();
    medias.forEach(media => {
      mediaMap.set(media.doiTuongId.toString(), media.url);
    });

    const result = upcomingEvents.map(sk => ({
      ...sk.toObject(),
      imageUrl: mediaMap.get(sk._id.toString()) || null,
    }));

    res.json(result);
  } catch (err) {
    console.error("Lỗi khi lấy sự kiện sắp diễn ra:", err);
    res.status(500).json({ error: 'Lỗi khi lấy sự kiện sắp diễn ra' });
  }
};
export const getAllSuKienSorted = async (req: Request, res: Response) => {
  try {
    // Lấy toàn bộ sự kiện
    const suKiens = await SuKien.find();

    // Sắp xếp theo thời gian: chuyển string → Date để so sánh/sắp xếp
    const sortedSuKiens = suKiens
      .map(sk => {
        const [day, month, year] = sk.thoiGianBatDau.split('/');
        const eventDate = new Date(`${year}-${month}-${day}`);
        return { ...sk.toObject(), eventDate };
      })
      .sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());

    // Lấy danh sách ID
    const ids = sortedSuKiens.map(sk => sk._id);

    // Tìm media image của các sự kiện
    const medias = await Media.find({
      doiTuong: 'SuKien',
      doiTuongId: { $in: ids },
      type: 'image',
    });

    // Map media vào đúng sự kiện
    const mediaMap = new Map();
    medias.forEach(media => {
      mediaMap.set(media.doiTuongId.toString(), media.url);
    });

    // Gắn imageUrl cho mỗi sự kiện
    const result = sortedSuKiens.map(sk => ({
      ...sk,
      imageUrl: mediaMap.get(sk._id.toString()) || null,
    }));

    res.json(result);
  } catch (err) {
    console.error("Lỗi khi lấy tất cả sự kiện:", err);
    res.status(500).json({ error: 'Lỗi khi lấy tất cả sự kiện' });
  }
};
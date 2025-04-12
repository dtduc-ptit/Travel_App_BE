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
    const phongTucs = await PhongTuc.find({ danhGia: { $gte: 4 } });
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

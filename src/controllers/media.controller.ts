import { Request, Response } from 'express';
import { Media } from '../models/media.model';
import { PhongTuc } from '../models/phongtuc.model'; // import thêm

export const createMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, url, doiTuong, doiTuongId, moTa } = req.body;

    // Validate loại đối tượng
    if (!['SuKien', 'DTTich', 'PhongTuc'].includes(doiTuong)) {
      res.status(400).json({ error: 'Loại đối tượng không hợp lệ' });
      return;
    }

    // Nếu là PhongTuc thì kiểm tra ID tồn tại
    if (doiTuong === 'PhongTuc') {
      const exists = await PhongTuc.exists({ _id: doiTuongId });
      if (!exists) {
        res.status(400).json({ error: 'PhongTuc với ID này không tồn tại' });
        return;
      }
    }

    // Tạo media mới
    const media = new Media({ type, url, doiTuong, doiTuongId, moTa });
    await media.save();

    // Nếu là PhongTuc, gắn mediaId vào media[]
    if (doiTuong === 'PhongTuc') {
      await PhongTuc.findByIdAndUpdate(doiTuongId, {
        $push: { media: media._id }
      });
    }

    res.status(201).json(media);
  } catch (err) {
    console.error('❌ Lỗi khi tạo Media:', err);
    res.status(500).json({ error: 'Lỗi khi tạo media' });
  }
};
export const getAllMedia = async (req: Request, res: Response) => {
  try {
    const media = await Media.find();
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách medias' });
  }
};
import { Request, Response } from 'express';
import { Media } from '../models/media.model';
import { PhongTuc } from '../models/phongtuc.model';
import { DTTich } from '../models/ditich.model';
import { SuKien } from '../models/sukien.model';

export const createMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, url, doiTuong, doiTuongId, moTa } = req.body;

    // 1. Validate loại đối tượng
    const validTypes = ['SuKien', 'DTTich', 'PhongTuc'];
    if (!validTypes.includes(doiTuong)) {
      res.status(400).json({ error: 'Loại đối tượng không hợp lệ' });
      return;
    }

    // 2. Kiểm tra ID đối tượng có tồn tại không
    let doiTuongModel: any;
    if (doiTuong === 'PhongTuc') doiTuongModel = PhongTuc;
    else if (doiTuong === 'DTTich') doiTuongModel = DTTich;
    else if (doiTuong === 'SuKien') doiTuongModel = SuKien;

    const exists = await doiTuongModel.exists({ _id: doiTuongId });
    if (!exists) {
      res.status(400).json({ error: `${doiTuong} với ID này không tồn tại` });
      return;
    }

    // 3. Tạo media mới
    const media = new Media({ type, url, doiTuong, doiTuongId, moTa });
    await media.save();

    // 4. Gắn media._id vào media[] của đối tượng tương ứng
    await doiTuongModel.findByIdAndUpdate(doiTuongId, {
      $push: { media: media._id }
    });

    res.status(201).json(media);
  } catch (err) {
    console.error('❌ Lỗi khi tạo Media:', err);
    res.status(500).json({ error: 'Lỗi khi tạo media' });
  }
};

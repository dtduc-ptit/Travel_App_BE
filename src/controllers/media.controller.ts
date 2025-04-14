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

export const getMediaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const media = await Media.findById(id);
    if (!media) {
      res.status(404).json({ error: 'Không tìm thấy media' });
      return;
    }

    res.status(200).json(media);
  } catch (err) {
    console.error('❌ Lỗi khi lấy media:', err);
    res.status(500).json({ error: 'Lỗi server khi lấy media' });
  }
};


export const updateMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const mediaId = req.params.id;
    const { type, url, doiTuong, doiTuongId, moTa } = req.body;

    // 1. Tìm media cũ
    const media = await Media.findById(mediaId);
    if (!media) {
      res.status(404).json({ error: 'Media không tồn tại' });
      return;
    }

    const doiTuongCu = media.doiTuong;
    const doiTuongIdCu = media.doiTuongId;

    // 2. Nếu đổi đối tượng, cần xử lý ref cũ và mới
    if (doiTuong && doiTuongId && (doiTuong !== doiTuongCu || doiTuongId !== doiTuongIdCu)) {
      const removeFromOld = async () => {
        if (doiTuongCu === 'PhongTuc') {
          await PhongTuc.findByIdAndUpdate(doiTuongIdCu, { $pull: { media: media._id } });
        } else if (doiTuongCu === 'DTTich') {
          await DTTich.findByIdAndUpdate(doiTuongIdCu, { $pull: { media: media._id } });
        } else if (doiTuongCu === 'SuKien') {
          await SuKien.findByIdAndUpdate(doiTuongIdCu, { $pull: { media: media._id } });
        }
      };

      const addToNew = async () => {
        if (doiTuong === 'PhongTuc') {
          const exists = await PhongTuc.exists({ _id: doiTuongId });
          if (!exists) {
            res.status(400).json({ error: 'PhongTuc mới không tồn tại' });
            return;
          }
          await PhongTuc.findByIdAndUpdate(doiTuongId, { $addToSet: { media: media._id } });
        } else if (doiTuong === 'DTTich') {
          const exists = await DTTich.exists({ _id: doiTuongId });
          if (!exists) {
            res.status(400).json({ error: 'DTTich mới không tồn tại' });
            return;
          }
          await DTTich.findByIdAndUpdate(doiTuongId, { $addToSet: { media: media._id } });
        } else if (doiTuong === 'SuKien') {
          const exists = await SuKien.exists({ _id: doiTuongId });
          if (!exists) {
            res.status(400).json({ error: 'SuKien mới không tồn tại' });
            return;
          }
          await SuKien.findByIdAndUpdate(doiTuongId, { $addToSet: { media: media._id } });
        }
      };

      await removeFromOld();
      await addToNew();

      media.doiTuong = doiTuong;
      media.doiTuongId = doiTuongId;
    }

    // 3. Cập nhật các trường còn lại nếu có
    if (type) media.type = type;
    if (url) media.url = url;
    if (moTa !== undefined) media.moTa = moTa;

    await media.save();

    res.status(200).json(media);
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật media:", err);
    res.status(500).json({ error: "Lỗi khi cập nhật media" });
  }
};


export const getMediaByDoiTuong = async (req: Request, res: Response): Promise<void> => {
try {
  const { doiTuong, doiTuongId, type } = req.query;

  // Kiểm tra các tham số bắt buộc
  if (!doiTuong || !doiTuongId || !type) {
    res.status(400).json({ error: "Thiếu thông tin doiTuong, doiTuongId hoặc type" });
    return;
  }

  // Xác nhận loại đối tượng hợp lệ
  const validTargets = ["PhongTuc", "SuKien", "DTTich"];
  if (!validTargets.includes(String(doiTuong))) {
    res.status(400).json({ error: "Loại đối tượng không hợp lệ" });
    return;
  }

  // Truy vấn Media phù hợp
  const mediaList = await Media.find({
    doiTuong: doiTuong,
    doiTuongId: doiTuongId,
    type: type,
  }).sort({ createdAt: -1 }); // sắp xếp mới nhất lên đầu

  res.json(mediaList);
} catch (err) {
  console.error("❌ Lỗi khi lấy media theo đối tượng:", err);
  res.status(500).json({ error: "Lỗi server khi lấy media" });
}
};
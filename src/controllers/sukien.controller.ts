import { Request, Response } from 'express';
import { SuKien } from '../models/sukien.model';
import { Media } from '../models/media.model';
import { NguoiDung } from '../models/nguoidung.model';
import mongoose, { HydratedDocument } from 'mongoose';

// Define the interface for danhGiaNguoiDung to match the schema
interface IDanhGiaNguoiDung {
  userId: string;
  diem: number;
  binhLuan: string;
}

// Define the interface for SuKien document to improve type safety
interface ISuKien extends HydratedDocument<mongoose.Document> {
  ten: string;
  moTa?: string;
  thoiGianBatDau: string;
  thoiGianKetThuc?: string;
  thoiGianCapNhat?: string;
  diaDiem?: string;
  danhGia: number;
  soNguoiDanhGia: number;
  danhGiaNguoiDung: IDanhGiaNguoiDung[];
  luotXem: number;
  huongDan?: string;
  noiDungLuuTruId?: mongoose.Types.ObjectId;
  media: mongoose.Types.ObjectId[];
}

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
      camNang,
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
      camNang,
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
      camNang,
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
    if (camNang !== undefined) suKien.camNang = camNang;
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

    const regex = new RegExp(q, 'i');
    const suKiens = await SuKien.find({ ten: regex });

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
    const suKiens = await SuKien.find();

    const sortedSuKiens = suKiens
      .map(sk => {
        const [day, month, year] = sk.thoiGianBatDau.split('/');
        const eventDate = new Date(`${year}-${month}-${day}`);
        return { ...sk.toObject(), eventDate };
      })
      .sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());

    const ids = sortedSuKiens.map(sk => sk._id);

    const medias = await Media.find({
      doiTuong: 'SuKien',
      doiTuongId: { $in: ids },
      type: 'image',
    });

    const mediaMap = new Map();
    medias.forEach(media => {
      mediaMap.set(media.doiTuongId.toString(), media.url);
    });

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

export const danhGiaSuKien = async (req: Request, res: Response): Promise<void> => {
  try {
    const suKienId = req.params.id;
    const { userId, diem, binhLuan } = req.body;

    // Kiểm tra xem sự kiện có tồn tại hay không
    const suKien: ISuKien | null = await SuKien.findById(suKienId);
    if (!suKien) {
      res.status(404).json({ message: 'Không tìm thấy sự kiện' });
      return;
    }

    // Kiểm tra điểm đánh giá hợp lệ (từ 1 đến 5)
    if (diem < 1 || diem > 5) {
      res.status(400).json({ message: 'Điểm đánh giá phải từ 1 đến 5' });
      return;
    }

    // Kiểm tra nếu danhGiaNguoiDung không tồn tại, gán mảng rỗng
    if (!suKien.danhGiaNguoiDung) {
      suKien.danhGiaNguoiDung = [];
    }

    // Tạo đánh giá mới của người dùng
    const danhGiaMoi: IDanhGiaNguoiDung = {
      userId,
      diem,
      binhLuan,
    };

    // Kiểm tra nếu người dùng đã đánh giá, thì cập nhật đánh giá cũ
    const existingReviewIndex = suKien.danhGiaNguoiDung.findIndex(d => d.userId === userId);
    if (existingReviewIndex !== -1) {
      suKien.danhGiaNguoiDung[existingReviewIndex] = danhGiaMoi;
    } else {
      suKien.danhGiaNguoiDung.push(danhGiaMoi);
    }

    // Cập nhật lại số lượng người đánh giá và điểm trung bình
    const soNguoiDanhGia = suKien.danhGiaNguoiDung.length;
    const tongDiem = suKien.danhGiaNguoiDung.reduce((sum, item) => sum + item.diem, 0);
    const diemTrungBinh = tongDiem / soNguoiDanhGia;

    // Cập nhật điểm trung bình và số người đánh giá
    suKien.danhGia = diemTrungBinh;
    suKien.soNguoiDanhGia = soNguoiDanhGia;

    // Lưu lại đánh giá vào sự kiện
    await suKien.save();

    // Trả về kết quả với điểm trung bình mới và danh sách đánh giá
    res.json({
      message: 'Đánh giá thành công',
      diemTrungBinh,
      danhGiaNguoiDung: suKien.danhGiaNguoiDung,
    });
  } catch (err) {
    console.error('❌ Lỗi khi đánh giá sự kiện:', err);
    res.status(500).json({ error: 'Lỗi khi đánh giá sự kiện' });
  }
};

export const layDanhGiaSuKien = async (req: Request, res: Response): Promise<void> => {
  try {
   
    const suKienId = req.params.id;
    
    // Tìm sự kiện theo id
    const suKien: ISuKien | null = await SuKien.findById(suKienId);
    if (!suKien) {
      res.status(404).json({ message: 'Không tìm thấy sự kiện' });
      return;
    }

    // Lấy danh sách đánh giá
    const danhGiaList = suKien.danhGiaNguoiDung || [];

    // Lấy tất cả userIds từ các đánh giá
    const userIds = danhGiaList.map(dg => dg.userId);

    // Lấy thông tin người dùng từ database
    const nguoiDungs = await NguoiDung.find({ _id: { $in: userIds } });

    // Gộp thông tin đánh giá và người dùng
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

    // Trả về phản hồi JSON cho client
    res.json({
      danhGia: suKien.danhGia,
      soNguoiDanhGia: suKien.soNguoiDanhGia,
      chiTietDanhGia: danhGiaChiTiet,
    });
  } catch (err) {
    console.error('Lỗi lấy đánh giá sự kiện:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
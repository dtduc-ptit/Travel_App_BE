import { Request, Response } from 'express';
import { KienThuc } from '../models/kienthuc.model';
import mongoose from 'mongoose';

// GET /api/kienthuc
// Thay thế getAllKienThuc
export const getDanhSachKienThucTheoLoai = async (req: Request, res: Response) => {
   try {
     const [noibat, xemnhieu, docdao, moicapnhat] = await Promise.all([
       KienThuc.find({ daDuyet: true }).sort({ createdAt: -1 }).limit(10),
       KienThuc.find({ daDuyet: true } ).sort({ soLuotXem: -1 }).limit(10),
       KienThuc.find({ daDuyet: true, the: { $in: ["docdao"] } }).sort({ createdAt: -1 }).limit(10),
       KienThuc.find({ daDuyet: true }).sort({ createdAt: -1 }).limit(10),
     ]);
 
     res.json({ noibat, xemnhieu, docdao, moicapnhat });
   } catch (err) {
     console.error("❌ Lỗi khi lấy danh sách kiến thức:", err);
     res.status(500).json({ error: "Lỗi khi lấy danh sách kiến thức" });
   }
 };

// GET /api/kienthuc/noibat?the=vanhoa
export const getNoiBatKienThuc = async (req: Request, res: Response) => {
  try {
    const { the } = req.query;

    const filter: any = { daDuyet: true };
    if (the) filter.the = { $in: [the] }; // Tìm theo thể loại (the), không phải _id

    const kienThucList = await KienThuc.find(filter).sort({ createdAt: -1 }).limit(10);
    res.json(kienThucList);
  } catch (err) {
    console.error('❌ Lỗi khi lấy kiến thức nổi bật:', err);
    res.status(500).json({ error: 'Lỗi khi lấy kiến thức nổi bật' });
  }
};


// GET /api/kienthuc/phobien
export const getPhoBienKienThuc = async (req: Request, res: Response) => {
  try {
    const kienThucList = await KienThuc.find({ daDuyet: true })
      .sort({ createdAt: -1 }) // Mới đăng
      .limit(10);
    res.json(kienThucList);
  } catch (err) {
    console.error('❌ Lỗi khi lấy kiến thức phổ biến:', err);
    res.status(500).json({ error: 'Lỗi khi lấy kiến thức phổ biến' });
  }
};

// GET /api/kienthuc/xemnhieu
export const getKienThucXemNhieu = async (req: Request, res: Response) => {
   try {
     const kienThucList = await KienThuc.find()
       .sort({ soLuotXem: -1 }) // Sắp xếp giảm dần theo số lượt xem
       .limit(10); // Giới hạn 10 bài viết
 
     res.json(kienThucList);
   } catch (err) {
     console.error('❌ Lỗi khi lấy kiến thức xem nhiều:', err);
     res.status(500).json({ error: 'Lỗi khi lấy kiến thức xem nhiều' });
   }
 };

// GET /api/kienthuc/:id
export const getKienThucById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Đảm bảo rằng id là ObjectId
    let kienThuc;

    if (mongoose.Types.ObjectId.isValid(id)) {
      // Tìm theo _id nếu id là ObjectId
      kienThuc = await KienThuc.findById(id).populate('tacGia', 'hoTen email');
    } else {
      // Tìm theo category (the) nếu id không phải là ObjectId
      kienThuc = await KienThuc.findOne({ the: id }).populate('tacGia', 'hoTen email');
    }

    if (!kienThuc) {
      res.status(404).json({ error: 'Không tìm thấy kiến thức' });
      return;
    }

    res.json(kienThuc);
  } catch (err) {
    console.error('❌ Lỗi khi lấy chi tiết kiến thức:', err);
    res.status(500).json({ error: 'Lỗi khi lấy chi tiết kiến thức' });
  }
};


// PATCH /api/kienthuc/:id/luotxem
export const tangLuotXemKienThuc = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const kienThuc = await KienThuc.findById(id);
    if (!kienThuc) {
      res.status(404).json({ error: 'Không tìm thấy kiến thức' });
      return;
    }

    kienThuc.soLuotXem = (kienThuc.soLuotXem || 0) + 1;
    await kienThuc.save();

    res.status(200).json({ success: true, soLuotXem: kienThuc.soLuotXem });
  } catch (err) {
    console.error('❌ Lỗi khi tăng lượt xem:', err);
    res.status(500).json({ error: 'Lỗi server khi tăng lượt xem' });
  }
};

// POST /api/kienthuc
export const createKienThuc = async (req: Request, res: Response) => {
  try {
    const {
      tieuDe,
      noiDung,
      moTaNgan,
      tacGia,
      hinhAnh,
      the,
      daDuyet,
      videoUrl,
      audioUrl
    } = req.body;

    const kienThuc = new KienThuc({
      tieuDe,
      noiDung,
      moTaNgan,
      tacGia,
      hinhAnh: hinhAnh || [],
      the: the || [],
      daDuyet: daDuyet || false,
      videoUrl: videoUrl || "",
      audioUrl: audioUrl || ""
    });

    const saved = await kienThuc.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Lỗi khi tạo kiến thức:', err);
    res.status(500).json({ error: 'Lỗi khi tạo kiến thức' });
  }
};

// PATCH /api/kienthuc/:id
export const updateKienThuc = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const kienThuc = await KienThuc.findById(id);
    if (!kienThuc) {
      res.status(404).json({ error: 'Kiến thức không tồn tại' });
      return;
    }

    Object.assign(kienThuc, updateData);
    const updated = await kienThuc.save();

    res.json(updated);
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật kiến thức:', err);
    res.status(500).json({ error: 'Lỗi khi cập nhật kiến thức' });
  }
};

// get api/kienthuc/docdao

export const getDocDaoKienThuc = async (req: Request, res: Response) => {
  try {
    const { the } = req.query;

    const filter: any = { daDuyet: true };

    // Kiểm tra xem có tham số the truyền vào không, nếu có thì tìm kiếm theo thể loại 'docdao'
    if (the) {
      filter.the = { $in: ["docdao"] }; // Lọc các kiến thức có 'the' là 'docdao'
    }

    const kienThucList = await KienThuc.find(filter).sort({ createdAt: -1 }).limit(10);
    res.json(kienThucList);
  } catch (err) {
    console.error('❌ Lỗi khi lấy kiến thức độc đáo:', err);
    res.status(500).json({ error: 'Lỗi khi lấy kiến thức độc đáo' });
  }
};

// get api/kienthuc/docdao

export const getMoiCapNhatKienThuc = async (req: Request, res: Response) => {
  try {
    // Lọc các bài viết đã duyệt
    const kienThucList = await KienThuc.find({ daDuyet: true }).sort({ createdAt: -1 }).limit(10); // Giới hạn 10 bài viết mới nhất
    res.json(kienThucList);
  } catch (err) {
    console.error('❌ Lỗi khi lấy kiến thức mới cập nhật:', err);
    res.status(500).json({ error: 'Lỗi khi lấy kiến thức mới cập nhật' });
  }
};

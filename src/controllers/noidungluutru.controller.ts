import { Request, Response } from 'express';
import { NoiDungLuuTru } from '../models/noidungluutru.model'; 
import { DTTich } from '../models/ditich.model';
import { Media } from '../models/media.model';
import { PhongTuc } from '../models/phongtuc.model';
import { SuKien } from '../models/sukien.model';
import { KienThuc } from '../models/kienthuc.model';


export const createNoiDungLuuTru = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nguoiDung, loaiNoiDung, idNoiDung, moTa } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!nguoiDung || !loaiNoiDung || !idNoiDung) {
      res.status(400).json({
        message: 'Thiếu dữ liệu. Các trường bắt buộc: nguoiDung, loaiNoiDung, idNoiDung',
      });
      return;
    }

    // Kiểm tra loaiNoiDung có hợp lệ không
    const validLoaiNoiDung = ['SuKien', 'DiTich', 'PhongTuc','kienThuc'];
    if (!validLoaiNoiDung.includes(loaiNoiDung)) {
      res.status(400).json({
        message: `loaiNoiDung không hợp lệ. Phải là một trong: ${validLoaiNoiDung.join(', ')}`,
      });
      return;
    }

    const noiDungLuuTru = new NoiDungLuuTru({
      nguoiDung,
      loaiNoiDung,
      idNoiDung,
      moTa, // Không bắt buộc
    });

    const savedNoiDung = await noiDungLuuTru.save();
    res.status(201).json({
      message: 'Lưu nội dung thành công',
      noiDung: savedNoiDung,
    });
  } catch (err: any) {
    res.status(400).json({
      message: 'Lưu nội dung thất bại',
      error: err.message,
    });
  }
};

export const checkNoiDungLuuTru = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nguoiDung, loaiNoiDung, idNoiDung } = req.query;

    // Kiểm tra đầu vào
    if (!nguoiDung || !loaiNoiDung || !idNoiDung) {
      res.status(400).json({
        message: 'Thiếu tham số. Cần có nguoiDung, loaiNoiDung, idNoiDung.',
      });
      return;
    }

    const tonTai = await NoiDungLuuTru.findOne({
      nguoiDung: nguoiDung.toString(),
      loaiNoiDung: loaiNoiDung.toString(),
      idNoiDung: idNoiDung.toString(),
    });

    res.json({ daLuu: !!tonTai });
  } catch (err) {
    res.status(500).json({
      message: 'Lỗi server',
      error: (err as Error).message,
    });
  }
};


export const getDiTichDaLuu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nguoiDung } = req.query;

    if (!nguoiDung) {
      res.status(400).json({ message: 'Thiếu tham số nguoiDung' });
      return;
    }

    const danhSachLuu = await NoiDungLuuTru.find({
      nguoiDung,
      loaiNoiDung: 'DiTich',
    });

    const idDiTichs = danhSachLuu.map(item => item.idNoiDung);

    // Lấy thông tin địa điểm từ DTTich
    const diTichsFromDB = await DTTich.find({ _id: { $in: idDiTichs } }).select('ten viTri');

    // Lấy media liên quan đến các địa điểm
    const mediaList = await Media.find({
      doiTuong: "DTTich",
      doiTuongId: { $in: idDiTichs },
      type: "image",
    });

    // Gộp thông tin
    const diTichs = diTichsFromDB.map(diTich => {
      const noiDung = danhSachLuu.find(item => item.idNoiDung.toString() === diTich._id.toString());
      const media = mediaList.find(m => m.doiTuongId.toString() === diTich._id.toString());

      return {
        _id: diTich._id,
        ten: diTich.ten,
        viTri: diTich.viTri,
        moTa: noiDung?.moTa || null,
        imageUrl: media?.url || null,
      };
    });

    res.status(200).json({ diTichs });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: (err as Error).message });
  }
};


export const getPhongTucDaLuu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nguoiDung } = req.query;

    if (!nguoiDung) {
      res.status(400).json({ message: 'Thiếu tham số nguoiDung' });
      return;
    }

    // Danh sách lưu loại 'PhongTuc'
    const danhSachLuu = await NoiDungLuuTru.find({
      nguoiDung,
      loaiNoiDung: 'PhongTuc',
    });

    const idPhongTucs = danhSachLuu.map(item => item.idNoiDung);

    // Lấy thông tin phong tục từ bảng PhongTuc
    const phongTucFromDB = await PhongTuc.find({ _id: { $in: idPhongTucs } }).select('ten diaDiem');

    // Lấy media liên quan đến phong tục
    const mediaList = await Media.find({
      doiTuong: "PhongTuc",
      doiTuongId: { $in: idPhongTucs },
      type: "image",
    });

    // Gộp thông tin
    const phongTucs = phongTucFromDB.map(phongTuc => {
      const noiDung = danhSachLuu.find(item => item.idNoiDung.toString() === phongTuc._id.toString());
      const media = mediaList.find(m => m.doiTuongId.toString() === phongTuc._id.toString());

      return {
        _id: phongTuc._id,
        ten: phongTuc.ten,
        viTri: phongTuc.diaDiem,
        moTa: noiDung?.moTa || null,
        imageUrl: media?.url || null,
      };
    });

    res.status(200).json({ phongTucs });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: (err as Error).message });
  }
};

export const getSuKienDaLuu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nguoiDung } = req.query;

    if (!nguoiDung) {
      res.status(400).json({ message: 'Thiếu tham số nguoiDung' });
      return;
    }

    const danhSachLuu = await NoiDungLuuTru.find({
      nguoiDung,
      loaiNoiDung: 'SuKien',
    });

    const idSuKiens = danhSachLuu.map(item => item.idNoiDung);

    const suKienFromDB = await SuKien.find({ _id: { $in: idSuKiens } }).select('ten diaDiem');

    const mediaList = await Media.find({
      doiTuong: "SuKien",
      doiTuongId: { $in: idSuKiens },
      type: "image",
    });

    // Gộp thông tin
    const suKiens = suKienFromDB.map(suKien => {
      const noiDung = danhSachLuu.find(item => item.idNoiDung.toString() === suKien._id.toString());
      const media = mediaList.find(m => m.doiTuongId.toString() === suKien._id.toString());

      return {
        _id: suKien._id,
        ten: suKien.ten,
        viTri: suKien.diaDiem,
        moTa: noiDung?.moTa || null,
        imageUrl: media?.url || null,
      };
    });

    res.status(200).json({ suKiens });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: (err as Error).message });
  }
};

export const deleteNoiDungLuuTru = async (req: Request, res: Response): Promise<void> => {
  const { nguoiDung, loaiNoiDung, idNoiDung } = req.body;

  // Kiểm tra đầu vào
  if (!nguoiDung || !loaiNoiDung || !idNoiDung) {
    res.status(400).json({ message: 'Thiếu dữ liệu yêu cầu' });
    return;
  }

  try {
    const deleted = await NoiDungLuuTru.findOneAndDelete({
      nguoiDung,
      loaiNoiDung,
      idNoiDung
    });

    if (!deleted) {
      res.status(404).json({ message: 'Không tìm thấy mục lưu trữ để xoá' });
      return;
    }

    res.status(200).json({ message: 'Xoá thành công', deleted });
  } catch (err: any) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};


export const getNoiDungDaLuu = async (req: Request, res: Response) => {
  try {
    const { nguoiDung, loaiNoiDung } = req.query;

    // Validate input
    if (!nguoiDung || !loaiNoiDung) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu tham số bắt buộc: nguoiDung và loaiNoiDung'
      });
    }

    // Kiểm tra loại nội dung hợp lệ
    const validTypes = ['kienThuc', 'SuKien', 'DiTich', 'PhongTuc'];
    const loai = loaiNoiDung.toString();
    
    if (!validTypes.includes(loai)) {
      return res.status(400).json({
        success: false,
        message: `Loại nội dung không hợp lệ. Chấp nhận: ${validTypes.join(', ')}`
      });
    }

    // Xác định model tương ứng
    let model;
    switch (loai) {
      case 'kienThuc':
        model = KienThuc;
        break;
      case 'SuKien':
        model = SuKien;
        break;
      case 'DiTich':
        model = DTTich;
        break;
      case 'PhongTuc':
        model = PhongTuc;
        break;
      default:
        return res.status(400).json({ success: false, message: 'Loại không hợp lệ' });
    }

    // Truy vấn database với populate thủ công
    const savedContents = await NoiDungLuuTru.find({
      nguoiDung: nguoiDung.toString(),
      loaiNoiDung: loai
    })
    .populate<{
      idNoiDung: { tieuDe: string; hinhAnh: string[]; _id: string } | null;
    }>({
      path: 'idNoiDung',
      model: model,
      select: 'tieuDe hinhAnh'
    })
    .lean();

    // Format response với kiểm tra an toàn
    const formattedResults = savedContents.map(item => ({
      _id: item._id,
      tieuDe: item.idNoiDung?.tieuDe || 'Không có tiêu đề',
      hinhAnh: item.idNoiDung?.hinhAnh || [],
      idNoiDung: item.idNoiDung?._id || null,
      thoiGianLuu: item.thoiGianLuu
    }));

    res.status(200).json({
      success: true,
      data: formattedResults
    });

  } catch (error) {
    console.error('Lỗi khi lấy nội dung đã lưu:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};
import { Request, Response } from 'express';
import { NoiDungLuuTru } from '../models/noidungluutru.model'; 
import { DTTich } from '../models/ditich.model';

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
    const validLoaiNoiDung = ['SuKien', 'DiTich', 'PhongTuc', 'DiaDiem'];
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

export const getDiaDiemDaLuu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nguoiDung } = req.query;

    if (!nguoiDung) {
      res.status(400).json({ message: 'Thiếu tham số nguoiDung' });
      return;
    }

    // Tìm các nội dung lưu trữ loại "DiaDiem" của người dùng
    const danhSachLuu = await NoiDungLuuTru.find({
      nguoiDung,
      loaiNoiDung: 'DiaDiem',
    });

    // Lấy danh sách id của DiTich (địa điểm)
    const idDiaDiems = danhSachLuu.map(item => item.idNoiDung);

    // Lấy thông tin từ bảng DiTich
    const diaDiems = await DTTich.find({ _id: { $in: idDiaDiems } }).select('ten viTri');

    res.status(200).json({ diaDiems });
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

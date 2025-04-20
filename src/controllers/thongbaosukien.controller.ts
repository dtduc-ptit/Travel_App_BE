import { Request, Response } from 'express';
import { ThongBaoSuKien } from '../models/thongbaosukien.model';

export const layThongBaoTheoNguoiDung = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const thongBaos = await ThongBaoSuKien.find({ nguoiDung: userId })
      .populate('suKien', 'ten ngayBatDau') 
      .sort({ thoiGianGui: -1 });

    res.status(200).json(thongBaos);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const getSoLuongThongBaoChuaDoc = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId; // hoặc req.user._id nếu có auth
  
      const soLuongChuaDoc = await ThongBaoSuKien.countDocuments({
        nguoiDung: userId,
        daDoc: false
      });
  
      res.json({ soLuongChuaDoc });
    } catch (err) {
      console.error('Lỗi khi lấy thông báo chưa đọc:', err);
      res.status(500).json({ error: 'Lỗi server' });
    }
  };

  export const danhDauThongBaoDaDoc = async (req: Request, res: Response) => {
    try {
      const { idThongBao } = req.params;
  
      const thongBao = await ThongBaoSuKien.findByIdAndUpdate(
        idThongBao,
        { daDoc: true },
        { new: true }
      );
  
      if (!thongBao) {
        return res.status(404).json({ message: 'Không tìm thấy thông báo' });
      }
  
      return res.status(200).json({ message: 'Đã đánh dấu thông báo là đã đọc', thongBao });
    } catch (error) {
      console.error('Lỗi khi đánh dấu thông báo đã đọc:', error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  };

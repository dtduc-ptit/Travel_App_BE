import { Request, Response } from 'express';
import { LichTrinh } from '../models/lichtrinh.model';

export const createLichTrinh = async (req: Request, res: Response): Promise<any> => {
  try {
    const { tenLichTrinh, ngay, suKien, diTich, hoatDongs } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!tenLichTrinh || !ngay || !hoatDongs || !Array.isArray(hoatDongs) || hoatDongs.length === 0) {
      return res.status(400).json({ message: 'Thiếu dữ liệu bắt buộc hoặc không hợp lệ' });
    }

    // Tạo lịch trình
    const newLichTrinh = new LichTrinh({
      tenLichTrinh,
      ngay,
      suKien,
      diTich,
      hoatDongs,
    });

    const saved = await newLichTrinh.save();
    return res.status(201).json(saved);
  } catch (error: any) {
    return res.status(500).json({ message: 'Lỗi khi tạo lịch trình', error: error.message });
  }
};

// json tạo lịch trình mẫu 
// {
//     "tenLichTrinh": "Tham quan khu di tích lịch sử",
//     "ngay": "2025-04-20T00:00:00.000Z",
//     "suKien": null,
//     "diTich": "67fcc7edf874020fef98fe05",
//     "hoatDongs": [
//       {
//         "thoiGian": "08:30",
//         "noiDung": "Tập trung tại điểm hẹn",
//         "diaDiem": "Cổng chính công viên",
//         "ghiChu": "Đến sớm 10 phút"
//       },
//       {
//         "thoiGian": "09:00",
//         "noiDung": "Tham quan bảo tàng",
//         "diaDiem": "Bảo tàng lịch sử",
//         "ghiChu": ""
//       },
//       {
//         "thoiGian": "11:30",
//         "noiDung": "Ăn trưa",
//         "diaDiem": "Nhà hàng gần khu di tích",
//         "ghiChu": ""
//       }
//     ]
//   }
  
export const updateLichTrinh = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const { tenLichTrinh, ngay, suKien, diTich, hoatDongs } = req.body;
  
      const lichTrinh = await LichTrinh.findById(id);
      if (!lichTrinh) {
        return res.status(404).json({ message: 'Không tìm thấy lịch trình' });
      }
  
      // Cập nhật các trường nếu có trong request
      if (tenLichTrinh !== undefined) lichTrinh.tenLichTrinh = tenLichTrinh;
      if (ngay !== undefined) lichTrinh.ngay = ngay;
      if (hoatDongs !== undefined) lichTrinh.hoatDongs = hoatDongs;
  
      // Kiểm tra và cập nhật suKien - diTich theo logic: chỉ 1 cái có giá trị
      const newSuKien = suKien !== undefined ? suKien : lichTrinh.suKien;
      const newDiTich = diTich !== undefined ? diTich : lichTrinh.diTich;
  
      if ((newSuKien && newDiTich) || (!newSuKien && !newDiTich)) {
        return res.status(400).json({ message: 'Phải có đúng một trong hai: suKien hoặc diTich (không được cả hai, không được thiếu cả hai)' });
      }
  
      if (suKien !== undefined) lichTrinh.suKien = suKien;
      if (diTich !== undefined) lichTrinh.diTich = diTich;
  
      const updated = await lichTrinh.save();
      return res.status(200).json(updated);
    } catch (error: any) {
      return res.status(500).json({ message: 'Lỗi khi cập nhật lịch trình', error: error.message });
    }
  };

  export const getAllLichTrinh = async (req: Request, res: Response): Promise<any> => {
    try {
      const danhSachLichTrinh = await LichTrinh.find()
        .populate('suKien')    // Lấy thông tin chi tiết nếu có
        .populate('diTich')    // Lấy thông tin chi tiết nếu có
        .sort({ ngay: -1 });   // Sắp xếp theo ngày giảm dần (mới nhất trước)
  
      return res.status(200).json(danhSachLichTrinh);
    } catch (error: any) {
      return res.status(500).json({ message: 'Lỗi khi lấy danh sách lịch trình', error: error.message });
    }
  };

  export const getLichTrinhById = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
  
      const lichTrinh = await LichTrinh.findById(id)
        .populate('suKien')
        .populate('diTich');
  
      if (!lichTrinh) {
        return res.status(404).json({ message: 'Không tìm thấy lịch trình' });
      }
  
      return res.status(200).json(lichTrinh);
    } catch (error: any) {
      return res.status(500).json({ message: 'Lỗi khi lấy chi tiết lịch trình', error: error.message });
    }
  };

  export const getLichTrinhBySuKienId = async (req: Request, res: Response): Promise<any> => {
    try {
      const { suKienId } = req.params;
  
      const lichTrinhs = await LichTrinh.find({ suKien: suKienId })
        .populate('suKien')
        .populate('diTich')
        .sort({ ngay: -1 });
  
      return res.status(200).json(lichTrinhs);
    } catch (error: any) {
      return res.status(500).json({ message: 'Lỗi khi lấy lịch trình theo sự kiện', error: error.message });
    }
  };

  export const getLichTrinhByDiTichId = async (req: Request, res: Response): Promise<any> => {
    try {
      const { diTichId } = req.params;
  
      const lichTrinhs = await LichTrinh.find({ diTich: diTichId })
        .populate('suKien')
        .populate('diTich')
        .sort({ ngay: -1 });
  
      return res.status(200).json(lichTrinhs);
    } catch (error: any) {
      return res.status(500).json({ message: 'Lỗi khi lấy lịch trình theo di tích', error: error.message });
    }
  };
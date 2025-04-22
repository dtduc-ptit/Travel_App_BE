import express, { Request, Response } from 'express';
import {
  layThongBaoTheoNguoiDung,
  getSoLuongThongBaoChuaDoc,
  danhDauThongBaoDaDoc,
} from '../controllers/thongbaosukien.controller';

import { getThongBao, markAsRead } from '../controllers/thongbao.controller';
import { deleteLikeNotification } from '../controllers/thongbao.controller';

const router = express.Router();

// Lấy danh sách thông báo của người dùng
router.get('/congdong', getThongBao);

// Quan trọng: Route cụ thể phải đặt TRƯỚC route có params động
// Đánh dấu thông báo đã đọc
router.put('/congdong/:id/read', markAsRead);

router.get('/chuadoc/:userId', getSoLuongThongBaoChuaDoc);

router.patch(
    'congdong/:idThongBao/doc',
    danhDauThongBaoDaDoc as unknown as express.RequestHandler
  );
router.get('/:userId', layThongBaoTheoNguoiDung); // <-- Đặt sau cùng

// Xóa thông báo khi bỏ like
router.delete('/:nguoiGuiId/:baiVietId', async (req: Request, res: Response) => {
  try {
    const { nguoiGuiId, baiVietId } = req.params; // req.params được nhận diện đúng
    await deleteLikeNotification(nguoiGuiId, baiVietId);
    res.status(200).json({ message: 'Xóa thông báo thành công' }); // res.status được nhận diện là phương thức
  } catch (error) {
    console.error('Lỗi khi xóa thông báo qua API:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa thông báo' });
  }
});

export default router;

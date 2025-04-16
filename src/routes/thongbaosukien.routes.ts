import express from 'express';
import {
  layThongBaoTheoNguoiDung,
  getSoLuongThongBaoChuaDoc,
  danhDauThongBaoDaDoc,
} from '../controllers/thongbaosukien.controller';

const router = express.Router();

// Quan trọng: Route cụ thể phải đặt TRƯỚC route có params động
router.get('/chuadoc/:userId', getSoLuongThongBaoChuaDoc);

router.patch(
    '/:idThongBao/doc',
    danhDauThongBaoDaDoc as unknown as express.RequestHandler
  );
router.get('/:userId', layThongBaoTheoNguoiDung); // <-- Đặt sau cùng

export default router;

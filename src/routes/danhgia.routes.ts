import express from "express";
import {
  taoHoacCapNhatDanhGia,
  binhLuanDanhGia,
  layDanhGiaTheoDoiTuong,
  themBinhLuanDanhGia,
} from "../controllers/danhgia.controller";

const router = express.Router();

// [POST or PUT] - Tạo hoặc cập nhật đánh giá (1 lần duy nhất cho mỗi người/dối tượng)
router.post("/", taoHoacCapNhatDanhGia);

// [POST] - Bình luận vào đánh giá của người khác
router.post("/:danhGiaId/binhluan", binhLuanDanhGia);

// [GET] - Lấy tất cả đánh giá của 1 đối tượng cụ thể (di tích, sự kiện, phong tục)
router.get("/:doiTuongId", layDanhGiaTheoDoiTuong);
router.post('/:id/binhluan', themBinhLuanDanhGia);

export default router;

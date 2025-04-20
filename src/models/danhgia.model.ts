import mongoose from 'mongoose';

const binhLuanSchema = new mongoose.Schema({
  nguoiDung: { type: mongoose.Schema.Types.ObjectId, ref: "NguoiDung", required: true },
  noiDung: { type: String, required: true },
  thoiGian: { type: Date, default: Date.now },
}, { _id: true }); // Có _id để quản lý từng bình luận

const danhGiaSchema = new mongoose.Schema({
  nguoiDung: { type: mongoose.Schema.Types.ObjectId, ref: "NguoiDung", required: true },

  doiTuongId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "loaiDoiTuong" },
  loaiDoiTuong: {
    type: String,
    required: true,
    enum: ["DTTich", "SuKien", "PhongTuc"], 
  },

  diem: { type: Number, min: 1, max: 5, required: true },
  noiDung: { type: String, required: true },

  binhLuan: [binhLuanSchema],

  thoiGian: { type: Date, default: Date.now },
}, { timestamps: true });

export const DanhGia = mongoose.model('DanhGia', danhGiaSchema);

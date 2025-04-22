import mongoose, { Schema, Document } from 'mongoose';

export interface IThongBao extends Document {
  nguoiGui: mongoose.Types.ObjectId; // Người thực hiện hành động (like/bình luận)
  nguoiNhan: mongoose.Types.ObjectId; // Người sở hữu bài viết
  loai: 'LIKE' | 'COMMENT'; // Loại thông báo
  baiViet: mongoose.Types.ObjectId; // Bài viết liên quan
  noiDung: string; // Nội dung thông báo (e.g., "Người X đã thích bài viết của bạn")
  thoiGian: Date; // Thời gian tạo thông báo
  daDoc: boolean; // Trạng thái đã đọc
}

const ThongBaoSchema: Schema = new Schema({
  nguoiGui: { type: Schema.Types.ObjectId, ref: 'NguoiDung', required: true },
  nguoiNhan: { type: Schema.Types.ObjectId, ref: 'NguoiDung', required: true },
  loai: { type: String, enum: ['LIKE', 'COMMENT'], required: true },
  baiViet: { type: Schema.Types.ObjectId, ref: 'BaiViet', required: true },
  noiDung: { type: String, required: true },
  thoiGian: { type: Date, default: Date.now },
  daDoc: { type: Boolean, default: false },
});

export default mongoose.model<IThongBao>('ThongBao', ThongBaoSchema);
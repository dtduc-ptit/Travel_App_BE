import mongoose, { Schema } from 'mongoose';

const danhGiaNguoiDungSchema = new Schema(
  {
    userId: { type: String, required: true },
    diem: { type: Number, required: true, min: 1, max: 5 },
  },
  { _id: false }
);

const suKienSchema = new mongoose.Schema({
  ten: {
    type: String,
    required: [true, 'Tên sự kiện là bắt buộc'],
    trim: true,
    minlength: [2, 'Tên phải có ít nhất 2 ký tự'],
  },
  moTa: {
    type: String,
    trim: true,
  },
  thoiGianBatDau: {
    type: String,
    required: [true, 'Thời gian bắt đầu là bắt buộc'],
    match: [/^([0-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, 'Thời gian không hợp lệ (dd/mm/yyyy)'],
  },
  thoiGianKetThuc: {
    type: String,
    match: [/^([0-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, 'Thời gian không hợp lệ (dd/mm/yyyy)'],
  },
  thoiGianCapNhat: {
    type: String,
  },
  diaDiem: {
    type: String,
    trim: true,
  },
  danhGia: {
    type: Number,
    default: 0,
    min: [0, 'Đánh giá không được âm'],
    max: [5, 'Đánh giá tối đa là 5'],
  },
  soNguoiDanhGia: {
    type: Number,
    default: 0,
  },
  danhGiaNguoiDung: [danhGiaNguoiDungSchema],
  luotXem: {
    type: Number,
    default: 0,
    min: [0, 'Lượt xem không được âm'],
  },
  huongDan: {
    type: String,
    trim: true,
  },
  noiDungLuuTruId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NoiDungLuuTru',
  },
  media: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
    }
  ]
}, {
  timestamps: true
});

export const SuKien = mongoose.model('SuKien', suKienSchema);

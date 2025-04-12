import mongoose from 'mongoose';

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
    match: [/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, 'Thời gian không hợp lệ (hh:mm hoặc hh:mm:ss)'],
  },
  thoiGianKetThuc: {
    type: String,
    match: [/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, 'Thời gian không hợp lệ (hh:mm hoặc hh:mm:ss)'],
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
  timestamps: true // tự động tạo createdAt và updatedAt
});

export const SuKien = mongoose.model('SuKien', suKienSchema);

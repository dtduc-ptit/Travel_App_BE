import mongoose from 'mongoose';

const LuotBinhLuanSchema = new mongoose.Schema({
  nguoiDung: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung',
    required: [true, 'Người dùng là bắt buộc'],
  },
  baiViet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BaiViet',
    required: [true, 'Bài viết là bắt buộc'],
  },
  noiDung: {
    type: String,
    required: [true, 'Nội dung bình luận là bắt buộc'],
    trim: true,
    minlength: [1, 'Nội dung không được để trống'],
  },
  phanHoiCho: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LuotBinhLuan',
    default: null,
  },
  thoiGian: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export const LuotBinhLuan = mongoose.model('LuotBinhLuan', LuotBinhLuanSchema);

import mongoose from 'mongoose';

const LuotThichSchema = new mongoose.Schema(
  {
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
    thoiGian: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // tự động thêm createdAt và updatedAt
  }
);

export const LuotThich = mongoose.model('LuotThich', LuotThichSchema);

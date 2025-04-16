import mongoose, { Schema } from 'mongoose';
import { Types } from 'mongoose';

const BaiVietSchema = new Schema(
  {
    // Tham chiếu người dùng viết bài
    nguoiDung: {
      type: Types.ObjectId,
      ref: 'NguoiDung',
      required: [true, 'Người dùng là bắt buộc'],
    },

    // Đường dẫn hình ảnh đại diện của bài viết
    hinhAnh: {
      type: String,
      required: [true, 'Hình ảnh là bắt buộc'],
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/.test(v);
        },
        message: 'URL hình ảnh không hợp lệ',
      },
    },

    noiDung: {
      type: String,
      required: [true, 'Nội dung không được để trống'],
      trim: true,
      minlength: [10, 'Nội dung phải có ít nhất 10 ký tự'],
      maxlength: [5000, 'Nội dung không được vượt quá 5000 ký tự'],
    },

    // Thời gian đăng bài
    thoiGian: {
      type: Date,
      default: Date.now,
    },

    // Danh sách lượt thích liên kết
    luotThich: [
      {
        type: Types.ObjectId,
        ref: 'LuotThich',
      },
    ],

    // Danh sách bình luận liên kết
    luotBinhLuan: [
      {
        type: Types.ObjectId,
        ref: 'LuotBinhLuan',
      },
    ],
  },
  {
    timestamps: true, // tự động tạo createdAt & updatedAt
  },
);

export const BaiViet = mongoose.model('BaiViet', BaiVietSchema);

import { Schema, Types } from 'mongoose';

export const KienThucSchema = new Schema(
  {
    tieuDe: {
      type: String,
      required: [true, 'Tiêu đề là bắt buộc'],
      trim: true,
      minlength: [5, 'Tiêu đề phải có ít nhất 5 ký tự'],
      maxlength: [200, 'Tiêu đề không được dài quá 200 ký tự'],
    },

    noiDung: {
      type: String,
      required: [true, 'Nội dung là bắt buộc'],
      minlength: [20, 'Nội dung phải có ít nhất 20 ký tự'],
    },

    moTaNgan: {
      type: String,
      default: '',
      maxlength: [500, 'Mô tả ngắn không được quá 500 ký tự'],
    },

    tacGia: {
      type: Types.ObjectId,
      ref: 'NguoiDung',
      required: [true, 'Phải có tác giả'],
    },

    hinhAnh: [
      {
        type: String,
        validate: {
          validator: function (value: string) {
            return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/.test(value); // Đường dẫn hợp lệ
          },
          message: 'URL hình ảnh không hợp lệ',
        },
      },
    ],

    the: [
      {
        type: String,
        lowercase: true,
        trim: true,
        minlength: [2, 'Thẻ phải có ít nhất 2 ký tự'],
        maxlength: [30, 'Thẻ không được dài quá 30 ký tự'],
      },
    ],

    daDuyet: {
      type: Boolean,
      default: false,
    },

    soLuotXem: {
      type: Number,
      default: 0,
      min: [0, 'Số lượt xem không thể âm'],
    },
  },
  {
    timestamps: true,
  },
);

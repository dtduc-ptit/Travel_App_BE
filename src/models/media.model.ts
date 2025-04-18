import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';

// 1. Interface để định nghĩa kiểu dữ liệu cho Media
export interface IMedia extends Document {
  type: 'image' | 'video';
  url: string;
  doiTuong: 'SuKien' | 'DTTich' | 'PhongTuc';
  doiTuongId: string;
  moTa?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Schema định nghĩa cấu trúc lưu trong MongoDB
const mediaSchema = new Schema<IMedia>(
  {
    type: {
      type: String,
      enum: ['image', 'video'],
      required: [true, 'Trường "type" là bắt buộc'],
    },
    url: {
      type: String,
      required: [true, 'Trường "url" là bắt buộc'],
      validate: {
        validator: (v: string) => validator.isURL(v),
        message: (props: any) => `"${props.value}" không phải là một URL hợp lệ`,
      },
    },
    doiTuong: {
      type: String,
      enum: ['SuKien', 'DTTich', 'PhongTuc'],
      required: [true, 'Trường "doiTuong" là bắt buộc'],
    },
    doiTuongId: {
      type: String,
      required: [true, 'Trường "doiTuongId" là bắt buộc'],
      refPath: 'doiTuong',
    },
    moTa: {
      type: String,
      maxlength: [100000, 'Mô tả không được vượt quá 100000 ký tự'],
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt & updatedAt
  }
);

// 3. Tạo model
export const Media = mongoose.model<IMedia>('media', mediaSchema);

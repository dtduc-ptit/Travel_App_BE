import mongoose, { Schema } from 'mongoose';

export interface IDTTich {
  ten: string;
  moTa?: string;
  viTri?: string;
  danhGia: number;
  thoiGianCapNhat?: Date;
  luotXem: number;
  huongDan?: string;
  noiDungLuuTruId?: mongoose.Types.ObjectId;
  media: mongoose.Types.ObjectId[];
}

const diTichSchema: Schema<IDTTich> = new Schema(
  {
    ten: {
      type: String,
      required: [true, 'Tên di tích là bắt buộc'],
      trim: true,
      minlength: [2, 'Tên phải có ít nhất 2 ký tự'],
      maxlength: [100, 'Tên không được vượt quá 100 ký tự'],
    },
    moTa: {
      type: String,
      trim: true,
      maxlength: [1000, 'Mô tả không được vượt quá 1000 ký tự'],
    },
    viTri: {
      type: String,
      trim: true,
      maxlength: [500, 'Vị trí không được vượt quá 500 ký tự'],
    },
    danhGia: {
      type: Number,
      default: 0,
      min: [0, 'Đánh giá không thể nhỏ hơn 0'],
      max: [5, 'Đánh giá không thể lớn hơn 5'],
    },
    thoiGianCapNhat: {
      type: Date,
      default: Date.now,
    },
    luotXem: {
      type: Number,
      default: 0,
      min: [0, 'Lượt xem không thể âm'],
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
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const DTTich = mongoose.model<IDTTich>('DTTich', diTichSchema);

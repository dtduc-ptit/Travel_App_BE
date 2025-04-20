import mongoose, { Schema } from 'mongoose';

export interface IDanhGiaNguoiDung {
  userId: string;
  diem: number;
  binhLuan: string;
}

export interface IDTTich {
  ten: string;
  moTa?: string;
  viTri?: string;
  danhGia: number;
  thoiGianCapNhat?: Date;
  soNguoiDanhGia: number;
  luotXem: number;
  huongDan?: string;
  noiDungLuuTruId?: mongoose.Types.ObjectId;
  media: mongoose.Types.ObjectId[];
  danhGiaNguoiDung?: IDanhGiaNguoiDung[];
  camNang?: string;
}


const danhGiaNguoiDungSchema: Schema<IDanhGiaNguoiDung> = new Schema(
  {
    userId: { type: String, required: true },
    diem: { type: Number, required: true, min: 1, max: 5 },
    binhLuan: { type: String, required: true },
  },
  { _id: false }
);

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
      maxlength: [100000, 'Mô tả không được vượt quá 100000 ký tự'],
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
    soNguoiDanhGia: {
      type: Number,
      default: 0,
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
    camNang: {
      type: String,
      trim: true,
      maxlength: [100000, 'Nội dung không được vượt quá 100000 ký tự'],
    },
    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
      },
    ],
    danhGiaNguoiDung: [danhGiaNguoiDungSchema],
  },
  {
    timestamps: true,
  }
);

export const DTTich = mongoose.model<IDTTich>('DTTich', diTichSchema);

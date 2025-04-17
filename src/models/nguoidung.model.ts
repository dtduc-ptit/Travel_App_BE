import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface cho TypeScript
export interface INguoiDung extends Document {
  ten: string;
  taiKhoan: string;
  matKhau: string;
  email: string;
  anhDaiDien?: string;
  moTa?: string;
  ngayTao?: Date;
  yeuThich?: number;
  baiViets?: mongoose.Types.ObjectId[];
  luotThichs?: mongoose.Types.ObjectId[];
  binhLuans?: mongoose.Types.ObjectId[];
  noiDungLuuTrus?: mongoose.Types.ObjectId[];
  thongBaos?: mongoose.Types.ObjectId[];
  lichSuTimKiems?: mongoose.Types.ObjectId[];
  pushToken?: string; // ✅ Thêm pushToken
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const nguoiDungSchema = new Schema<INguoiDung>(
  {
    ten: {
      type: String,
      required: [true, 'Tên người dùng là bắt buộc'],
      trim: true,
      minlength: [2, 'Tên phải dài ít nhất 2 ký tự'],
    },
    taiKhoan: {
      type: String,
      required: [true, 'Tài khoản là bắt buộc'],
      unique: true,
      trim: true,
      minlength: [4, 'Tài khoản phải có ít nhất 4 ký tự'],
    },
    matKhau: {
      type: String,
      required: [true, 'Mật khẩu là bắt buộc'],
      minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
    },
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Email không hợp lệ'],
    },
    anhDaiDien: {
      type: String,
      default: '',
    },
    moTa: {
      type: String,
      trim: true,
    },
    ngayTao: {
      type: Date,
      default: Date.now,
    },
    yeuThich: {
      type: Number,
      default: 0,
      min: [0, 'Số lượt yêu thích không được âm'],
    },

    // Tham chiếu quan hệ
    baiViets: [{ type: Schema.Types.ObjectId, ref: 'BaiViet' }],
    luotThichs: [{ type: Schema.Types.ObjectId, ref: 'LuotThich' }],
    binhLuans: [{ type: Schema.Types.ObjectId, ref: 'BinhLuan' }],
    noiDungLuuTrus: [{ type: Schema.Types.ObjectId, ref: 'NoiDungLuuTru' }],
    thongBaos: [{ type: Schema.Types.ObjectId, ref: 'ThongBao' }],
    lichSuTimKiems: [{ type: Schema.Types.ObjectId, ref: 'LichSuTimKiem' }],

    // ✅ Push token để gửi thông báo
    pushToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
  }
);

// Mã hóa mật khẩu trước khi lưu
nguoiDungSchema.pre('save', async function (next) {
  if (!this.isModified('matKhau')) return next();
  this.matKhau = await bcrypt.hash(this.matKhau, 10);
  next();
});

// So sánh mật khẩu nhập vào với mật khẩu đã mã hóa
nguoiDungSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.matKhau);
};

export const NguoiDung = mongoose.model<INguoiDung>('NguoiDung', nguoiDungSchema);

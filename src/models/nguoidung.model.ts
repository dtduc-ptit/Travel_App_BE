import mongoose from 'mongoose';

const nguoiDungSchema = new mongoose.Schema({
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
  baiViets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BaiViet',
  }],
  luotThichs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LuotThich',
  }],
  binhLuans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LuotBinhLuan',
  }],
  noiDungLuuTrus: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NoiDungLuuTru',
  }],
  thongBaos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ThongBao',
  }],
  lichSuTimKiems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LichSuTimKiem',
  }],
}, {
  timestamps: true, // tự động tạo createdAt & updatedAt
});

export const NguoiDung = mongoose.model('NguoiDung', nguoiDungSchema);

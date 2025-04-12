import mongoose from 'mongoose';

const noiDungLuuTruSchema = new mongoose.Schema({
  nguoiDung: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung',
    required: true,
  },

  loaiNoiDung: {
    type: String,
    enum: ['SuKien', 'DiTich', 'PhongTuc'],
    required: true,
  },

  idNoiDung: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  thoiGianLuu: {
    type: Date,
    default: Date.now,
  },
});

export const NoiDungLuuTru = mongoose.model('NoiDungLuuTru', noiDungLuuTruSchema);

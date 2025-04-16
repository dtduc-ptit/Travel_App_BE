import mongoose from 'mongoose';

const thongBaoSuKienSchema = new mongoose.Schema({
  nguoiDung: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung',
    required: true
  },
  suKien: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SuKien',
    required: true
  },
  tieuDe: {
    type: String,
    required: true,
    default: 'Thông báo sự kiện sắp diễn ra'
  },
  noiDung: {
    type: String,
    required: true
  },
  thoiGianGui: {
    type: Date,
    default: Date.now
  },
  daDoc: {
    type: Boolean,
    default: false
  }
});


export const ThongBaoSuKien = mongoose.model('ThongBaoSuKien', thongBaoSuKienSchema);

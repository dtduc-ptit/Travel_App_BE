import mongoose from 'mongoose';

const hoatDongSchema = new mongoose.Schema({
  thoiGian: {
    type: String,
    required: [true, 'Thời gian hoạt động là bắt buộc'],
    validate: {
      validator: function (v: string) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v); // định dạng HH:mm
      },
      message: 'Thời gian phải theo định dạng HH:mm (VD: 08:30)',
    },
  },
  noiDung: {
    type: String,
    required: [true, 'Nội dung hoạt động là bắt buộc'],
    trim: true,
    minlength: [3, 'Nội dung phải dài ít nhất 3 ký tự'],
  },
  diaDiem: {
    type: String,
    trim: true,
    maxlength: [200, 'Địa điểm không quá 200 ký tự'],
  },
  ghiChu: {
    type: String,
    trim: true,
  },
});

const lichTrinhSchema = new mongoose.Schema({
  tenLichTrinh: {
    type: String,
    required: [true, 'Tên lịch trình là bắt buộc'],
    trim: true,
    minlength: [3, 'Tên phải dài ít nhất 3 ký tự'],
  },
  ngay: {
    type: Date,
    required: [true, 'Ngày áp dụng lịch trình là bắt buộc'],
  },
  suKien: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SuKien',
  },
  diTich: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiTich',
  },
  hoatDongs: {
    type: [hoatDongSchema],
    validate: {
      validator: function (arr: any[]) {
        return arr.length > 0;
      },
      message: 'Cần ít nhất một hoạt động trong lịch trình',
    },
  },
});

export const LichTrinh = mongoose.model('LichTrinh', lichTrinhSchema);

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
    default: null,
  },
  diTich: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DTTich',
    default: null,
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
}, {
  validateBeforeSave: true,
});

// 👇 Custom validation: chỉ có 1 trong 2 trường suKien hoặc diTich
lichTrinhSchema.pre('validate', function (next) {
  const hasSuKien = !!this.suKien;
  const hasDiTich = !!this.diTich;

  if ((hasSuKien && hasDiTich) || (!hasSuKien && !hasDiTich)) {
    const error = new mongoose.Error.ValidationError(this as any);
    error.addError('suKien', new mongoose.Error.ValidatorError({
      message: 'Chỉ được chọn 1 trong 2: sự kiện hoặc di tích',
      path: 'suKien',
    }));
    error.addError('diTich', new mongoose.Error.ValidatorError({
      message: 'Chỉ được chọn 1 trong 2: sự kiện hoặc di tích',
      path: 'diTich',
    }));
    return next(error);
  }

  next();
});

export const LichTrinh = mongoose.model('LichTrinh', lichTrinhSchema);

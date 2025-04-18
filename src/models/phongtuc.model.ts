import mongoose from 'mongoose';

const phongTucSchema = new mongoose.Schema({
  ten: { 
    type: String, 
    required: [true, 'Tên phong tục là bắt buộc'], 
    trim: true,
    minlength: [2, 'Tên quá ngắn'],
    maxlength: [100, 'Tên quá dài']
  },
  moTa: { 
    type: String,
    maxlength: [100000, 'Mô tả quá dài']
  },
  yNghia: { 
    type: String,
    maxlength: [100000, 'Ý nghĩa quá dài']
  },
  loai: { 
    type: String,
    enum: ['Tín ngưỡng', 'Lễ hội', 'Văn hóa', 'Khác'],
    default: 'Khác'
  },
  danhGia: { 
    type: Number, 
    default: 0,
    min: [0, 'Đánh giá không hợp lệ'],
    max: [5, 'Đánh giá không vượt quá 5']
  },
  soNguoiDanhGia: { 
    type: Number, 
    default: 0, // Số người đã đánh giá
    min: [0, 'Số người đánh giá phải là số không âm']
  },
  danhGiaNguoiDung: [ // Mảng lưu trữ các đánh giá của người dùng
    {
      userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
      },
      diem: { 
        type: Number, 
        required: true,
        min: [0, 'Điểm đánh giá không hợp lệ'],
        max: [5, 'Điểm đánh giá không vượt quá 5']
      },
    }
  ],
  thoiGianCapNhat: { 
    type: Date,
    default: Date.now
  },
  luotXem: { 
    type: Number, 
    default: 0,
    min: [0, 'Lượt xem phải là số không âm']
  },
  diaDiem: { 
    type: String,
    maxlength: [200, 'Địa điểm quá dài']
  },
  huongDan: { 
    type: String,
    maxlength: [100000, 'Hướng dẫn quá dài']
  },

  // Liên kết tới bảng NoiDungLuuTru
  noiDungLuuTru: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NoiDungLuuTru',
    default: null
  },

  // Liên kết tới bảng Media
  media: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media'
    }
  ],
});

export const PhongTuc = mongoose.model('PhongTuc', phongTucSchema);

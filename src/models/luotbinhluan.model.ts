// src/schemas/luot-binh-luan.schema.ts

import { Schema, Types } from 'mongoose';

export const LuotBinhLuanSchema = new Schema(
  {
    // Người viết bình luận
    nguoiDung: {
      type: Types.ObjectId,
      ref: 'NguoiDung',
      required: true,
    },

    // Bài viết được bình luận
    baiViet: {
      type: Types.ObjectId,
      ref: 'BaiViet',
      required: true,
    },

    // Nội dung của bình luận
    noiDung: {
      type: String,
      required: true,
      trim: true,
    },

    //Trường mới: Bình luận này là phản hồi cho bình luận nào?
    phanHoiCho: {
        type: Types.ObjectId,
        ref: 'LuotBinhLuan',
        default: null, // Nếu null tức là bình luận gốc
    },   
    // Thời gian bình luận
    thoiGian: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
  },
);

LuotBinhLuanSchema.index({ baiViet: 1 });
LuotBinhLuanSchema.index({ nguoiDung: 1 });




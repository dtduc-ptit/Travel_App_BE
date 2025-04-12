// src/schemas/luot-thich.schema.ts

import { Schema, Types } from 'mongoose';

export const LuotThichSchema = new Schema(
  {
    // Người dùng thực hiện hành động "thích"
    nguoiDung: {
      type: Types.ObjectId,
      ref: 'NguoiDung',
      required: true,
    },

    // Bài viết được thích
    baiViet: {
      type: Types.ObjectId,
      ref: 'BaiViet',
      required: true,
    },

    // Thời điểm thích
    thoiGian: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // thêm createdAt, updatedAt
  },
);

LuotThichSchema.index({ nguoiDung: 1, baiViet: 1 }, { unique: true });

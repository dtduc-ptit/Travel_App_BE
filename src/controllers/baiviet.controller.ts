import { Request, Response } from 'express';
import { BaiViet } from '../models/baiviet.model';
import { NguoiDung } from '../models/nguoidung.model';
import mongoose from 'mongoose';

// Lấy tất cả bài viết
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await BaiViet.find().populate('nguoiDung');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy bài viết' });
  }
};

// Lấy bài viết theo ID
export const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await BaiViet.findById(id).populate('nguoiDung');
    if (!post) {
      res.status(404).json({ error: 'Bài viết không tồn tại' });
      return;
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy bài viết theo ID' });
  }
};

// Tạo bài viết mới
export const createPost = async (req: Request, res: Response) => {
  const { content, hinhAnh, video, nguoiDungId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(nguoiDungId)) {
    return res.status(400).json({ error: 'Người dùng không hợp lệ' });
  }

  try {
    const nguoiDung = await NguoiDung.findById(nguoiDungId);
    if (!nguoiDung) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }

    const newPost = new BaiViet({
      noiDung: content,
      hinhAnh,
      video,
      nguoiDung: nguoiDungId,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi tạo bài viết' });
  }
};


// Cập nhật bài viết
export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, hinhAnh, nguoiDungId } = req.body;
  try {
    const post = await BaiViet.findById(id);
    if (!post) {
      res.status(404).json({ error: 'Bài viết không tồn tại' });
      return;
    }
    post.noiDung = content || post.noiDung;
    post.hinhAnh = hinhAnh || post.hinhAnh;
    post.nguoiDung = nguoiDungId || post.nguoiDung;
    
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi cập nhật bài viết' });
  }
};

// Xóa bài viết
export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await BaiViet.findById(id);
    if (!post) {
      res.status(404).json({ error: 'Bài viết không tồn tại' });
      return;
    }
    await post.deleteOne();
    res.json({ message: 'Bài viết đã được xóa' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi xóa bài viết', details: err });
  }
};

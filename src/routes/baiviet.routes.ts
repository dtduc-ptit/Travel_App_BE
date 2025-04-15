import express, { Request, Response } from 'express'; // Import kiểu dữ liệu cho Request và Response
import { createPost, getPosts, getPostById, updatePost, deletePost } from '../controllers/baiviet.controller';

const router = express.Router();

// Route để lấy danh sách bài viết
router.get('/baiviet', getPosts);

// Route để lấy bài viết theo ID
router.get('/baiviet/:id', getPostById);

// Route để đăng bài viết mới
router.post('/baiviet', async (req: Request, res: Response) => {
  try {
    await createPost(req, res); // Gọi hàm createPost trong controller
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi đăng bài viết' });
  }
});

// Route để cập nhật bài viết
router.patch('/baiviet/:id', updatePost);

// Route để xóa bài viết
router.delete('/baiviet/:id', deletePost);

export default router;

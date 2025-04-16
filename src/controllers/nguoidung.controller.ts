import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {NguoiDung} from '../models/nguoidung.model';
import validator from 'validator';

// Tạo người dùng mới
export const createNguoiDung = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = new NguoiDung(req.body);
    const savedUser = await user.save();
    res.status(201).json({ message: 'Tạo thành công', user: savedUser });
  } catch (err: any) {
    res.status(400).json({ message: 'Tạo thất bại', error: err.message });
  }
};

// Lấy danh sách người dùng
export const getAllNguoiDung = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await NguoiDung.find();
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Đăng ký
export const registerNguoiDung = async (req: Request, res: Response): Promise<void> => {
    const { ten, taiKhoan, matKhau, email } = req.body;
  
    try {
      // Kiểm tra tài khoản đã tồn tại
      const existsAccount = await NguoiDung.findOne({ taiKhoan });
      if (existsAccount) {
        res.status(400).json({ message: 'Tài khoản đã tồn tại' });
        return;
      }
  
      // Kiểm tra email đã tồn tại
      const existsEmail = await NguoiDung.findOne({ email });
      if (existsEmail) {
        res.status(400).json({ message: 'Email đã được sử dụng' });
        return;
      }
  
      // Tạo người dùng mới
      const newUser = new NguoiDung({ ten, taiKhoan, matKhau, email });
      await newUser.save();
  
      // Phản hồi thành công
      res.status(201).json({
        message: 'Đăng ký thành công',
        user: {
          _id: newUser._id,
          ten: newUser.ten,
          taiKhoan: newUser.taiKhoan,
          email: newUser.email,
          ngayTao: newUser.ngayTao,
        },
      });
    } catch (err: any) {
        console.error('❌ Lỗi đăng ký:', err);
      
        if (err.name === 'ValidationError') {
          const errors: { [key: string]: string } = {};
      
          for (const field in err.errors) {
            errors[field] = err.errors[field].message;
          }
      
          res.status(400).json({
            message: 'Lỗi xác thực dữ liệu',
            errors,
          });
        } else {
          res.status(500).json({ message: 'Lỗi server', error: err.message });
        }
      }
  };
// Đăng nhập
export const loginNguoiDung = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taiKhoan, matKhau } = req.body;
    const nguoiDung = await NguoiDung.findOne({ taiKhoan });

    if (!nguoiDung) {
      res.status(400).json({ message: 'Tài khoản không tồn tại' });
      return;
    }

    const isMatch = await bcrypt.compare(matKhau, nguoiDung.matKhau);
    if (!isMatch) {
      res.status(400).json({ message: 'Mật khẩu không đúng' });
      return;
    }

    res.status(200).json({
      message: 'Đăng nhập thành công',
      idNguoiDung: nguoiDung._id, // 👈 Gửi luôn ID người dùng
      nguoiDung,
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


// Lấy thông tin chi tiết người dùng theo ID
export const getNguoiDungInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const nguoiDung = await NguoiDung.findById(id);
    if (!nguoiDung) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    res.json(nguoiDung);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};


export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { ten, anhDaiDien, moTa, newPassword } = req.body;

  try {
    const user = await NguoiDung.findById(id);
    if (!user) {
      res.status(404).json({ message: 'Không tìm thấy người dùng' });
      return;
    }

    // Ngăn chặn cập nhật ngày tạo
    if ('ngayTao' in req.body) {
      delete req.body.ngayTao;
    }

    // Cập nhật tên nếu có
    if (ten !== undefined) {
      if (typeof ten !== 'string' || ten.trim().length < 2) {
        res.status(400).json({ message: 'Tên phải có ít nhất 2 ký tự' });
        return;
      }
      user.ten = ten.trim();
    }

    // Cập nhật ảnh đại diện nếu có
    if (anhDaiDien !== undefined) {
      if (!validator.isURL(anhDaiDien, { require_protocol: true })) {
        res.status(400).json({ message: 'Ảnh đại diện không hợp lệ (phải là URL hợp lệ)' });
        return;
      }
      user.anhDaiDien = anhDaiDien;
    }

    // Cập nhật mô tả nếu có
    if (moTa !== undefined) {
      user.moTa = typeof moTa === 'string' ? moTa.trim() : '';
    }

    // Cập nhật mật khẩu nếu có
    if (newPassword !== undefined) {
      if (typeof newPassword !== 'string' || newPassword.length < 6) {
        res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
        return;
      }
      user.matKhau = newPassword;
      user.markModified('matKhau'); // Đảm bảo bcrypt sẽ mã hoá lại
    }

    await user.save();

    res.status(200).json({
      message: 'Cập nhật thông tin thành công',
      user: {
        _id: user._id,
        ten: user.ten,
        email: user.email,
        anhDaiDien: user.anhDaiDien,
        moTa: user.moTa,
        ngayTao: user.ngayTao,
      },
    });
  } catch (err) {
    console.error('❌ Lỗi cập nhật người dùng:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


// POST /api/users/verify-password
export const verifyPassword = async (req: Request, res: Response): Promise<void> => {
  const { userId, currentPassword } = req.body;

  try {
    const user = await NguoiDung.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      res.status(401).json({ message: 'Incorrect password' });
      return;
    }

    res.status(200).json({ message: 'Password verified' });
  } catch (err) {
    console.error('❌ Error verifying password:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

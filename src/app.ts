

import os from 'os';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';

import phongtucRoutes from './routes/phongtuc.routes';
import mediaRoutes from './routes/media.routes';
import nguoidungRoutes from './routes/nguoidung.routes';
import ditichRoutes from './routes/ditich.routes';
import lichtrinhRoutes from './routes/lichtrinh.routes';
import sukienRoutes from './routes/sukien.routes';
import thongBaoRoutes from './routes/thongbaosukien.routes';
import kienThucRoutes from './routes/kienthuc.routes';
import { createEventNotifications } from './utils/notificationScheduler';  // Import hàm
import baiVietRoutes from './routes/baiviet.routes';
import luotbinhluanRoutes from './routes/luotbinhluan.routes';


dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;
app.use(cors());

// Thay thế đoạn lấy IP tự động bằng IP LAN thực của máy bạn
// const localIP = '192.168.41.61';  // Địa chỉ IP LAN của máy tính bạn

// Lấy IP LAN của máy tính
const networkInterfaces = os.networkInterfaces();
let localIP = 'localhost';
for (const iface of Object.values(networkInterfaces)) {
  for (const config of iface || []) {
    if (config.family === 'IPv4' && !config.internal) {
      localIP = config.address;
    }
  }
}

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(async () => {
    console.log('✅ Connected to MongoDB successfully!');
  })
  .catch((err: Error) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

app.use(express.json());

// Routes
app.use('/api/phongtucs', phongtucRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/nguoidung', nguoidungRoutes);
app.use('/api/ditich', ditichRoutes);
app.use('/api/sukien', sukienRoutes);
app.use('/api/lichtrinh', lichtrinhRoutes);
app.use('/api/kienthuc', kienThucRoutes);
app.use('/api/thongbao', thongBaoRoutes); 
app.use('/api/baiviet', baiVietRoutes);
app.use('/api/luotbinhluan', luotbinhluanRoutes);

// Route test
app.get('/', (req, res) => {
  res.send('🚀 API Travel đang chạy!');
});

// Gọi hàm createEventNotifications ngay khi server khởi động
mongoose.connection.once('open', () => {
  console.log('🟢 Kết nối DB thành công, bắt đầu chạy cron gửi thông báo...');

  // ✅ Chạy ngay khi server khởi động
  createEventNotifications();

  // ✅ Thiết lập cron job chạy mỗi ngày lúc 0h (nửa đêm)
  cron.schedule('0 0 * * *', async () => {
    console.log('🔁 [CRON] Đang kiểm tra sự kiện để gửi thông báo...');
    await createEventNotifications();
  });
});

// Sử dụng localIP để lắng nghe từ mạng LAN
app.listen(Number(port), localIP, () => {
  console.log(`🚀 Server đang chạy tại http://${localIP}:${port}`);
});

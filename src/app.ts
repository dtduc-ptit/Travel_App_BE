import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import os from 'os';

import phongtucRoutes from './routes/phongtuc.routes';
import mediaRoutes from './routes/media.routes';
import nguoidungRoutes from './routes/nguoidung.routes';
import ditichRoutes from './routes/ditich.routes';
import lichtrinhRoutes from './routes/lichtrinh.routes';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;
const host = '0.0.0.0'; // Cho phép các thiết bị khác trong mạng truy cập

app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
  })
  .catch((err: Error) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// Routes
app.use('/api/phongtucs', phongtucRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/nguoidung', nguoidungRoutes);
app.use('/api/ditich', ditichRoutes);
app.use('/api/lichtrinh', lichtrinhRoutes); 

// Route test
app.get('/', (req, res) => {
  res.send('🚀 API Travel đang chạy!');
});

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

app.listen(Number(port), host, () => {
  console.log(`🚀 Server đang chạy tại http://${localIP}:${port}`);
});

import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import phongtucRoutes from './routes/phongtuc.routes';
import mediaRoutes from './routes/media.routes';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI as string, {
    // Chú ý: Trong Mongoose >= 6, không cần các option này nữa
  })
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
  })
  .catch((err: Error) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// Sử dụng route
app.use('/api/phongtucs', phongtucRoutes);
app.use('/api/media', mediaRoutes);

app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

// cloudinary.middleware.ts
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: async (req, file) => {
    return {
      folder: 'temp_uploads'
    };
  }
});

export const upload = multer({ storage });

import express from 'express';
import { createMedia, getMediaById, updateMedia, getMediaByDoiTuong } from '../controllers/media.controller';

const router = express.Router();

router.post('/', createMedia);
router.get('/:id', getMediaById);
router.patch('/:id', updateMedia);
router.get("/", getMediaByDoiTuong); // GET /api/media?doiTuong=PhongTuc&doiTuongId=65fabc...&type=image

export default router;

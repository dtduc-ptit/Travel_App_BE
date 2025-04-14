import express from 'express';
import { createMedia, getMediaById, updateMedia } from '../controllers/media.controller';

const router = express.Router();

router.post('/', createMedia);
router.get('/:id', getMediaById);
router.patch('/:id', updateMedia);
export default router;

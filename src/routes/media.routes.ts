import express from 'express';
import { createMedia,getAllMedia } from '../controllers/media.controller';

const router = express.Router();

router.post('/', createMedia);
router.get('/', getAllMedia); 

export default router;

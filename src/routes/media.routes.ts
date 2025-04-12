import express from 'express';
import { createMedia } from '../controllers/media.controller';

const router = express.Router();

router.post('/', createMedia);

export default router;

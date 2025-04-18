// routes/auth.routes.js
import express from 'express';
import { googleLogin } from '../../controllers/auth/auth.controller';

const router = express.Router();

router.post('/google', googleLogin);

export default router;

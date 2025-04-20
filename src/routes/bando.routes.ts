

import express from 'express';
import {
    getBanDoVanHoa
} from '../controllers/bando.controller';

const router = express.Router();


router.get('/', getBanDoVanHoa); 


export default router;


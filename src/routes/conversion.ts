import { Router } from 'express';
import Conversion from '../controllers/conversion.js';

const router = Router();
const conversion = new Conversion();

router.get('/conversion-rate', conversion.rate);

export default router;

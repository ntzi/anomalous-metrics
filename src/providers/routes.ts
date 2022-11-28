import { Router } from 'express';
import conversion from '../routes/conversion.js'

const rootRouter = Router();

rootRouter.use('/api', conversion);

export default rootRouter;

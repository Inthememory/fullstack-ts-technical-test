import Router from 'express'
import { snapshot } from '../controllers/metrics';

const metrics = Router();
metrics.get('/snapshot', snapshot)

export default metrics;

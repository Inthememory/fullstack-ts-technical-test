import Router from 'express'
import { MetricsService } from '../services/metrics'

const metrics = Router();
metrics.get('/snapshot', async (req, res) => {
  const service = new MetricsService()
  const result = await service.retrieveMetrics()
  res.json(result)
})

export default metrics;

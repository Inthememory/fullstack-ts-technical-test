import { MetricsService } from "../services/metrics"

const service = new MetricsService()

export const snapshot = async (req, res) => {
    const result = await service.retrieveMetrics()
    res.json(result)
}


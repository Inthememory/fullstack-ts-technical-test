import { snapshot } from "../../controllers/metrics";
import { MetricsService } from '../../services/metrics';
import { Request, Response } from 'express';
// Mock the MetricsService module
jest.mock('../../services/metrics', () => {
    return {
        MetricsService: jest.fn().mockImplementation(() => {
            return {
                retrieveMetrics: jest.fn().mockResolvedValue({ success: true, data: [1, 2, 3] }),
            };
        }),
    };
});


describe('snapshot function', () => {
    it('should retrieve metrics and respond with JSON', async () => {
        const req = {} as Request;
        const res = {
            json: jest.fn(),
        } as unknown as Response;

        await snapshot(req, res);

        expect(res.json).toHaveBeenCalledWith({ success: true, data: [1, 2, 3] });
    });
});

import { MetricsService } from '../../services/metrics';
import * as postgresql from '../../infrastructure/postgresql';

// Mock the query function from the postgresql module
jest.mock('../../infrastructure/postgresql', () => ({
    query: jest.fn(),
}));

describe('MetricsService', () => {
    let metricsService: MetricsService;

    beforeEach(() => {
        metricsService = new MetricsService();
        jest.clearAllMocks();
    });

    it('should retrieve metrics successfully', async () => {
        const mockData = { rows: ['2022-01-01T00:00:00Z'] };
        (postgresql.query as jest.Mock).mockResolvedValue(mockData);

        const result = await metricsService.retrieveMetrics();

        expect(postgresql.query).toHaveBeenCalledWith('SELECT NOW()');
        expect(result).toEqual(mockData.rows);
    });

    it('should handle errors gracefully', async () => {
        (postgresql.query as jest.Mock).mockRejectedValue(new Error('Database error'));

        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        const result = await metricsService.retrieveMetrics();

        expect(postgresql.query).toHaveBeenCalledWith('SELECT NOW()');
        expect(errorSpy).toHaveBeenCalledWith(new Error('Database error'));
        expect(result).toBeUndefined();

        errorSpy.mockRestore();
    });
});

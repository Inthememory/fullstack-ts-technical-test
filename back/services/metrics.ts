import { query } from '../infrastructure/postgresql';
 
export class MetricsService {
  async retrieveMetrics() {
    try {
      const result = await query('SELECT NOW()');
      return result.rows
    } catch (err) {
      console.error(err);
    }
  }
}

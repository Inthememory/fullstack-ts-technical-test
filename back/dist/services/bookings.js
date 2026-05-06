"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const postgresql_1 = require("../infrastructure/postgresql");
/**
 * Naive boilerplate: one INSERT per device, one row per (campaign, device) interval.
 * No overlap check, no transaction, no locking — candidates must add those.
 */
class BookingsService {
    createBookings(campaignId, _tenantId, deviceIds, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (deviceIds.length === 0) {
                return { insertedCount: 0 };
            }
            const valueGroups = [];
            const values = [];
            let paramIndex = 1;
            for (const deviceId of deviceIds) {
                valueGroups.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}::date, $${paramIndex + 3}::date)`);
                values.push(campaignId, deviceId, startDate, endDate);
                paramIndex += 4;
            }
            yield (0, postgresql_1.query)(`
        INSERT INTO bookings (campaign_id, device_id, start_date, end_date)
        VALUES ${valueGroups.join(', ')}
      `, values);
            return { insertedCount: deviceIds.length };
        });
    }
}
exports.BookingsService = BookingsService;

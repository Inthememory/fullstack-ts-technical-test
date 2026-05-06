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
exports.CampaignsService = void 0;
const postgresql_1 = require("../infrastructure/postgresql");
class CampaignsService {
    create(tenantId, name, startDate, endDate) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, postgresql_1.query)(`
        INSERT INTO campaigns (tenant_id, name, start_date, end_date)
        VALUES ($1, $2, $3::date, $4::date)
        RETURNING
          id,
          tenant_id AS "tenantId",
          name,
          start_date::text AS "startDate",
          end_date::text AS "endDate"
      `, [tenantId, name, startDate, endDate]);
            const row = (_a = result.rows) === null || _a === void 0 ? void 0 : _a[0];
            if (!row) {
                throw new Error('campaign creation failed');
            }
            return {
                id: Number(row.id),
                tenantId: Number(row.tenantId),
                name: String(row.name),
                startDate: String(row.startDate),
                endDate: String(row.endDate),
            };
        });
    }
    findById(campaignId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, postgresql_1.query)(`
        SELECT
          id,
          tenant_id AS "tenantId",
          name,
          start_date::text AS "startDate",
          end_date::text AS "endDate"
        FROM campaigns
        WHERE id = $1
      `, [campaignId]);
            const row = (_a = result.rows) === null || _a === void 0 ? void 0 : _a[0];
            if (!row) {
                return undefined;
            }
            return {
                id: Number(row.id),
                tenantId: Number(row.tenantId),
                name: String(row.name),
                startDate: String(row.startDate),
                endDate: String(row.endDate),
            };
        });
    }
    listByTenantWithBookings(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, postgresql_1.query)(`
        SELECT
          c.id,
          c.tenant_id AS "tenantId",
          c.name,
          c.start_date::text AS "startDate",
          c.end_date::text AS "endDate",
          COALESCE(
            json_agg(
              json_build_object(
                'deviceId', d.id,
                'deviceName', d.name,
                'location', d.location,
                'bookingStartDate', b.start_date::text,
                'bookingEndDate', b.end_date::text
              )
              ORDER BY d.id NULLS LAST, b.start_date NULLS LAST
            ) FILTER (WHERE b.id IS NOT NULL),
            '[]'
          )::json AS bookings
        FROM campaigns c
        LEFT JOIN bookings b ON b.campaign_id = c.id
        LEFT JOIN devices d ON d.id = b.device_id
        WHERE c.tenant_id = $1
        GROUP BY c.id
        ORDER BY c.id
      `, [tenantId]);
            const rows = result.rows;
            return rows.map((row) => ({
                id: Number(row.id),
                tenantId: Number(row.tenantId),
                name: String(row.name),
                startDate: String(row.startDate),
                endDate: String(row.endDate),
                bookings: Array.isArray(row.bookings)
                    ? row.bookings.map((b) => ({
                        deviceId: Number(b.deviceId),
                        deviceName: String(b.deviceName),
                        location: String(b.location),
                        bookingStartDate: String(b.bookingStartDate),
                        bookingEndDate: String(b.bookingEndDate),
                    }))
                    : [],
            }));
        });
    }
}
exports.CampaignsService = CampaignsService;

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
exports.DevicesService = void 0;
const postgresql_1 = require("../infrastructure/postgresql");
class DevicesService {
    /**
     * Naive boilerplate: returns all tenant devices regardless of requested window.
     * startDate/endDate are accepted only for API shape; overlap filtering is candidate work.
     */
    availableDevices(tenantId, _startDate, _endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, postgresql_1.query)(`
        SELECT id, tenant_id AS "tenantId", name, location
        FROM devices
        WHERE tenant_id = $1
        ORDER BY id
      `, [tenantId]);
            const rows = result.rows;
            return rows.map((row) => ({
                id: Number(row.id),
                tenantId: Number(row.tenantId),
                name: String(row.name),
                location: String(row.location),
            }));
        });
    }
}
exports.DevicesService = DevicesService;

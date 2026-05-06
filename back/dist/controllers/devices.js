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
exports.availableDevices = void 0;
const devices_1 = require("../services/devices");
const service = new devices_1.DevicesService();
const parseTenantId = (tenantIdRaw) => {
    const tenantId = Number(tenantIdRaw);
    if (!Number.isInteger(tenantId) || tenantId <= 0) {
        return undefined;
    }
    return tenantId;
};
const availableDevices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tenantId = parseTenantId(req.query.tenantId);
    const { startDate, endDate } = req.query;
    if (!tenantId) {
        return res.status(400).json({ error: 'tenantId query param is required and must be a positive integer' });
    }
    if (typeof startDate !== 'string' || typeof endDate !== 'string') {
        return res.status(400).json({ error: 'startDate and endDate query params are required' });
    }
    const devices = yield service.availableDevices(tenantId, startDate, endDate);
    return res.json(devices);
});
exports.availableDevices = availableDevices;

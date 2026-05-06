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
exports.listCampaigns = exports.createCampaign = void 0;
const bookings_1 = require("../services/bookings");
const campaigns_1 = require("../services/campaigns");
const campaignsService = new campaigns_1.CampaignsService();
const bookingsService = new bookings_1.BookingsService();
const parseTenantId = (tenantIdRaw) => {
    const tenantId = Number(tenantIdRaw);
    if (!Number.isInteger(tenantId) || tenantId <= 0) {
        return undefined;
    }
    return tenantId;
};
const isIsoDate = (value) => {
    if (typeof value !== 'string') {
        return false;
    }
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
};
const createCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId, name, startDate, endDate, deviceIds } = req.body;
    if (!Number.isInteger(tenantId) || tenantId <= 0) {
        return res.status(400).json({ error: 'tenantId must be a positive integer' });
    }
    if (typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: 'name is required' });
    }
    if (!isIsoDate(startDate) || !isIsoDate(endDate)) {
        return res.status(400).json({ error: 'startDate and endDate must use YYYY-MM-DD format' });
    }
    if (startDate > endDate) {
        return res.status(400).json({ error: 'startDate must be before or equal to endDate' });
    }
    if (!Array.isArray(deviceIds) || deviceIds.length === 0 || deviceIds.some((id) => !Number.isInteger(id))) {
        return res.status(400).json({ error: 'deviceIds must be a non-empty array of integers' });
    }
    const campaign = yield campaignsService.create(tenantId, name.trim(), startDate, endDate);
    try {
        const bookingResult = yield bookingsService.createBookings(campaign.id, tenantId, deviceIds, startDate, endDate);
        return res.status(201).json({ campaign, bookings: bookingResult });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'unexpected error while creating bookings' });
    }
});
exports.createCampaign = createCampaign;
const listCampaigns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tenantId = parseTenantId(req.query.tenantId);
    if (!tenantId) {
        return res.status(400).json({ error: 'tenantId query param is required and must be a positive integer' });
    }
    const campaigns = yield campaignsService.listByTenantWithBookings(tenantId);
    return res.json(campaigns);
});
exports.listCampaigns = listCampaigns;

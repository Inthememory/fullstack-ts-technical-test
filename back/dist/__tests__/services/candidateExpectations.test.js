"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
/**
 * Remove .skip on the describe block when you want the candidate to work in TDD mode:
 * these tests encode the intended behaviour (overlap-safe listing + booking).
 */
const bookings_1 = require("../../services/bookings");
const devices_1 = require("../../services/devices");
const postgresql = __importStar(require("../../infrastructure/postgresql"));
jest.mock('../../infrastructure/postgresql', () => ({
    query: jest.fn(),
}));
describe.skip('Candidate targets (enable for red/green exercise)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('availableDevices should use booking intervals to exclude busy screens', () => __awaiter(void 0, void 0, void 0, function* () {
        ;
        postgresql.query.mockResolvedValue({ rows: [] });
        const service = new devices_1.DevicesService();
        yield service.availableDevices(1, '2026-05-10', '2026-05-11');
        const sql = String(postgresql.query.mock.calls[0][0]);
        expect(sql).toMatch(/bookings/i);
    }));
    it('createBookings should detect interval overlap before inserting', () => __awaiter(void 0, void 0, void 0, function* () {
        ;
        postgresql.query
            .mockResolvedValueOnce({ rows: [{ id: 1 }] })
            .mockResolvedValueOnce({ rowCount: 1 });
        const service = new bookings_1.BookingsService();
        yield service.createBookings(1, 1, [2], '2026-05-10', '2026-05-15');
        expect(postgresql.query).toHaveBeenCalledTimes(2);
        const firstSql = String(postgresql.query.mock.calls[0][0]);
        expect(firstSql).toMatch(/bookings/i);
    }));
});

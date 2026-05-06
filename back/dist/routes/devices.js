"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const devices_1 = require("../controllers/devices");
const devices = (0, express_1.default)();
devices.get('/available', devices_1.availableDevices);
exports.default = devices;

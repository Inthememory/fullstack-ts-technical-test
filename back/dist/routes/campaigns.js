"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const campaigns_1 = require("../controllers/campaigns");
const campaigns = (0, express_1.default)();
campaigns.get('/', campaigns_1.listCampaigns);
campaigns.post('/', campaigns_1.createCampaign);
exports.default = campaigns;

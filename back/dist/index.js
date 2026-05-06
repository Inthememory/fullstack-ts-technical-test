"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const devices_1 = __importDefault(require("./routes/devices"));
const campaigns_1 = __importDefault(require("./routes/campaigns"));
//For env File
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:4200'
}));
app.use(express_1.default.json());
const port = process.env.PORT || 8000;
app.use('/devices', devices_1.default);
app.use('/campaigns', campaigns_1.default);
app.get('/', (req, res) => {
    res.send('Welcome to Express & TypeScript Server');
});
app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});

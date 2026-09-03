import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import metrics from './routes/metrics';

dotenv.config();

const app: Application = express();
app.use(cors({
    origin: 'http://localhost:4200'
}));
const port = process.env.PORT || 3000;

app.use('/metrics', metrics);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});

app.get('/up', (req: Request, res: Response) => {
    res.json({ ok: true });
});

app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});

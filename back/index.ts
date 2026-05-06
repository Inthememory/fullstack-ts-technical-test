
import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import devices from './routes/devices';
import campaigns from './routes/campaigns';

//For env File
dotenv.config();

const app: Application = express();
app.use(cors({
        origin: 'http://localhost:4200'
    }));
app.use(express.json());
const port = process.env.PORT || 8000;

app.use('/devices', devices)
app.use('/campaigns', campaigns)

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});

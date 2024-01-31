
import express, { Express, Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'

//For env File
dotenv.config();

const app: Application = express();
app.use(cors({
        origin: 'http://localhost:4200' // Remplacez par l'URL de votre frontend
    }));
const port = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});

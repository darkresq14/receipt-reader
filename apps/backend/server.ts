import express, { type Request } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import type { BackendStatusDTO, GreetDTO } from '@receipt-reader/shared-types';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const apiRouter = express.Router();

const PORT = process.env.PORT || 3000;

apiRouter.get('/hello', (req, res) => {
    const status: BackendStatusDTO = {
        status: 'ok',
        message: 'Backend is accessible',
        timestamp: new Date().toISOString()
    };
    res.json(status);
});

apiRouter.post('/greet', (req: Request<{}, {}, GreetDTO>, res) => {
    const { name } = req.body;
    res.json({ message: `Hello, ${name}!` });
});

app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
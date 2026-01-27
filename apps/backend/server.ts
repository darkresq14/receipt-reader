import express, { type Request } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import usersRouter from './routes/users.routes';
import type { BackendStatusDTO, GreetDTO, SumRequestDTO, SumResponseDTO, ErrorResponseDTO } from '@receipt-reader/shared-types';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const apiRouter = express.Router();

const PORT = process.env.PORT || 3000;

apiRouter.get('/backend-status', (req, res) => {
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

apiRouter.post('/sum', (req: Request<{}, {}, SumRequestDTO>, res) => {
    const { numbers } = req.body;

    // Validate input
    if (!numbers) {
        const error: ErrorResponseDTO = {
            error: 'Bad Request',
            message: 'numbers field is required'
        };
        return res.status(400).json(error);
    }

    if (!Array.isArray(numbers)) {
        const error: ErrorResponseDTO = {
            error: 'Bad Request',
            message: 'numbers must be an array'
        };
        return res.status(400).json(error);
    }

    if (numbers.length === 0) {
        const error: ErrorResponseDTO = {
            error: 'Bad Request',
            message: 'numbers array cannot be empty'
        };
        return res.status(400).json(error);
    }

    // Validate all elements are numbers
    const hasInvalidNumber = numbers.some(n => typeof n !== 'number' || isNaN(n));
    if (hasInvalidNumber) {
        const error: ErrorResponseDTO = {
            error: 'Bad Request',
            message: 'all elements in numbers array must be valid numbers'
        };
        return res.status(400).json(error);
    }

    // Calculate sum
    const sum = numbers.reduce((acc, n) => acc + n, 0);

    const response: SumResponseDTO = { sum };
    res.json(response);
});

app.use('/api', apiRouter);
app.use('/api/users', usersRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
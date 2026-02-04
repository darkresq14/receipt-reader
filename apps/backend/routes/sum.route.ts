import express, { type Router, type Request } from 'express';
import type {
  SumRequestDTO,
  SumResponseDTO,
  ErrorResponseDTO,
} from '@receipt-reader/shared-types';

const router: Router = express.Router();

router.post('/', (req: Request<{}, {}, SumRequestDTO>, res) => {
  const { numbers } = req.body;

  // Validate input
  if (!numbers) {
    const error: ErrorResponseDTO = {
      error: 'Bad Request',
      message: 'numbers field is required',
    };
    return res.status(400).json(error);
  }

  if (!Array.isArray(numbers)) {
    const error: ErrorResponseDTO = {
      error: 'Bad Request',
      message: 'numbers must be an array',
    };
    return res.status(400).json(error);
  }

  if (numbers.length === 0) {
    const error: ErrorResponseDTO = {
      error: 'Bad Request',
      message: 'numbers array cannot be empty',
    };
    return res.status(400).json(error);
  }

  // Validate all elements are numbers
  const hasInvalidNumber = numbers.some(
    (n) => typeof n !== 'number' || isNaN(n),
  );
  if (hasInvalidNumber) {
    const error: ErrorResponseDTO = {
      error: 'Bad Request',
      message: 'all elements in numbers array must be valid numbers',
    };
    return res.status(400).json(error);
  }

  // Calculate sum
  const sum = numbers.reduce((acc, n) => acc + n, 0);

  const response: SumResponseDTO = { sum };
  res.json(response);
});

export default router;

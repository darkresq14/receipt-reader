import { BackendStatusDTO } from '@receipt-reader/shared-types';
import express, { type Router } from 'express';

const router: Router = express.Router();

router.get('/', (req, res) => {
  const status: BackendStatusDTO = {
    status: 'ok',
    message: 'Backend is accessible',
    timestamp: new Date().toISOString(),
  };
  res.json(status);
});

export default router;

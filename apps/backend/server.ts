import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {
  sumRouter,
  healthRouter,
  usersRouter,
  conversationRouter,
  messagesRouter,
} from './routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const router = express.Router();

router.use('/sum', sumRouter);
router.use('/health', healthRouter);
router.use('/users', usersRouter);
router.use('/conversation', conversationRouter);
router.use('/messages', messagesRouter);

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

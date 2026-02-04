import express, { Router, Request, Response } from 'express';
import { ConversationsService } from '../services/conversations.service';
import type { ConversationDTO } from '@receipt-reader/shared-types';

const router: Router = express.Router();
const conversationService = new ConversationsService();

/**
 * Error handler middleware for consistent error responses
 */
function handleError(res: Response, error: unknown, statusCode: number = 500) {
  console.error('Error:', error);
  const message = error instanceof Error ? error.message : 'Unknown error occurred';
  res.status(statusCode).json({ error: message });
}

/**
 * GET /api/conversation
 * Get all conversations
 * Query: ?limit=100 (default)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;

    if (isNaN(limit) || limit < 1 || limit > 1000) {
      return res.status(400).json({ error: 'limit must be a number between 1 and 1000' });
    }

    const data = await conversationService.getAll(limit);
    res.json(data as ConversationDTO[]);
  } catch (error) {
    handleError(res, error);
  }
});

/**
 * POST /api/conversation
 * Create a new conversation
 */
router.post('/', async (_req: Request, res: Response) => {
  try {
    const data = await conversationService.create();
    res.status(201).json(data as ConversationDTO);
  } catch (error) {
    handleError(res, error);
  }
});

/**
 * DELETE /api/conversation/:conversationId
 * Delete a conversation by ID
 */
router.delete('/:conversationId', async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId || typeof conversationId !== 'string') {
      return res.status(400).json({ error: 'conversationId is required' });
    }

    const data = await conversationService.delete(conversationId);
    res.json(data as ConversationDTO);
  } catch (error) {
    handleError(res, error);
  }
});

export default router;

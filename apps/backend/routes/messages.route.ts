import express, { Router, Request, Response } from 'express';
import { MessagesService } from '../services/messages.service';
import type {
  CreateMessageDTO,
  UpdateMessageDTO,
  MessageDTO,
} from '@receipt-reader/shared-types';

const router: Router = express.Router();
const messagesService = new MessagesService();

/**
 * Error handler middleware for consistent error responses
 */
function handleError(res: Response, error: unknown, statusCode: number = 500) {
  console.error('Error:', error);
  const message = error instanceof Error ? error.message : 'Unknown error occurred';
  res.status(statusCode).json({ error: message });
}

/**
 * POST /api/messages
 * Create a new message
 * Body: { text: string, conversationId?: string, role?: number, creatorName?: string }
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { text, conversationId, role, creatorName } = req.body as CreateMessageDTO;

    // Validation: text is required
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'text is required and must be a string' });
    }

    // Optional: validate conversationId if provided
    if (conversationId !== undefined && conversationId !== null && typeof conversationId !== 'string') {
      return res.status(400).json({ error: 'conversationId must be a string or null' });
    }

    // Optional: validate role if provided
    if (role !== undefined && role !== null && typeof role !== 'number') {
      return res.status(400).json({ error: 'role must be a number or null' });
    }

    // Optional: validate creatorName if provided
    if (creatorName !== undefined && creatorName !== null && typeof creatorName !== 'string') {
      return res.status(400).json({ error: 'creatorName must be a string or null' });
    }

    const data = await messagesService.create(text, conversationId ?? null, role ?? null, creatorName ?? null);
    res.status(201).json(data as MessageDTO);
  } catch (error) {
    handleError(res, error);
  }
});

/**
 * GET /api/messages
 * Get all messages
 * Query: ?limit=100 (default)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;

    if (isNaN(limit) || limit < 1 || limit > 1000) {
      return res.status(400).json({ error: 'limit must be a number between 1 and 1000' });
    }

    const data = await messagesService.getAll(limit);
    res.json(data as MessageDTO[]);
  } catch (error) {
    handleError(res, error);
  }
});

/**
 * GET /api/messages/:conversationId
 * Get messages by conversation ID
 */
router.get('/:conversationId', async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId || typeof conversationId !== 'string') {
      return res.status(400).json({ error: 'conversationId is required' });
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;

    if (isNaN(limit) || limit < 1 || limit > 1000) {
      return res.status(400).json({ error: 'limit must be a number between 1 and 1000' });
    }

    const data = await messagesService.getByConversationId(conversationId, limit);
    res.json(data as MessageDTO[]);
  } catch (error) {
    handleError(res, error);
  }
});

/**
 * PUT /api/messages/:id
 * Update a message by ID
 * Body: { text?: string, conversationId?: string | null, role?: number | null, creatorName?: string | null }
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body as UpdateMessageDTO;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'id is required' });
    }

    // Validate at least one field is provided
    if (body.text === undefined && body.conversationId === undefined && body.role === undefined && body.creatorName === undefined) {
      return res.status(400).json({ error: 'At least one field (text, conversationId, role, creatorName) must be provided' });
    }

    // Validate text if provided
    if (body.text !== undefined && body.text !== null && typeof body.text !== 'string') {
      return res.status(400).json({ error: 'text must be a string or null' });
    }

    // Validate conversationId if provided
    if (body.conversationId !== undefined && body.conversationId !== null && typeof body.conversationId !== 'string') {
      return res.status(400).json({ error: 'conversationId must be a string or null' });
    }

    // Validate role if provided
    if (body.role !== undefined && body.role !== null && typeof body.role !== 'number') {
      return res.status(400).json({ error: 'role must be a number or null' });
    }

    // Validate creatorName if provided
    if (body.creatorName !== undefined && body.creatorName !== null && typeof body.creatorName !== 'string') {
      return res.status(400).json({ error: 'creatorName must be a string or null' });
    }

    // Convert camelCase to snake_case for database
    const updates = {
      ...(body.text !== undefined && { text: body.text }),
      ...(body.conversationId !== undefined && { conversation_id: body.conversationId }),
      ...(body.role !== undefined && { role: body.role }),
      ...(body.creatorName !== undefined && { creator_name: body.creatorName }),
    };

    const data = await messagesService.update(id, updates);
    res.json(data as MessageDTO);
  } catch (error) {
    handleError(res, error);
  }
});

/**
 * DELETE /api/messages/:messageId
 * Delete a message by ID
 */
router.delete('/:messageId', async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

    if (!messageId || typeof messageId !== 'string') {
      return res.status(400).json({ error: 'messageId is required' });
    }

    const data = await messagesService.delete(messageId);
    res.json(data as MessageDTO);
  } catch (error) {
    handleError(res, error);
  }
});

export default router;

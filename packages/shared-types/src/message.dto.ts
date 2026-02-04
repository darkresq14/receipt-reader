import type { TablesRow, TablesUpdate } from './database.types';

type MessageRow = TablesRow<'messages'>;
type MessageUpdate = TablesUpdate<'messages'>;

/**
 * MessageDTO - Represents a message (derived from database Row type)
 */
export type MessageDTO = MessageRow;

/**
 * CreateMessageDTO - Request body for creating a new message
 * Derived from MessageInsert but with:
 * - text as required (non-null in request)
 * - camelCase property names for API consumers
 */
export interface CreateMessageDTO {
  text: string;
  conversationId?: string | null;
  role?: number | null;
}

/**
 * UpdateMessageDTO - Request body for updating a message (derived from database Update type)
 * All fields are optional - only provide fields to update
 */
export type UpdateMessageDTO = Partial<Pick<
  MessageUpdate,
  'text' | 'conversation_id' | 'role'
>> & {
  // Allow camelCase for API consumers
  text?: string;
  conversationId?: string | null;
  role?: number | null;
};

/**
 * GetMessagesQueryDTO - Query parameters for getting messages
 */
export interface GetMessagesQueryDTO {
  limit?: number;
}

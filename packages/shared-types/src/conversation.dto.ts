import type { Tables, TablesInsert, TablesUpdate } from './database.types';

type ConversationRow = Tables<'conversations'>;
type ConversationInsert = TablesInsert<'conversations'>;
type ConversationUpdate = TablesUpdate<'conversations'>;

/**
 * ConversationDTO - Represents a conversation (derived from database Row type)
 */
export type ConversationDTO = ConversationRow;

/**
 * CreateConversationDTO - Request body for creating a new conversation (derived from database Insert type)
 * Note: All fields are optional as Supabase generates defaults
 */
export type CreateConversationDTO = Partial<ConversationInsert>;

/**
 * UpdateConversationDTO - Request body for updating a conversation (derived from database Update type)
 */
export type UpdateConversationDTO = Partial<ConversationUpdate>;

/**
 * GetConversationsQueryDTO - Query parameters for getting conversations
 */
export interface GetConversationsQueryDTO {
  limit?: number;
}

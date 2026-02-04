import { supabase } from '../lib/supabase';

/**
 * Messages Service
 * Handles all message-related database operations following Supabase best practices
 */
export class MessagesService {
  /**
   * Create a new message
   * @param text - Message text content
   * @param conversationId - Associated conversation ID
   * @param role - Message role (e.g., user, assistant, system)
   * @param creatorName - Name of the user who created the message
   * @returns The created message
   */
  async create(
    text: string,
    conversationId: string | null,
    role: number | null,
    creatorName: string | null = null,
  ) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        text,
        conversation_id: conversationId,
        role,
        creator_name: creatorName,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Get all messages
   * Ordered by created_at descending (most recent first)
   * @param limit - Maximum number of messages to return (default: 100)
   * @returns Array of messages
   */
  async getAll(limit: number = 100) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Get messages by conversation ID
   * Uses index on conversation_id for optimal query performance
   * @param conversationId - The conversation ID to filter by
   * @param limit - Maximum number of messages to return (default: 100)
   * @returns Array of messages for the specified conversation
   */
  async getByConversationId(conversationId: string, limit: number = 100) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true }) // Chronological order for conversation history
      .limit(limit);

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Delete a message by ID
   * @param messageId - The message ID to delete
   * @returns The deleted message
   */
  async delete(messageId: string) {
    const { data, error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Update a message by ID
   * @param messageId - The message ID to update
   * @param updates - Fields to update (text, conversation_id, role, creator_name)
   * @returns The updated message
   */
  async update(
    messageId: string,
    updates: {
      text?: string | null;
      conversation_id?: string | null;
      role?: number | null;
      creator_name?: string | null;
    },
  ) {
    const { data, error } = await supabase
      .from('messages')
      .update(updates)
      .eq('id', messageId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
}

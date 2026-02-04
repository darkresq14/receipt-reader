import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

type Conversation = Database['public']['Tables']['conversations']['Row'];

/**
 * Conversations Service
 * Handles all conversation-related database operations following Supabase best practices
 */
export class ConversationsService {
  /**
   * Create a new conversation
   * @returns The created conversation
   */
  async create() {
    const { data, error } = await supabase
      .from('conversations')
      .insert({})
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Get all conversations
   * Ordered by created_at descending (most recent first)
   * @param limit - Maximum number of conversations to return (default: 100)
   * @returns Array of conversations
   */
  async getAll(limit: number = 100) {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Delete a conversation by ID
   * Will cascade delete related messages if foreign key constraint is set up
   * @param conversationId - The conversation ID to delete
   * @returns The deleted conversation
   */
  async delete(conversationId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
}

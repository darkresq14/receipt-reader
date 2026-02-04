import { supabase } from '../lib/supabase';
import type { UpdateConversationDTO } from '@receipt-reader/shared-types';

/**
 * Conversations Service
 * Handles all conversation-related database operations following Supabase best practices
 */
export class ConversationsService {
  /**
   * Create a new conversation
   * @param name - Optional name for the conversation (auto-generated if not provided)
   * @returns The created conversation
   */
  async create(name?: string) {
    // Generate a friendly name based on the current date/time if not provided
    const conversationName = name || `Conversation ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

    const { data, error } = await supabase
      .from('conversations')
      .insert({ name: conversationName })
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
   * Get a single conversation by ID
   * @param conversationId - The conversation ID to fetch
   * @returns The conversation
   */
  async getById(conversationId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Update a conversation by ID
   * @param conversationId - The conversation ID to update
   * @param updates - The fields to update
   * @returns The updated conversation
   */
  async update(conversationId: string, updates: UpdateConversationDTO) {
    const { data, error } = await supabase
      .from('conversations')
      .update(updates)
      .eq('id', conversationId)
      .select()
      .single();

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

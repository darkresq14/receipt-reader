import { axiosClient } from './axiosClient';
import type { ConversationDTO, UpdateConversationDTO } from '@receipt-reader/shared-types';

export const conversationsApi = {
  getAll: async (limit = 100): Promise<ConversationDTO[]> => {
    const { data } = await axiosClient.get('/conversation', { params: { limit } });
    return data;
  },

  getById: async (conversationId: string): Promise<ConversationDTO> => {
    const { data } = await axiosClient.get(`/conversation/${conversationId}`);
    return data;
  },

  create: async (name?: string): Promise<ConversationDTO> => {
    const { data } = await axiosClient.post('/conversation', name ? { name } : {});
    return data;
  },

  update: async (conversationId: string, updates: UpdateConversationDTO): Promise<ConversationDTO> => {
    const { data } = await axiosClient.patch(`/conversation/${conversationId}`, updates);
    return data;
  },

  delete: async (conversationId: string): Promise<ConversationDTO> => {
    const { data } = await axiosClient.delete(`/conversation/${conversationId}`);
    return data;
  },
};

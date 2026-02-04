import { axiosClient } from './axiosClient';
import type {
  MessageDTO,
  CreateMessageDTO,
  UpdateMessageDTO,
} from '@receipt-reader/shared-types';

export const messagesApi = {
  getAll: async (limit = 100): Promise<MessageDTO[]> => {
    const { data } = await axiosClient.get('/messages', { params: { limit } });
    return data;
  },

  getByConversationId: async (conversationId: string, limit = 100): Promise<MessageDTO[]> => {
    const { data } = await axiosClient.get(`/messages/${conversationId}`, { params: { limit } });
    return data;
  },

  create: async (messageData: CreateMessageDTO): Promise<MessageDTO> => {
    const { data } = await axiosClient.post('/messages', messageData);
    return data;
  },

  update: async (id: string, messageData: UpdateMessageDTO): Promise<MessageDTO> => {
    const { data } = await axiosClient.put(`/messages/${id}`, messageData);
    return data;
  },

  delete: async (messageId: string): Promise<MessageDTO> => {
    const { data } = await axiosClient.delete(`/messages/${messageId}`);
    return data;
  },
};

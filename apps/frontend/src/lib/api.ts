export { axiosClient } from './axiosClient';

// Re-export as unified api object
import { conversationsApi } from './conversation.api';
import { messagesApi } from './messages.api';

export const api = {
  conversations: conversationsApi,
  messages: messagesApi,
};

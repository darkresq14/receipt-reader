import type { ConversationDTO, MessageDTO } from '@receipt-reader/shared-types';

export type View = 'dashboard' | 'conversation';

export interface DashboardState {
  view: View;
  selectedConversationId: string | null;
  conversations: ConversationDTO[];
  messages: MessageDTO[];
  isLoading: boolean;
  error: string | null;
}

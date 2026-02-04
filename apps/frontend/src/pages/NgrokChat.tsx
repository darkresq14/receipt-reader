import { useState, useCallback, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import { useUsername } from '../contexts/UsernameContext.hooks';
import { UsernameModal } from '../components/UsernameModal';
import type { MessageDTO, ConversationDTO } from '@receipt-reader/shared-types';

export function NgrokChat() {
  const { username } = useUsername();
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [conversation, setConversation] = useState<ConversationDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessageText, setNewMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestMessageRef = useRef<{ id: string; created_at: string } | null>(null);

  const NGROK_CONVERSATION_NAME = 'ngrok';
  const POLL_INTERVAL = 3000; // Poll every 3 seconds

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      setError(null);
      const data = await api.messages.getByConversationId(conversationId);
      setMessages(data);
      // Track the latest message for efficient polling
      if (data.length > 0) {
        const latest = data[data.length - 1];
        latestMessageRef.current = { id: latest.id, created_at: latest.created_at };
      }
      setIsLoading(false);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
      setIsLoading(false);
      return [];
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load conversation and messages on mount, then poll efficiently
  useEffect(() => {
    let mounted = true;
    let pollTimer: number | null = null;

    const init = async () => {
      // Find or create the ngrok conversation
      try {
        const conversations = await api.conversations.getAll();
        let ngrokConversation = conversations.find(
          (c) => c.name === NGROK_CONVERSATION_NAME,
        );

        if (!ngrokConversation) {
          ngrokConversation = await api.conversations.create(NGROK_CONVERSATION_NAME);
        }

        if (!mounted) return;

        setConversation(ngrokConversation);
        await loadMessages(ngrokConversation.id);

        // Set up polling - only fetch if latest message changed
        pollTimer = setInterval(async () => {
          if (!mounted || !ngrokConversation) return;

          // Skip polling if tab is hidden (save resources)
          if (document.hidden) return;

          const latestMessages = await api.messages.getByConversationId(ngrokConversation.id);
          const newLatest = latestMessages[latestMessages.length - 1];

          // Only update if the latest message ID or created_at timestamp changed
          if (newLatest) {
            const current = latestMessageRef.current;
            if (!current || current.id !== newLatest.id || current.created_at !== newLatest.created_at) {
              setMessages(latestMessages);
              latestMessageRef.current = { id: newLatest.id, created_at: newLatest.created_at };
            }
          }
        }, POLL_INTERVAL);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load conversation');
        setIsLoading(false);
      }
    };

    init();

    // Cleanup
    return () => {
      mounted = false;
      if (pollTimer) {
        clearInterval(pollTimer);
      }
    };
    // Only run on mount - empty deps array prevents multiple intervals
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show username modal if no username set
  useEffect(() => {
    if (!username) {
      setShowUsernameModal(true);
    }
  }, [username]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || isSubmitting || !conversation || !username) return;

    try {
      setIsSubmitting(true);
      await api.messages.create({
        text: newMessageText,
        conversationId: conversation.id,
        creatorName: username,
      });
      setNewMessageText('');
      // Reload messages immediately after sending
      await loadMessages(conversation.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isMyMessage = (msg: MessageDTO) => {
    return msg.creator_name === username;
  };

  return (
    <div className="ngrok-chat">
      <header className="ngrok-header">
        <div className="ngrok-header-content">
          <div className="ngrok-title">
            <h1>{NGROK_CONVERSATION_NAME}</h1>
            <span className="ngrok-subtitle">Global Chat</span>
          </div>
          {username && (
            <div className="user-badge">
              <span className="user-name">{username}</span>
              <button
                className="btn btn-small btn-secondary"
                onClick={() => setShowUsernameModal(true)}
                title="Change username">
                Change
              </button>
            </div>
          )}
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="chat-messages-container">
        {isLoading ? (
          <div className="loading">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="empty-state">
            <p>
              No messages yet in the {NGROK_CONVERSATION_NAME} conversation. Be
              the first to say hello!
            </p>
          </div>
        ) : (
          <div className="chat-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message ${isMyMessage(msg) ? 'chat-message-mine' : 'chat-message-theirs'}`}>
                <div className="chat-message-content">
                  <span className="chat-message-sender">
                    {msg.creator_name || 'Anonymous'}
                  </span>
                  <p className="chat-message-text">{msg.text}</p>
                  <span className="chat-message-time">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={newMessageText}
          onChange={(e) => setNewMessageText(e.target.value)}
          placeholder={
            username ? 'Type a message...' : 'Set your username to chat...'
          }
          className="chat-input"
          disabled={isSubmitting || !username}
          maxLength={1000}
        />
        <button
          type="submit"
          className="btn btn-primary btn-send"
          disabled={isSubmitting || !newMessageText.trim() || !username}>
          {isSubmitting ? '...' : 'Send'}
        </button>
      </form>

      {showUsernameModal && (
        <UsernameModal onClose={() => setShowUsernameModal(false)} />
      )}
    </div>
  );
}

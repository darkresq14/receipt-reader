import { useEffect, useState, useCallback, useRef } from 'react';
import { api } from '../lib/api';
import type { MessageDTO, ConversationDTO } from '@receipt-reader/shared-types';

interface ConversationDetailProps {
  conversation: ConversationDTO;
  onBack: () => void;
  onUpdateConversation: (id: string, name: string) => Promise<void>;
}

export function ConversationDetail({ conversation, onBack, onUpdateConversation }: ConversationDetailProps) {
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [newMessageText, setNewMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Conversation rename state
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameText, setRenameText] = useState(conversation.name);
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.messages.getByConversationId(conversation.id);
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, [conversation.id]);

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isRenaming]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    setRenameText(conversation.name);
  }, [conversation.name]);

  const handleCreateMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await api.messages.create({
        text: newMessageText,
        conversationId: conversation.id,
        role: 1, // Default role
      });
      setNewMessageText('');
      await loadMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await api.messages.delete(messageId);
      await loadMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete message');
    }
  };

  const startEditing = (message: MessageDTO) => {
    setIsEditing(message.id);
    setEditText(message.text || '');
  };

  const cancelEditing = () => {
    setIsEditing(null);
    setEditText('');
  };

  const handleUpdateMessage = async (messageId: string) => {
    try {
      await api.messages.update(messageId, { text: editText });
      setIsEditing(null);
      setEditText('');
      await loadMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update message');
    }
  };

  const startRenaming = () => {
    setIsRenaming(true);
    setRenameText(conversation.name);
  };

  const cancelRenaming = () => {
    setIsRenaming(false);
    setRenameText(conversation.name);
  };

  const handleRename = async () => {
    if (!renameText.trim() || isUpdatingName) return;

    try {
      setIsUpdatingName(true);
      await onUpdateConversation(conversation.id, renameText.trim());
      setIsRenaming(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename conversation');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRename();
    } else if (e.key === 'Escape') {
      cancelRenaming();
    }
  };

  return (
    <div className="conversation-detail">
      <header className="detail-header">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <div className={`conversation-title ${isRenaming ? 'is-editing' : ''}`}>
          {isRenaming ? (
            <div className="rename-form-inline">
              <input
                ref={titleInputRef}
                type="text"
                value={renameText}
                onChange={(e) => setRenameText(e.target.value)}
                onKeyDown={handleRenameKeyDown}
                className="rename-input"
                disabled={isUpdatingName}
                placeholder="Conversation name..."
              />
              <div className="rename-actions">
                <button
                  className="icon-btn icon-btn-confirm"
                  onClick={handleRename}
                  disabled={isUpdatingName || !renameText.trim()}
                  title={isUpdatingName ? 'Saving...' : 'Save (Enter)'}
                >
                  {isUpdatingName ? '⏳' : '✓'}
                </button>
                <button
                  className="icon-btn icon-btn-cancel"
                  onClick={cancelRenaming}
                  disabled={isUpdatingName}
                  title="Cancel (Esc)"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <div className="title-with-action">
              <h2 className="conversation-name-display">{conversation.name}</h2>
              <button
                className="icon-btn icon-btn-edit"
                onClick={startRenaming}
                title="Rename conversation"
                aria-label="Rename conversation"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
              </button>
            </div>
          )}
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {isLoading ? (
        <div className="loading">Loading messages...</div>
      ) : (
        <>
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="empty-state">
                <p>No messages yet. Send one below!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`message message-role-${msg.role ?? 0}`}>
                  <div className="message-content">
                    <span className="message-role">Role: {msg.role ?? 'N/A'}</span>
                    {isEditing === msg.id ? (
                      <div className="edit-form">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="message-edit-input"
                          rows={3}
                        />
                        <div className="edit-actions">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleUpdateMessage(msg.id)}
                          >
                            Save
                          </button>
                          <button className="btn btn-secondary" onClick={cancelEditing}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="message-text">{msg.text}</p>
                    )}
                  </div>
                  <div className="message-actions">
                    <span className="message-date">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                    {isEditing !== msg.id && (
                      <>
                        <button
                          className="btn btn-small btn-secondary"
                          onClick={() => startEditing(msg)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-small btn-danger"
                          onClick={() => handleDeleteMessage(msg.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleCreateMessage} className="message-form">
            <input
              type="text"
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              placeholder="Type a message..."
              className="message-input"
              disabled={isSubmitting}
            />
            <button type="submit" className="btn btn-primary" disabled={isSubmitting || !newMessageText.trim()}>
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

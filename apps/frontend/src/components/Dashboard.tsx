import { useState, useRef, useEffect } from 'react';
import type { ConversationDTO } from '@receipt-reader/shared-types';

interface DashboardProps {
  conversations: ConversationDTO[];
  isLoading: boolean;
  error: string | null;
  onSelectConversation: (id: string) => void;
  onCreateConversation: (name?: string) => Promise<void>;
  onDeleteConversation: (id: string) => Promise<void>;
}

export function Dashboard({
  conversations,
  isLoading,
  error,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation,
}: DashboardProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newConversationName, setNewConversationName] = useState('');
  const [isCreatingPending, setIsCreatingPending] = useState(false);
  const createInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCreating && createInputRef.current) {
      createInputRef.current.focus();
    }
  }, [isCreating]);

  const handleCreateConversation = async () => {
    const name = newConversationName.trim() || undefined;
    setIsCreatingPending(true);
    try {
      await onCreateConversation(name);
      setNewConversationName('');
      setIsCreating(false);
    } finally {
      setIsCreatingPending(false);
    }
  };

  const handleCancelCreate = () => {
    setNewConversationName('');
    setIsCreating(false);
  };

  const handleCreateKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreateConversation();
    } else if (e.key === 'Escape') {
      handleCancelCreate();
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Conversations</h1>
        <div className={`create-conversation-wrapper ${isCreating ? 'is-active' : ''}`}>
          {isCreating ? (
            <div className="create-conversation-form-inline">
              <input
                ref={createInputRef}
                type="text"
                value={newConversationName}
                onChange={(e) => setNewConversationName(e.target.value)}
                onKeyDown={handleCreateKeyDown}
                placeholder="Conversation name (optional)"
                className="conversation-name-input"
                disabled={isCreatingPending}
              />
              <div className="create-actions">
                <button
                  className="icon-btn icon-btn-confirm"
                  onClick={handleCreateConversation}
                  disabled={isCreatingPending || isLoading}
                  title="Create (Enter)"
                >
                  {isCreatingPending ? '⏳' : '✓'}
                </button>
                <button
                  className="icon-btn icon-btn-cancel"
                  onClick={handleCancelCreate}
                  disabled={isCreatingPending}
                  title="Cancel (Esc)"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <button
              className="btn btn-primary btn-create"
              onClick={() => setIsCreating(true)}
              disabled={isLoading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Conversation
            </button>
          )}
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {isLoading && !isCreating ? (
        <div className="loading">Loading...</div>
      ) : conversations.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="empty-state-icon">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <p>No conversations yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="conversation-list">
          {conversations.map((conv) => (
            <div key={conv.id} className="conversation-card">
              <div className="conversation-info">
                <span className="conversation-name">{conv.name}</span>
                <span className="conversation-date">
                  {new Date(conv.created_at).toLocaleString()}
                </span>
              </div>
              <div className="conversation-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => onSelectConversation(conv.id)}
                >
                  View
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => onDeleteConversation(conv.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

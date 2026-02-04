import { useState, useCallback, useEffect } from 'react';
import { api } from './lib/api';
import { Dashboard } from './components/Dashboard';
import { ConversationDetail } from './components/ConversationDetail';
import type { ConversationDTO } from '@receipt-reader/shared-types';

function App() {
  const [view, setView] = useState<'dashboard' | 'conversation'>('dashboard');
  const [selectedConversation, setSelectedConversation] = useState<ConversationDTO | null>(null);
  const [conversations, setConversations] = useState<ConversationDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.conversations.getAll();
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectConversation = useCallback((id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setSelectedConversation(conversation);
      setView('conversation');
    }
  }, [conversations]);

  const handleCreateConversation = useCallback(async (name?: string) => {
    try {
      await api.conversations.create(name);
      await loadConversations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create conversation');
    }
  }, [loadConversations]);

  const handleDeleteConversation = useCallback(async (id: string) => {
    try {
      await api.conversations.delete(id);
      await loadConversations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete conversation');
    }
  }, [loadConversations]);

  const handleUpdateConversation = useCallback(async (id: string, name: string) => {
    try {
      await api.conversations.update(id, { name });
      await loadConversations();
      // Update the selected conversation if it's the one being updated
      if (selectedConversation?.id === id) {
        setSelectedConversation({ ...selectedConversation, name });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update conversation');
    }
  }, [selectedConversation, loadConversations]);

  const handleBackToDashboard = useCallback(() => {
    setSelectedConversation(null);
    setView('dashboard');
  }, []);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return (
    <div className="app">
      {view === 'dashboard' ? (
        <Dashboard
          conversations={conversations}
          isLoading={isLoading}
          error={error}
          onSelectConversation={handleSelectConversation}
          onCreateConversation={handleCreateConversation}
          onDeleteConversation={handleDeleteConversation}
        />
      ) : selectedConversation ? (
        <ConversationDetail
          conversation={selectedConversation}
          onBack={handleBackToDashboard}
          onUpdateConversation={handleUpdateConversation}
        />
      ) : null}
    </div>
  );
}

export default App;

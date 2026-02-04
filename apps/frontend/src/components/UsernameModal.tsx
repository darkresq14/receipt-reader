import { useState, useEffect, useRef } from 'react';
import { useUsername } from '../contexts/UsernameContext.hooks';

interface UsernameModalProps {
  onClose: () => void;
}

export function UsernameModal({ onClose }: UsernameModalProps) {
  const { setUsername, username } = useUsername();
  const [inputValue, setInputValue] = useState(username || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input when modal opens
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed && !isSubmitting) {
      setIsSubmitting(true);
      setUsername(trimmed);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{username ? 'Change Username' : 'Welcome to Ngrok Chat'}</h2>
          <p className="modal-subtitle">
            {username ? 'Enter a new username' : 'Enter your username to join the conversation'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Your username..."
            className="username-input"
            disabled={isSubmitting}
            maxLength={30}
            autoFocus
            required
          />
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || !inputValue.trim()}
            >
              {isSubmitting ? 'Saving...' : username ? 'Change' : 'Join Chat'}
            </button>
          </div>
        </form>
        <p className="modal-hint">Press Enter to confirm</p>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import UserForm from './UserForm';
import UserList from './UserList';
import type { BackendStatusDTO } from '@receipt-reader/shared-types';
import './UsersPage.css';

export default function UsersPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [backendStatus, setBackendStatus] = useState<BackendStatusDTO | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          const data = await response.json();
          setBackendStatus(data);
          setStatusError(null);
        } else {
          setStatusError('Backend unavailable');
          setBackendStatus(null);
        }
      } catch {
        setStatusError('Cannot connect to backend');
        setBackendStatus(null);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleUserCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>User Management</h1>
        {backendStatus && (
          <div className="status-badge status-online">
            <span className="status-dot"></span>
            Connected
          </div>
        )}
        {statusError && (
          <div className="status-badge status-offline">
            <span className="status-dot"></span>
            Offline
          </div>
        )}
      </div>
      <div className="users-page-content">
        <UserForm onSuccess={handleUserCreated} />
        <UserList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}

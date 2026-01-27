import { useEffect, useState } from 'react';
import type { UserDTO } from '@receipt-reader/shared-types';

interface UserListProps {
  refreshTrigger: number;
}

export default function UserList({ refreshTrigger }: UserListProps) {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
        const response = await fetch(`/api/users${params}`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setFilteredUsers(data);
        if (!searchQuery) {
          setUsers(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [refreshTrigger, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const displayedUsers = searchQuery ? filteredUsers : users;

  if (isLoading) {
    return (
      <div className="user-list">
        <h2>Users</h2>
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-list">
        <h2>Users</h2>
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h2>Users ({displayedUsers.length})</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      {displayedUsers.length === 0 ? (
        <div className="empty-state">
          <p>{searchQuery ? 'No users match your search.' : 'No users yet. Add your first user using the form above.'}</p>
        </div>
      ) : (
        <div className="users-grid">
          {displayedUsers.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-card-header">
                <h3>{user.name}</h3>
                <span className="user-age">{user.age} years old</span>
              </div>
              <div className="user-card-body">
                <div className="user-field">
                  <span className="field-label">Email:</span>
                  <span className="field-value">{user.email}</span>
                </div>
                <div className="user-field">
                  <span className="field-label">Phone:</span>
                  <span className="field-value">{user.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

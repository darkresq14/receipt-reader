import { createContext, useState, type ReactNode } from 'react';

const USERNAME_STORAGE_KEY = 'ngrok-username';

interface UsernameContextValue {
  username: string | null;
  setUsername: (username: string) => void;
}

const UsernameContext = createContext<UsernameContextValue | undefined>(undefined);

// Initialize username from localStorage during module load
const getInitialUsername = (): string | null => {
  try {
    return localStorage.getItem(USERNAME_STORAGE_KEY);
  } catch {
    return null;
  }
};

export function UsernameProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(getInitialUsername());

  const handleSetUsername = (newUsername: string) => {
    const trimmed = newUsername.trim();
    if (trimmed) {
      setUsername(trimmed);
      try {
        localStorage.setItem(USERNAME_STORAGE_KEY, trimmed);
      } catch {
        // Ignore storage errors (e.g., in private browsing mode)
      }
    }
  };

  return (
    <UsernameContext.Provider value={{ username, setUsername: handleSetUsername }}>
      {children}
    </UsernameContext.Provider>
  );
}

export { UsernameContext };

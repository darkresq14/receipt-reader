import { NgrokChat } from './pages/NgrokChat';
import { UsernameProvider } from './contexts/UsernameContext';

function App() {
  return (
    <UsernameProvider>
      <div className="app">
        <NgrokChat />
      </div>
    </UsernameProvider>
  );
}

export default App;

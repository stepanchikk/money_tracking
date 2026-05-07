import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Синхронізація токена (на випадок видалення з іншої вкладки)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="App">
      {!token ? (
        <Auth setToken={setToken} />
      ) : (
        <Dashboard setToken={setToken} />
      )}
    </div>
  );
}

export default App;

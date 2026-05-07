import React, { useState } from 'react';
import { Mail, Lock, User, Loader2 } from 'lucide-react';

const Auth = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      let data;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Сервер повернув не JSON: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Щось пішло не так');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      minHeight: '100vh', padding: '1rem'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>💰 FinanceTracker</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {isLogin ? 'Увійдіть у свій акаунт' : 'Створіть новий акаунт'}
          </p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: '#fee2e2', color: 'var(--danger)', 
            padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem',
            fontSize: '0.875rem', border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={16} /> Ім'я користувача
              </label>
              <input 
                type="text" 
                required 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="Іван Іванов" 
              />
            </div>
          )}

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} /> Email
            </label>
            <input 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="user@example.com" 
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={16} /> Пароль
            </label>
            <input 
              type="password" 
              required 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••" 
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ 
            marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' 
          }}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Увійти' : 'Зареєструватися')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          {isLogin ? 'Немає акаунту?' : 'Вже маєте акаунт?'}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{ 
              background: 'none', border: 'none', color: 'var(--primary)', 
              fontWeight: 600, cursor: 'pointer', marginLeft: '0.5rem' 
            }}
          >
            {isLogin ? 'Зареєструватися' : 'Увійти'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;

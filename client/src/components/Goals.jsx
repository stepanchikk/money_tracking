import React, { useState, useEffect } from 'react';
import { PlusCircle, Target, Trophy } from 'lucide-react';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await fetch('/api/goals', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setGoals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchGoals();
        setFormData({ name: '', targetAmount: '', deadline: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Ви впевнені?')) return;
    try {
      await fetch(`/api/goals/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-6">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Цілі</h1>
          <p style={{ color: 'var(--text-muted)' }}>Ваші фінансові мрії та плани.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <PlusCircle size={20} /> Додати ціль
        </button>
      </div>

      <div className="stats-grid">
        {goals.map((goal) => (
          <div key={goal._id} className="card">
            <div className="flex-between mb-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '8px', background: '#eef2ff', borderRadius: '10px', color: 'var(--primary)' }}>
                  <Target size={20} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{goal.name}</div>
              </div>
              <button onClick={() => handleDelete(goal._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>Видалити</button>
            </div>

            <div className="mb-4">
              <div className="flex-between mb-2" style={{ fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Прогрес: 0 ₴</span>
                <span style={{ fontWeight: 600 }}>Ціль: {parseFloat(goal.targetAmount).toLocaleString()} ₴</span>
              </div>
              <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: '5%', // Since we don't track savings towards goals yet in the API, showing 0/min progress
                  background: 'var(--primary)',
                  transition: 'width 0.5s ease-in-out'
                }}></div>
              </div>
            </div>

            <div className="flex-between">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {goal.deadline ? `До ${new Date(goal.deadline).toLocaleDateString()}` : 'Без дедлайну'}
              </span>
              <span className="badge badge-info">У процесі</span>
            </div>
          </div>
        ))}
      </div>

      {goals.length === 0 && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <Trophy size={48} style={{ color: 'var(--border)', marginBottom: '1rem' }} />
          <h3>Немає активних цілей</h3>
          <p style={{ color: 'var(--text-muted)' }}>Час запланувати щось велике!</p>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ marginBottom: 0 }}>Нова ціль</h2>
              <button className="btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Назва цілі</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Наприклад: Нове авто" />
                </div>
                <div className="form-group">
                  <label>Цільова сума (₴)</label>
                  <input type="number" required value={formData.targetAmount} onChange={e => setFormData({...formData, targetAmount: e.target.value})} placeholder="500000.00" />
                </div>
                <div className="form-group">
                  <label>Дедлайн (необов'язково)</label>
                  <input type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                </div>
                <button type="submit" className="btn btn-primary mt-4">Зберегти ціль</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;

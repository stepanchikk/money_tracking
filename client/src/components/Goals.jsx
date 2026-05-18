import React, { useState, useEffect } from 'react';
import { PlusCircle, Target, Trophy, TrendingUp, MoreVertical, Edit2, Trash2 } from 'lucide-react';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: 0,
    deadline: ''
  });

  const [addFundsAmount, setAddFundsAmount] = useState('');

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
    const url = editingGoal ? `/api/goals/${editingGoal._id}` : '/api/goals';
    const method = editingGoal ? 'PUT' : 'POST';
    
    try {
      const res = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingGoal(null);
        fetchGoals();
        setFormData({ name: '', targetAmount: '', currentAmount: 0, deadline: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/goals/${selectedGoal._id}/add-funds`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: addFundsAmount })
      });
      if (res.ok) {
        setIsAddFundsOpen(false);
        setSelectedGoal(null);
        setAddFundsAmount('');
        fetchGoals();
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
    setActiveMenu(null);
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: parseFloat(goal.targetAmount?.$numberDecimal || goal.targetAmount),
      currentAmount: parseFloat(goal.currentAmount?.$numberDecimal || goal.currentAmount || 0),
      deadline: goal.deadline ? goal.deadline.split('T')[0] : ''
    });
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  return (
    <div className="animate-fade-in" onClick={() => setActiveMenu(null)}>
      <div className="flex-between mb-12">
        <div>
          <h1>Цілі</h1>
          <p>Ваші фінансові мрії та плани на майбутнє.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingGoal(null); setFormData({ name: '', targetAmount: '', currentAmount: 0, deadline: '' }); setIsModalOpen(true); }}>
          <PlusCircle size={18} /> Нова ціль
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
        {goals.map((goal) => {
          const current = parseFloat(goal.currentAmount?.$numberDecimal || goal.currentAmount || 0);
          const target = parseFloat(goal.targetAmount?.$numberDecimal || goal.targetAmount);
          const progress = Math.min((current / target) * 100, 100);

          return (
            <div key={goal._id} className="card" style={{ position: 'relative', zIndex: activeMenu === goal._id ? 50 : 1 }}>
              <div className="flex-between mb-6">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ padding: '10px', background: 'var(--bg-main)', borderRadius: '12px', color: 'var(--primary)' }}>
                    <Target size={24} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{goal.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {goal.deadline ? `До ${new Date(goal.deadline).toLocaleDateString('uk-UA')}` : 'Без дедлайну'}
                    </div>
                  </div>
                </div>
                
                <div style={{ position: 'relative' }}>
                  <button 
                    className="btn" 
                    onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === goal._id ? null : goal._id); }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                  >
                    <MoreVertical size={20} />
                  </button>
                  
                  {activeMenu === goal._id && (
                    <div style={{ 
                      position: 'absolute', 
                      right: 0, 
                      top: '100%', 
                      zIndex: 100,
                      minWidth: '150px',
                      background: '#fff',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      marginTop: '0.5rem',
                      overflow: 'hidden'
                    }}>
                      <button onClick={() => openEditModal(goal)} style={{ width: '100%', padding: '1rem', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Edit2 size={14} /> Редагувати
                      </button>
                      <button onClick={() => handleDelete(goal._id)} style={{ width: '100%', padding: '1rem', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: 'var(--danger)', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Trash2 size={14} /> Видалити
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex-between mb-3">
                  <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>{current.toLocaleString()} ₴</span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{target.toLocaleString()} ₴</span>
                </div>
                <div style={{ height: '10px', background: 'var(--border-light)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${progress}%`,
                    background: progress >= 100 ? 'var(--success)' : 'var(--primary)',
                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}></div>
                </div>
                <div style={{ textAlign: 'right', marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {progress.toFixed(0)}%
                </div>
              </div>

              <button 
                className="btn btn-outline w-full" 
                onClick={() => { setSelectedGoal(goal); setIsAddFundsOpen(true); }}
                style={{ fontWeight: 700 }}
              >
                <PlusCircle size={16} /> Додати кошти
              </button>
            </div>
          );
        })}
      </div>

      {goals.length === 0 && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <Trophy size={64} style={{ color: 'var(--border)', marginBottom: '1.5rem', opacity: 0.5 }} />
          <h2>У вас ще немає цілей</h2>
          <p style={{ maxWidth: '400px', margin: '0.5rem auto 2rem' }}>Створіть свою першу фінансову ціль, щоб почати ефективно заощаджувати кошти.</p>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Створити першу ціль</button>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => { setIsModalOpen(false); setEditingGoal(null); }}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingGoal ? 'Редагувати ціль' : 'Нова ціль'}</h2>
              <button className="btn" onClick={() => { setIsModalOpen(false); setEditingGoal(null); }}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Назва цілі</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Наприклад: Новий ноутбук" />
                </div>
                <div className="form-group">
                  <label>Цільова сума (₴)</label>
                  <input type="number" required value={formData.targetAmount} onChange={e => setFormData({...formData, targetAmount: e.target.value})} placeholder="0.00" />
                </div>
                {editingGoal && (
                  <div className="form-group">
                    <label>Вже зібрано (₴)</label>
                    <input type="number" value={formData.currentAmount} onChange={e => setFormData({...formData, currentAmount: e.target.value})} />
                  </div>
                )}
                <div className="form-group">
                  <label>Дедлайн (необов'язково)</label>
                  <input type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                </div>
                <button type="submit" className="btn btn-primary w-full mt-4">
                  {editingGoal ? 'Оновити ціль' : 'Створити ціль'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {isAddFundsOpen && (
        <div className="modal-overlay" onClick={() => { setIsAddFundsOpen(false); setSelectedGoal(null); }}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Додати кошти: {selectedGoal?.name}</h2>
              <button className="btn" onClick={() => { setIsAddFundsOpen(false); setSelectedGoal(null); }}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddFunds}>
                <div className="form-group">
                  <label>Сума поповнення (₴)</label>
                  <input 
                    type="number" 
                    autoFocus
                    required 
                    value={addFundsAmount} 
                    onChange={e => setAddFundsAmount(e.target.value)} 
                    placeholder="0.00" 
                  />
                </div>
                <button type="submit" className="btn btn-primary w-full mt-4">Поповнити прогрес</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;

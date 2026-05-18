import React, { useState, useEffect } from 'react';
import { PlusCircle, PieChart, AlertCircle } from 'lucide-react';

const Budgets = ({ categories, fetchData }) => {
  const [budgets, setBudgets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    category: '',
    amountLimit: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await fetch('/api/budgets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      // For each budget, fetch its status
      const budgetsWithStatus = await Promise.all(data.map(async (b) => {
        const statusRes = await fetch(`/api/budgets/${b._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        return await statusRes.json();
      }));
      
      setBudgets(budgetsWithStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchBudgets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Ви впевнені?')) return;
    try {
      await fetch(`/api/budgets/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchBudgets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-6">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Бюджети</h1>
          <p style={{ color: 'var(--text-muted)' }}>Встановлюйте ліміти на витрати за категоріями.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <PlusCircle size={20} /> Створити бюджет
        </button>
      </div>

      <div className="stats-grid">
        {budgets.map(({ budget, totalSpent, remaining, isExceeded }) => (
          <div key={budget._id} className="card">
            <div className="flex-between mb-4">
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{budget.category?.name}</div>
              <button onClick={() => handleDelete(budget._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>Видалити</button>
            </div>
            
            <div className="mb-4">
              <div className="flex-between mb-2" style={{ fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Витрачено: {totalSpent.toLocaleString()} ₴</span>
                <span style={{ fontWeight: 600 }}>Ліміт: {parseFloat(budget.amountLimit).toLocaleString()} ₴</span>
              </div>
              <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${Math.min((totalSpent / budget.amountLimit) * 100, 100)}%`,
                  background: isExceeded ? 'var(--danger)' : 'var(--primary)',
                  transition: 'width 0.5s ease-in-out'
                }}></div>
              </div>
            </div>

            <div className="flex-between">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                До {new Date(budget.endDate).toLocaleDateString()}
              </span>
              {isExceeded ? (
                <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> Перевищено
                </span>
              ) : (
                <span className="badge badge-success">В межах ліміту</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {budgets.length === 0 && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <PieChart size={48} style={{ color: 'var(--border)', marginBottom: '1rem' }} />
          <h3>У вас ще немає бюджетів</h3>
          <p style={{ color: 'var(--text-muted)' }}>Створіть свій перший бюджет, щоб контролювати витрати.</p>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ marginBottom: 0 }}>Новий бюджет</h2>
              <button className="btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Категорія</label>
                  <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="">Оберіть категорію</option>
                    {categories.filter(c => c.type === 'expense').map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Ліміт суми (₴)</label>
                  <input type="number" required value={formData.amountLimit} onChange={e => setFormData({...formData, amountLimit: e.target.value})} placeholder="1000.00" />
                </div>
                <div className="flex-between gap-2">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Початок</label>
                    <input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Кінець</label>
                    <input type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary mt-4">Створити бюджет</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;

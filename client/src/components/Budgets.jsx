import React, { useState, useEffect } from 'react';
import { PlusCircle, PieChart, AlertCircle, MoreVertical, Edit2, Trash2 } from 'lucide-react';

const Budgets = ({ categories, fetchData }) => {
  const [budgets, setBudgets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  
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
    const url = editingBudget ? `/api/budgets/${editingBudget._id}` : '/api/budgets';
    const method = editingBudget ? 'PUT' : 'POST';

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
        setEditingBudget(null);
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
    setActiveMenu(null);
  };

  const openEditModal = (b) => {
    setEditingBudget(b.budget);
    setFormData({
      category: b.budget.category?._id || '',
      amountLimit: parseFloat(b.budget.amountLimit?.$numberDecimal || b.budget.amountLimit),
      startDate: b.budget.startDate.split('T')[0],
      endDate: b.budget.endDate.split('T')[0]
    });
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  return (
    <div className="animate-fade-in" onClick={() => setActiveMenu(null)}>
      <div className="flex-between mb-12">
        <div>
          <h1>Бюджети</h1>
          <p>Контролюйте свої витрати за допомогою лімітів.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingBudget(null); setFormData({ category: '', amountLimit: '', startDate: new Date().toISOString().split('T')[0], endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0] }); setIsModalOpen(true); }}>
          <PlusCircle size={18} /> Новий бюджет
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
        {budgets.map((b) => {
          const { budget, totalSpent, remaining, isExceeded } = b;
          const progress = Math.min((totalSpent / budget.amountLimit) * 100, 100);

          return (
            <div key={budget._id} className="card" style={{ position: 'relative', zIndex: activeMenu === budget._id ? 50 : 1 }}>
              <div className="flex-between mb-6">
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{budget.category?.name}</div>
                
                <div style={{ position: 'relative' }}>
                  <button 
                    className="btn" 
                    onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === budget._id ? null : budget._id); }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                  >
                    <MoreVertical size={20} />
                  </button>
                  
                  {activeMenu === budget._id && (
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
                      <button onClick={() => openEditModal(b)} style={{ width: '100%', padding: '1rem', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Edit2 size={14} /> Редагувати
                      </button>
                      <button onClick={() => handleDelete(budget._id)} style={{ width: '100%', padding: '1rem', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: 'var(--danger)', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Trash2 size={14} /> Видалити
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex-between mb-3" style={{ fontSize: '0.9375rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Витрачено: <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{totalSpent.toLocaleString()} ₴</span></span>
                  <span style={{ fontWeight: 700 }}>{parseFloat(budget.amountLimit).toLocaleString()} ₴</span>
                </div>
                <div style={{ height: '10px', background: 'var(--border-light)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${progress}%`,
                    background: isExceeded ? 'var(--danger)' : 'var(--primary)',
                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}></div>
                </div>
              </div>

              <div className="flex-between" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  До {new Date(budget.endDate).toLocaleDateString('uk-UA')}
                </span>
                {isExceeded ? (
                  <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={14} /> Перевищено
                  </span>
                ) : (
                  <span style={{ color: 'var(--success)' }}>В межах ліміту</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {budgets.length === 0 && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <PieChart size={64} style={{ color: 'var(--border)', marginBottom: '1.5rem', opacity: 0.5 }} />
          <h3>У вас ще немає бюджетів</h3>
          <p style={{ maxWidth: '400px', margin: '0.5rem auto 2rem' }}>Встановіть ліміти на витрати за категоріями, щоб краще контролювати свій гаманець.</p>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Створити бюджет</button>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => { setIsModalOpen(false); setEditingBudget(null); }}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingBudget ? 'Редагувати бюджет' : 'Новий бюджет'}</h2>
              <button className="btn" onClick={() => { setIsModalOpen(false); setEditingBudget(null); }}>✕</button>
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
                  <input type="number" required value={formData.amountLimit} onChange={e => setFormData({...formData, amountLimit: e.target.value})} placeholder="0.00" />
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
                <button type="submit" className="btn btn-primary w-full mt-4">
                  {editingBudget ? 'Оновити бюджет' : 'Зберегти бюджет'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;

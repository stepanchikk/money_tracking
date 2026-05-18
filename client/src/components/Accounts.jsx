import React, { useState } from 'react';
import { Plus, Trash2, CreditCard } from 'lucide-react';

const Accounts = ({ accounts, fetchData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    balance: '',
    currency: 'UAH'
  });

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
        setFormData({ name: '', balance: '', currency: 'UAH' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Ви впевнені? Це видалить рахунок.')) return;
    try {
      await fetch(`/api/accounts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-12">
        <div>
          <h1>Рахунки</h1>
          <p>Керуйте своїми банківськими рахунками та готівкою.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Додати рахунок
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {accounts.map((acc) => (
          <div key={acc._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="flex-between">
              <div style={{ padding: '10px', background: 'var(--bg-main)', borderRadius: '10px', color: 'var(--primary)' }}>
                <CreditCard size={24} />
              </div>
              <button 
                onClick={() => handleDelete(acc._id)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div>
              <div className="stat-label" style={{ marginBottom: '0.25rem' }}>{acc.name}</div>
              <div className="stat-value">{parseFloat(acc.balance?.$numberDecimal || acc.balance).toLocaleString()} ₴</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              <span>{acc.currency}</span>
              <span>**** {acc._id.slice(-4)}</span>
            </div>
          </div>
        ))}
        
        <div 
          onClick={() => setIsModalOpen(true)}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            border: '2px dashed var(--border)',
            borderRadius: 'var(--radius)',
            padding: '2rem',
            cursor: 'pointer',
            height: '215px',
            color: 'var(--text-muted)',
            transition: 'all 0.2s',
            background: 'transparent'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <Plus size={32} strokeWidth={1.5} style={{ marginBottom: '0.75rem' }} />
          <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Новий рахунок</span>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Новий рахунок</h2>
              <button className="btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Назва рахунку</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Наприклад: Monobank" />
                </div>
                <div className="form-group">
                  <label>Початковий баланс</label>
                  <input type="number" step="0.01" required value={formData.balance} onChange={e => setFormData({...formData, balance: e.target.value})} placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label>Валюта</label>
                  <select value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})}>
                    <option value="UAH">UAH (₴)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-full mt-4">Створити рахунок</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;

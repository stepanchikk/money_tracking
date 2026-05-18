import React, { useState } from 'react';
import { PlusCircle, Wallet, Trash2, CreditCard } from 'lucide-react';

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
    if (!window.confirm('Ви впевнені? Це видалить всі транзакції пов\'язані з цим рахунком!')) return;
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
      <div className="flex-between mb-6">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Мої Рахунки</h1>
          <p style={{ color: 'var(--text-muted)' }}>Керуйте своїми банківськими рахунками та готівкою.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <PlusCircle size={20} /> Додати рахунок
        </button>
      </div>

      <div className="stats-grid">
        {accounts.map((acc) => (
          <div key={acc._id} className="card">
            <div className="flex-between mb-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '10px', background: '#e0f2fe', borderRadius: '12px', color: 'var(--info)' }}>
                  <CreditCard size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{acc.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{acc.currency}</div>
                </div>
              </div>
              <button onClick={() => handleDelete(acc._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="mt-4">
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Доступний баланс</div>
              <div className="stat-value">{parseFloat(acc.balance?.$numberDecimal || acc.balance).toLocaleString()} ₴</div>
            </div>
          </div>
        ))}
      </div>

      {accounts.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <Wallet size={48} style={{ color: 'var(--border)', marginBottom: '1rem' }} />
          <h3>Немає активних рахунків</h3>
          <p style={{ color: 'var(--text-muted)' }}>Додайте свій перший рахунок, щоб почати трекінг.</p>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ marginBottom: 0 }}>Новий рахунок</h2>
              <button className="btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Назва рахунку</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Наприклад: Монобанк, Готівка" />
                </div>
                <div className="form-group">
                  <label>Початковий баланс (₴)</label>
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
                <button type="submit" className="btn btn-primary mt-4 w-full">Зберегти рахунок</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;

import React, { useState } from 'react';
import { PlusCircle, TrendingUp, TrendingDown, ArrowRightLeft, Calendar, Search } from 'lucide-react';

const Transactions = ({ transactions, accounts, categories, fetchData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
    account: '',
    toAccount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/transactions', {
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
        setFormData({ ...formData, amount: '', description: '', category: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-6">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Транзакції</h1>
          <p style={{ color: 'var(--text-muted)' }}>Керуйте своїми доходами та витратами.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <PlusCircle size={20} /> Додати транзакцію
        </button>
      </div>

      <div className="card mb-6" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Пошук за описом..." style={{ paddingLeft: '40px' }} />
          </div>
          <select style={{ width: '150px' }}>
            <option value="all">Всі типи</option>
            <option value="income">Дохід</option>
            <option value="expense">Витрата</option>
            <option value="transfer">Переказ</option>
          </select>
          <input type="date" style={{ width: '180px' }} />
        </div>
      </div>

      <div className="list-container">
        {transactions.map(t => (
          <div key={t._id} className="list-item">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ 
                padding: '10px', 
                borderRadius: '12px',
                backgroundColor: t.type === 'income' ? '#dcfce7' : t.type === 'transfer' ? '#fef3c7' : '#fee2e2'
              }}>
                {t.type === 'income' ? <TrendingUp size={20} className="text-success" /> : 
                 t.type === 'transfer' ? <ArrowRightLeft size={20} className="text-warning" /> : 
                 <TrendingDown size={20} className="text-danger" />}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{t.description || t.category?.name || 'Без опису'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(t.date).toLocaleDateString('uk-UA')} • {t.account?.name}
                  {t.type === 'transfer' && ` → ${t.toAccount?.name}`}
                  {t.category && ` • ${t.category.name}`}
                </div>
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }} className={t.type === 'income' ? 'text-success' : t.type === 'expense' ? 'text-danger' : ''}>
              {t.type === 'income' ? '+' : t.type === 'expense' ? '-' : ''} {parseFloat(t.amount?.$numberDecimal || t.amount).toLocaleString()} ₴
            </div>
          </div>
        ))}
        {transactions.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>Транзакцій не знайдено</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ marginBottom: 0 }}>Нова транзакція</h2>
              <button className="btn" onClick={() => setIsModalOpen(false)} style={{ padding: '0.5rem' }}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Тип транзакції</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['expense', 'income', 'transfer'].map(type => (
                      <button 
                        key={type}
                        type="button"
                        className={`btn ${formData.type === type ? 'btn-primary' : 'btn-outline'}`}
                        style={{ flex: 1, textTransform: 'capitalize' }}
                        onClick={() => setFormData({...formData, type})}
                      >
                        {type === 'expense' ? 'Витрата' : type === 'income' ? 'Дохід' : 'Переказ'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Сума</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required 
                    value={formData.amount} 
                    onChange={e => setFormData({...formData, amount: e.target.value})} 
                    placeholder="0.00" 
                  />
                </div>

                <div className="form-group">
                  <label>Рахунок</label>
                  <select 
                    required 
                    value={formData.account} 
                    onChange={e => setFormData({...formData, account: e.target.value})}
                  >
                    <option value="">Оберіть рахунок</option>
                    {accounts.map(acc => <option key={acc._id} value={acc._id}>{acc.name}</option>)}
                  </select>
                </div>

                {formData.type === 'transfer' ? (
                  <div className="form-group">
                    <label>На рахунок</label>
                    <select 
                      required 
                      value={formData.toAccount} 
                      onChange={e => setFormData({...formData, toAccount: e.target.value})}
                    >
                      <option value="">Оберіть рахунок</option>
                      {accounts.map(acc => <option key={acc._id} value={acc._id}>{acc.name}</option>)}
                    </select>
                  </div>
                ) : (
                  <div className="form-group">
                    <label>Категорія (необов'язково)</label>
                    <select 
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="">Без категорії</option>
                      {categories.filter(c => c.type === formData.type).map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label>Дата</label>
                  <input 
                    type="date" 
                    value={formData.date} 
                    onChange={e => setFormData({...formData, date: e.target.value})} 
                  />
                </div>

                <div className="form-group">
                  <label>Опис</label>
                  <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    placeholder="Наприклад: Обід в кафе"
                    rows="2"
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-full mt-4">Зберегти транзакцію</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;

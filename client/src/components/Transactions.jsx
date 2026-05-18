import React, { useState, useMemo } from 'react';
import { Plus, Search, MoreVertical, Trash2, Edit2, Filter } from 'lucide-react';

const Transactions = ({ transactions, accounts, categories, fetchData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);

  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
    account: '',
    toAccount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = (t.description || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (t.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesDate = !filterDate || t.date.startsWith(filterDate);
      return matchesSearch && matchesType && matchesDate;
    });
  }, [transactions, searchTerm, filterType, filterDate]);

  const handleEdit = (t) => {
    setEditingId(t._id);
    setFormData({
      type: t.type,
      amount: parseFloat(t.amount?.$numberDecimal || t.amount),
      description: t.description || '',
      account: t.account?._id || '',
      toAccount: t.toAccount?._id || '',
      category: t.category?._id || '',
      date: new Date(t.date).toISOString().split('T')[0]
    });
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Видалити цю транзакцію?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
    setActiveMenu(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = editingId ? `/api/transactions/${editingId}` : '/api/transactions';
    const method = editingId ? 'PUT' : 'POST';

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
        setEditingId(null);
        fetchData();
        resetForm();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'expense',
      amount: '',
      description: '',
      account: '',
      toAccount: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
  };

  return (
    <div className="animate-fade-in" onClick={() => setActiveMenu(null)}>
      <div className="flex-between mb-12">
        <div>
          <h1>Транзакції</h1>
          <p>Повна історія вашої фінансової активності.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus size={18} /> Додати транзакцію
        </button>
      </div>

      <div className="card mb-12" style={{ padding: '1.25rem 2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Пошук транзакцій..." 
              style={{ border: 'none', paddingLeft: '2rem', background: 'transparent', fontSize: '0.9375rem', fontWeight: 500 }} 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <Filter size={16} />
                <select style={{ border: 'none', background: 'transparent', width: 'auto', fontWeight: 600, padding: 0 }} value={filterType} onChange={e => setFilterType(e.target.value)}>
                  <option value="all">Всі типи</option>
                  <option value="income">Дохід</option>
                  <option value="expense">Витрата</option>
                  <option value="transfer">Переказ</option>
                </select>
             </div>
             <input 
              type="date" 
              style={{ border: 'none', background: 'transparent', width: 'auto', fontWeight: 600, padding: 0, fontSize: '0.875rem' }} 
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="list-container">
          {filteredTransactions.map(t => (
            <div key={t._id} className="list-item" style={{ position: 'relative', zIndex: activeMenu === t._id ? 50 : 1, padding: '1.25rem 0.5rem' }}>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', width: '70px', textTransform: 'uppercase' }}>
                  {new Date(t.date).toLocaleDateString('uk-UA', { month: 'short', day: 'numeric' })}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{t.description || t.category?.name || 'Без назви'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {t.account?.name} {t.type === 'transfer' && `→ ${t.toAccount?.name}`}
                    {t.category && ` • ${t.category.name}`}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', textAlign: 'right', minWidth: '100px' }} className={t.type === 'income' ? 'text-success' : t.type === 'expense' ? 'text-danger' : ''}>
                  {t.type === 'income' ? '+' : t.type === 'expense' ? '-' : ''} {parseFloat(t.amount?.$numberDecimal || t.amount).toLocaleString()} ₴
                </div>
                
                <div style={{ position: 'relative' }}>
                  <button 
                    className="btn" 
                    onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === t._id ? null : t._id); }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                  >
                    <MoreVertical size={18} />
                  </button>
                  
                  {activeMenu === t._id && (
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
                      <button onClick={() => handleEdit(t)} style={{ width: '100%', padding: '1rem', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Edit2 size={14} /> Редагувати
                      </button>
                      <button onClick={() => handleDelete(t._id)} style={{ width: '100%', padding: '1rem', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: 'var(--danger)', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Trash2 size={14} /> Видалити
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filteredTransactions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Транзакцій не знайдено.</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => { setIsModalOpen(false); setEditingId(null); }}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Редагувати' : 'Нова'} транзакція</h2>
              <button className="btn" onClick={() => { setIsModalOpen(false); setEditingId(null); }}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Тип</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="expense">Витрата</option>
                    <option value="income">Дохід</option>
                    <option value="transfer">Переказ</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Сума</label>
                  <input type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0.00" />
                </div>

                <div className="form-group">
                  <label>Рахунок</label>
                  <select required value={formData.account} onChange={e => setFormData({...formData, account: e.target.value})}>
                    <option value="">Оберіть рахунок</option>
                    {accounts.map(acc => <option key={acc._id} value={acc._id}>{acc.name}</option>)}
                  </select>
                </div>

                {formData.type === 'transfer' ? (
                  <div className="form-group">
                    <label>На рахунок</label>
                    <select required value={formData.toAccount} onChange={e => setFormData({...formData, toAccount: e.target.value})}>
                      <option value="">Оберіть ціль</option>
                      {accounts.map(acc => <option key={acc._id} value={acc._id}>{acc.name}</option>)}
                    </select>
                  </div>
                ) : (
                  <div className="form-group">
                    <label>Категорія</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option value="">Без категорії</option>
                      {categories.filter(c => c.type === formData.type).map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label>Дата</label>
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>

                <div className="form-group">
                  <label>Опис</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Додаткові примітки" rows="2"></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-full mt-4">{editingId ? 'Оновити' : 'Створити'}</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;

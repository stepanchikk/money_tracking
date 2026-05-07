import React, { useState, useEffect } from 'react';
import { 
  Wallet, TrendingUp, TrendingDown, PlusCircle, 
  History, PieChart, ArrowRightLeft, X, LogOut, Loader2 
} from 'lucide-react';

function Dashboard({ setToken }) {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('transaction'); // 'transaction' or 'account'
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
    account: '',
    toAccount: '',
    category: '',
    name: '', // for new account
    balance: '', // for new account
    currency: 'UAH'
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const fetchData = async () => {
    try {
      const [accRes, transRes] = await Promise.all([
        fetch('/api/accounts', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/transactions', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const accData = await accRes.json();
      const transData = await transRes.json();

      setAccounts(Array.isArray(accData) ? accData : []);
      setTransactions(Array.isArray(transData) ? transData : []);
      
      if (accData.length > 0 && !formData.account) {
        setFormData(prev => ({ ...prev, account: accData[0]._id }));
      }
    } catch (err) {
      console.error('Помилка завантаження:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Помилка категорій:', err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const endpoint = modalType === 'transaction' ? '/api/transactions' : '/api/accounts';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchData(); // Refresh data
        setFormData({ ...formData, amount: '', description: '', name: '', balance: '' });
      } else {
        const data = await res.json();
        alert(data.message || 'Помилка при створенні');
      }
    } catch (err) {
      alert('Помилка з\'єднання з сервером');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance?.$numberDecimal || acc.balance || 0), 0);
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount?.$numberDecimal || t.amount), 0);
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount?.$numberDecimal || t.amount), 0);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>💰 FinanceTracker</h1>
          <p style={{ color: 'var(--text-muted)' }}>Ваш фінансовий дашборд</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            Додати запис
          </button>
          <button className="btn" onClick={handleLogout} style={{ background: '#fee2e2', color: 'var(--danger)' }}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="card">
          <div className="card-title"><Wallet size={18} /> Загальний баланс</div>
          <div className="card-value">{totalBalance.toLocaleString()} ₴</div>
        </div>
        <div className="card">
          <div className="card-title"><TrendingUp size={18} className="text-success" /> Доходи</div>
          <div className="card-value text-success">+{totalIncome.toLocaleString()} ₴</div>
        </div>
        <div className="card">
          <div className="card-title"><TrendingDown size={18} className="text-danger" /> Витрати</div>
          <div className="card-value text-danger">-{totalExpense.toLocaleString()} ₴</div>
        </div>
      </div>

      <div className="main-content">
        <section>
          <h2><History size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Останні транзакції</h2>
          <div className="transaction-list">
            {transactions.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Транзакцій поки немає</p>
            ) : (
              transactions.map(t => (
                <div key={t._id} className="transaction-item">
                  <div className="item-info">
                    <div style={{ 
                      backgroundColor: t.type === 'income' ? '#dcfce7' : t.type === 'transfer' ? '#fef3c7' : '#fee2e2',
                      padding: '8px', borderRadius: '10px'
                    }}>
                      {t.type === 'income' ? <TrendingUp size={20} className="text-success" /> : 
                       t.type === 'transfer' ? <ArrowRightLeft size={20} className="text-warning" /> : 
                       <TrendingDown size={20} className="text-danger" />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{t.description || t.category?.name || 'Без опису'}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {new Date(t.date).toLocaleDateString('uk-UA')} • {t.account?.name}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }} className={t.type === 'income' ? 'text-success' : t.type === 'expense' ? 'text-danger' : ''}>
                    {t.type === 'income' ? '+' : t.type === 'expense' ? '-' : ''} {parseFloat(t.amount?.$numberDecimal || t.amount).toLocaleString()} ₴
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2>Мої Рахунки</h2>
            {accounts.map(acc => (
              <div key={acc._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span>{acc.name}</span>
                <span style={{ fontWeight: 600 }}>{parseFloat(acc.balance?.$numberDecimal || acc.balance).toLocaleString()} ₴</span>
              </div>
            ))}
          </div>
          <div className="card">
            <h2><PieChart size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Статистика</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Додайте більше транзакцій для аналізу.
            </p>
          </div>
        </section>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ marginBottom: 0 }}>{modalType === 'transaction' ? 'Нова транзакція' : 'Новий рахунок'}</h2>
              <X onClick={() => setIsModalOpen(false)} style={{ cursor: 'pointer' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <button 
                className={`btn ${modalType === 'transaction' ? 'btn-primary' : ''}`}
                style={{ flex: 1, fontSize: '0.8rem', background: modalType !== 'transaction' ? '#f1f5f9' : '' }}
                onClick={() => setModalType('transaction')}
              >Транзакція</button>
              <button 
                className={`btn ${modalType === 'account' ? 'btn-primary' : ''}`}
                style={{ flex: 1, fontSize: '0.8rem', background: modalType !== 'account' ? '#f1f5f9' : '' }}
                onClick={() => setModalType('account')}
              >Рахунок</button>
            </div>

            <form onSubmit={handleCreate}>
              {modalType === 'transaction' ? (
                <>
                  <div className="form-group">
                    <label>Тип</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option value="expense">Витрата</option>
                      <option value="income">Дохід</option>
                      <option value="transfer">Переказ</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Рахунок</label>
                    <select value={formData.account} onChange={e => setFormData({...formData, account: e.target.value})} required>
                      <option value="">Оберіть рахунок</option>
                      {accounts.map(acc => <option key={acc._id} value={acc._id}>{acc.name}</option>)}
                    </select>
                  </div>
                  {formData.type === 'transfer' && (
                    <div className="form-group">
                      <label>Куди переказати</label>
                      <select value={formData.toAccount} onChange={e => setFormData({...formData, toAccount: e.target.value})} required>
                        <option value="">Оберіть рахунок</option>
                        {accounts.map(acc => <option key={acc._id} value={acc._id}>{acc.name}</option>)}
                      </select>
                    </div>
                  )}
                  {formData.type !== 'transfer' && (
                    <div className="form-group">
                      <label>Категорія</label>
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                        <option value="">Оберіть категорію</option>
                        {categories.filter(c => c.type === formData.type).map(c => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="form-group">
                    <label>Сума</label>
                    <input type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0.00" required />
                  </div>
                  <div className="form-group">
                    <label>Опис</label>
                    <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Наприклад: Кава" />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Назва рахунку</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Наприклад: Готівка" required />
                  </div>
                  <div className="form-group">
                    <label>Початковий баланс</label>
                    <input type="number" step="0.01" value={formData.balance} onChange={e => setFormData({...formData, balance: e.target.value})} placeholder="0.00" required />
                  </div>
                  <div className="form-group">
                    <label>Валюта</label>
                    <input type="text" value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})} placeholder="UAH" />
                  </div>
                </>
              )}
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Зберегти</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

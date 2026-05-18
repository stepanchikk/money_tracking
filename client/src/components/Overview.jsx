import React from 'react';
import { TrendingUp, TrendingDown, Wallet, History, ArrowRightLeft } from 'lucide-react';

const Overview = ({ accounts, transactions }) => {
  const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance?.$numberDecimal || acc.balance || 0), 0);
  
  // Calculate this month's income and expenses
  const now = new Date();
  const thisMonth = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const income = thisMonth
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount?.$numberDecimal || t.amount), 0);
    
  const expenses = thisMonth
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount?.$numberDecimal || t.amount), 0);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Привіт! 👋</h1>
        <p style={{ color: 'var(--text-muted)' }}>Ось що відбувається з вашими фінансами сьогодні.</p>
      </div>

      <div className="stats-grid">
        <div className="card">
          <div className="stat-label"><Wallet size={16} /> Загальний баланс</div>
          <div className="stat-value">{totalBalance.toLocaleString()} ₴</div>
        </div>
        <div className="card">
          <div className="stat-label"><TrendingUp size={16} className="text-success" /> Доходи за місяць</div>
          <div className="stat-value text-success">+{income.toLocaleString()} ₴</div>
        </div>
        <div className="card">
          <div className="stat-label"><TrendingDown size={16} className="text-danger" /> Витрати за місяць</div>
          <div className="stat-value text-danger">-{expenses.toLocaleString()} ₴</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }}>
        <section>
          <div className="flex-between mb-6">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 0 }}>
              <History size={20} /> Останні транзакції
            </h2>
            <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>Дивитись всі</button>
          </div>
          
          <div className="list-container">
            {transactions.slice(0, 5).map(t => (
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
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: 700 }} className={t.type === 'income' ? 'text-success' : t.type === 'expense' ? 'text-danger' : ''}>
                  {t.type === 'income' ? '+' : t.type === 'expense' ? '-' : ''} {parseFloat(t.amount?.$numberDecimal || t.amount).toLocaleString()} ₴
                </div>
              </div>
            ))}
            {transactions.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Немає транзакцій</p>}
          </div>
        </section>

        <section>
          <h2 className="mb-6">Мої Рахунки</h2>
          <div className="card" style={{ padding: '1rem' }}>
            {accounts.map(acc => (
              <div key={acc._id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '1rem 0.5rem', 
                borderBottom: accounts.indexOf(acc) !== accounts.length - 1 ? '1px solid var(--border)' : 'none' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                  <span style={{ fontWeight: 500 }}>{acc.name}</span>
                </div>
                <span style={{ fontWeight: 600 }}>{parseFloat(acc.balance?.$numberDecimal || acc.balance).toLocaleString()} ₴</span>
              </div>
            ))}
            {accounts.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>Рахунків немає</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Overview;

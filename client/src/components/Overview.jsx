import React from 'react';
import { TrendingUp, TrendingDown, Wallet, History, ArrowRightLeft } from 'lucide-react';

const Overview = ({ accounts, transactions }) => {
  const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance?.$numberDecimal || acc.balance || 0), 0);
  
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
      <div className="mb-8">
        <h1>Дашборд</h1>
        <p>Короткий огляд вашої фінансової активності.</p>
      </div>

      <div className="stats-grid">
        <div className="card">
          <div className="stat-label">Загальний баланс</div>
          <div className="stat-value">{totalBalance.toLocaleString()} ₴</div>
        </div>
        <div className="card">
          <div className="stat-label">Дохід за місяць</div>
          <div className="stat-value text-success">+{income.toLocaleString()} ₴</div>
        </div>
        <div className="card">
          <div className="stat-label">Витрати за місяць</div>
          <div className="stat-value text-danger">-{expenses.toLocaleString()} ₴</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '3rem', marginTop: '3rem' }}>
        <section>
          <div className="flex-between mb-8">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <History size={20} /> Останні транзакції
            </h2>
            <button className="btn btn-outline" style={{ fontSize: '0.75rem' }}>Всі транзакції</button>
          </div>
          
          <div className="list-container card">
            {transactions.slice(0, 5).map(t => (
              <div key={t._id} className="list-item" style={{ padding: '1rem 1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '8px', 
                    background: t.type === 'income' ? 'var(--bg-main)' : 'var(--bg-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {t.type === 'income' ? <TrendingUp size={16} className="text-success" /> : 
                     t.type === 'transfer' ? <ArrowRightLeft size={16} className="text-warning" /> : 
                     <TrendingDown size={16} className="text-danger" />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{t.description || t.category?.name || 'Без назви'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(t.date).toLocaleDateString('uk-UA')} • {t.account?.name}
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem' }} className={t.type === 'income' ? 'text-success' : t.type === 'expense' ? 'text-danger' : ''}>
                  {t.type === 'income' ? '+' : t.type === 'expense' ? '-' : ''} {parseFloat(t.amount?.$numberDecimal || t.amount).toLocaleString()} ₴
                </div>
              </div>
            ))}
            {transactions.length === 0 && <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Транзакцій ще немає.</p>}
          </div>
        </section>

        <section>
          <h2 className="mb-8">Ваші рахунки</h2>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {accounts.map(acc => (
              <div key={acc._id} style={{ paddingBottom: '1.25rem', borderBottom: accounts.indexOf(acc) !== accounts.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                <div className="stat-label" style={{ marginBottom: '0.25rem' }}>{acc.name}</div>
                <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>{parseFloat(acc.balance?.$numberDecimal || acc.balance).toLocaleString()} ₴</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>**** {acc._id.slice(-4)}</div>
              </div>
            ))}
            {accounts.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Рахунків не знайдено.</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Overview;

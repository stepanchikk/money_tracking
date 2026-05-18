import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// Import sub-components
import Sidebar from './Sidebar';
import Overview from './Overview';
import Transactions from './Transactions';
import Accounts from './Accounts';
import Budgets from './Budgets';
import Goals from './Goals';
import Reports from './Reports';
import Categories from './Categories';

function Dashboard({ setToken }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview accounts={accounts} transactions={transactions} />;
      case 'transactions':
        return <Transactions transactions={transactions} accounts={accounts} categories={categories} fetchData={fetchData} />;
      case 'accounts':
        return <Accounts accounts={accounts} fetchData={fetchData} />;
      case 'categories':
        return <Categories categories={categories} fetchCategories={fetchCategories} />;
      case 'budgets':
        return <Budgets categories={categories} fetchData={fetchData} />;
      case 'goals':
        return <Goals />;
      case 'reports':
        return <Reports />;
      default:
        return <Overview accounts={accounts} transactions={transactions} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} setToken={setToken} />
      
      <main className="main-wrapper">
        <header style={{ 
          height: 'var(--header-height)', 
          backgroundColor: 'var(--bg-sidebar)', 
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 2rem',
          justifyContent: 'flex-end'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Користувач</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Особистий кабінет</div>
            </div>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700
            }}>
              U
            </div>
          </div>
        </header>

        <div className="content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

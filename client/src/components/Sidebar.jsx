import React from 'react';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  Wallet, 
  PieChart, 
  Target, 
  LogOut,
  ChevronRight,
  BarChart3,
  Tag
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, setToken }) => {
  const menuItems = [
    { id: 'overview', label: 'Огляд', icon: LayoutDashboard },
    { id: 'transactions', label: 'Транзакції', icon: ArrowRightLeft },
    { id: 'accounts', label: 'Рахунки', icon: Wallet },
    { id: 'categories', label: 'Категорії', icon: Tag },
    { id: 'budgets', label: 'Бюджети', icon: PieChart },
    { id: 'goals', label: 'Цілі', icon: Target },
    { id: 'reports', label: 'Звіти', icon: BarChart3 },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div style={{ 
          background: 'var(--primary)', 
          padding: '8px', 
          borderRadius: '10px',
          color: 'white'
        }}>
          <Wallet size={24} />
        </div>
        <span>Finance Pro</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
            {activeTab === item.id && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="nav-item text-danger" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
          <LogOut size={20} />
          <span>Вийти</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

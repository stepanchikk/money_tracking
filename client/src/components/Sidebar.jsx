import React from 'react';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  Wallet, 
  PieChart, 
  Target, 
  LogOut,
  BarChart3,
  Tag,
  CircleDollarSign
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
        <CircleDollarSign size={28} strokeWidth={2.5} />
        <span>FinancePro</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="nav-item" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Вийти</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

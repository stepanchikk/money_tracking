import React, { useState } from 'react';
import { PlusCircle, Tag, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

const Categories = ({ categories, fetchCategories }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    icon: ''
  });

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchCategories();
        setFormData({ name: '', type: 'expense', icon: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Ви впевнені? Видалення категорії не видалить транзакції, але вони залишаться без категорії.')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.message || 'Не вдалося видалити категорію');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-6">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Категорії</h1>
          <p style={{ color: 'var(--text-muted)' }}>Створюйте власні категорії для детального обліку.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <PlusCircle size={20} /> Додати категорію
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <section>
          <h2 className="mb-4 text-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingDown size={20} /> Витрати
          </h2>
          <div className="list-container">
            {categories.filter(c => c.type === 'expense').map(cat => (
              <div key={cat._id} className="list-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ padding: '8px', background: '#fee2e2', borderRadius: '10px', color: 'var(--danger)' }}>
                    <Tag size={18} />
                  </div>
                  <span style={{ fontWeight: 500 }}>{cat.name}</span>
                  {cat.user === null && <span className="badge badge-info" style={{ fontSize: '0.6rem' }}>Системна</span>}
                </div>
                {cat.user !== null && (
                  <button onClick={() => handleDelete(cat._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-success" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} /> Доходи
          </h2>
          <div className="list-container">
            {categories.filter(c => c.type === 'income').map(cat => (
              <div key={cat._id} className="list-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ padding: '8px', background: '#dcfce7', borderRadius: '10px', color: 'var(--success)' }}>
                    <Tag size={18} />
                  </div>
                  <span style={{ fontWeight: 500 }}>{cat.name}</span>
                  {cat.user === null && <span className="badge badge-info" style={{ fontSize: '0.6rem' }}>Системна</span>}
                </div>
                {cat.user !== null && (
                  <button onClick={() => handleDelete(cat._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ marginBottom: 0 }}>Нова категорія</h2>
              <button className="btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Назва категорії</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Наприклад: Підписки, Подарунки" />
                </div>
                <div className="form-group">
                  <label>Тип</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="expense">Витрата</option>
                    <option value="income">Дохід</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Іконка (необов'язково)</label>
                  <input type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} placeholder="Emoji або назва іконки" />
                </div>
                <button type="submit" className="btn btn-primary mt-4 w-full">Зберегти категорію</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;

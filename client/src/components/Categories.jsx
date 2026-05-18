import React, { useState } from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';

const Categories = ({ categories, fetchCategories }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'expense' });

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
        setFormData({ name: '', type: 'expense' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete category?')) return;
    try {
      await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-12">
        <div>
          <h1>Categories</h1>
          <p>Organize your transactions efficiently.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Category
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem' }}>
        <section>
          <h2 className="mb-8">Expense Categories</h2>
          <div className="list-container">
            {categories.filter(c => c.type === 'expense').map(cat => (
              <div key={cat._id} className="list-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Tag size={16} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontWeight: 500 }}>{cat.name}</span>
                </div>
                <button onClick={() => deleteCategory(cat._id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-8">Income Categories</h2>
          <div className="list-container">
            {categories.filter(c => c.type === 'income').map(cat => (
              <div key={cat._id} className="list-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Tag size={16} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontWeight: 500 }}>{cat.name}</span>
                </div>
                <button onClick={() => deleteCategory(cat._id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Category</h2>
              <button className="btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Food, Salary" />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-full mt-4">Create Category</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;

import React, { useState, useEffect } from 'react';
import { BarChart3, Calendar, Download } from 'lucide-react';

const Reports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports/summary?startDate=${dates.startDate}&endDate=${dates.endDate}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-6">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Звіти та Аналітика</h1>
          <p style={{ color: 'var(--text-muted)' }}>Аналізуйте свої витрати за будь-який період.</p>
        </div>
        <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Download size={18} /> Експорт
        </button>
      </div>

      <div className="card mb-6" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label>Початок періоду</label>
            <input type="date" value={dates.startDate} onChange={e => setDates({...dates, startDate: e.target.value})} />
          </div>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label>Кінець періоду</label>
            <input type="date" value={dates.endDate} onChange={e => setDates({...dates, endDate: e.target.value})} />
          </div>
          <button className="btn btn-primary" onClick={fetchReport} disabled={loading}>
            Оновити звіт
          </button>
        </div>
      </div>

      {report && (
        <>
          <div className="stats-grid">
            {report.summary.map(stat => (
              <div key={stat._id} className="card">
                <div className="stat-label">
                  {stat._id === 'income' ? 'Загальний дохід' : stat._id === 'expense' ? 'Загальні витрати' : 'Перекази'}
                </div>
                <div className={`stat-value ${stat._id === 'income' ? 'text-success' : stat._id === 'expense' ? 'text-danger' : ''}`}>
                  {stat.total.toLocaleString()} ₴
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {stat.count} транзакцій
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <h2 className="mb-6">Витрати за категоріями</h2>
            <div className="list-container">
              {report.byCategory.filter(c => c.type === 'expense').map(cat => (
                <div key={cat.categoryName} className="mb-4">
                  <div className="flex-between mb-2">
                    <span style={{ fontWeight: 600 }}>{cat.categoryName}</span>
                    <span style={{ fontWeight: 700 }}>{cat.total.toLocaleString()} ₴</span>
                  </div>
                  <div style={{ height: '10px', background: 'var(--border)', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${Math.min((cat.total / report.summary.find(s => s._id === 'expense')?.total || 1) * 100, 100)}%`,
                      background: 'var(--primary)',
                    }}></div>
                  </div>
                </div>
              ))}
              {report.byCategory.filter(c => c.type === 'expense').length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Даних про витрати немає</p>
              )}
            </div>
          </div>
        </>
      )}

      {loading && <p style={{ textAlign: 'center', padding: '2rem' }}>Завантаження звіту...</p>}
    </div>
  );
};

export default Reports;

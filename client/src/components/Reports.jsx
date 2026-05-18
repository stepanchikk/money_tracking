import React, { useState, useEffect } from 'react';
import { Download, Calendar, Filter, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

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

  const setPreset = (period) => {
    const end = new Date();
    let start = new Date();
    if (period === 'thisMonth') start = new Date(end.getFullYear(), end.getMonth(), 1);
    else if (period === 'lastMonth') { start = new Date(end.getFullYear(), end.getMonth() - 1, 1); end.setDate(0); }
    else if (period === 'thisYear') start = new Date(end.getFullYear(), 0, 1);
    setDates({ startDate: start.toISOString().split('T')[0], endDate: end.toISOString().split('T')[0] });
  };

  useEffect(() => { if (token) fetchReport(); }, [dates.startDate, dates.endDate]);

  const exportToCSV = () => {
    if (!report) return;
    let csv = "Тип,Категорія,Сума\n";
    report.byCategory.forEach(cat => { csv += `${cat.type === 'income' ? 'Дохід' : 'Витрата'},${cat.categoryName},${cat.total}\n`; });
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `zvit_${dates.startDate}_${dates.endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const income = report?.summary.find(s => s._id === 'income')?.total || 0;
  const expense = report?.summary.find(s => s._id === 'expense')?.total || 0;
  const net = income - expense;

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-12">
        <div>
          <h1>Звіти та Аналітика</h1>
          <p>Детальний аналіз ваших фінансів за вибраний період.</p>
        </div>
        <button className="btn btn-outline" onClick={exportToCSV} disabled={!report || loading}>
          <Download size={16} /> Експорт CSV
        </button>
      </div>

      <div className="card mb-12" style={{ padding: '1.25rem 2rem' }}>
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>З</span>
              <input type="date" value={dates.startDate} onChange={e => setDates({...dates, startDate: e.target.value})} style={{ border: 'none', background: 'transparent', width: 'auto', fontWeight: 600, fontSize: '0.875rem', padding: 0 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>ПО</span>
              <input type="date" value={dates.endDate} onChange={e => setDates({...dates, endDate: e.target.value})} style={{ border: 'none', background: 'transparent', width: 'auto', fontWeight: 600, fontSize: '0.875rem', padding: 0 }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
            <button className="btn" onClick={() => setPreset('thisMonth')} style={{ fontSize: '0.75rem', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>ЦЕЙ МІСЯЦЬ</button>
            <button className="btn" onClick={() => setPreset('lastMonth')} style={{ fontSize: '0.75rem', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>МИНУЛИЙ МІСЯЦЬ</button>
            <button className="btn" onClick={() => setPreset('thisYear')} style={{ fontSize: '0.75rem', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>ЦЕЙ РІК</button>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Оновлення даних...</p>
        </div>
      ) : report ? (
        <>
          <div className="stats-grid">
            <div className="card">
              <div className="stat-label">Доходи</div>
              <div className="stat-value text-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={24} />
                {income.toLocaleString()} ₴
              </div>
            </div>
            <div className="card">
              <div className="stat-label">Витрати</div>
              <div className="stat-value text-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingDown size={24} />
                {expense.toLocaleString()} ₴
              </div>
            </div>
            <div className="card">
              <div className="stat-label">Чистий прибуток</div>
              <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wallet size={24} />
                {net.toLocaleString()} ₴
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '3rem' }}>
            <section className="card">
              <h2 className="mb-8">Розподіл витрат</h2>
              <div className="list-container">
                {report.byCategory.filter(c => c.type === 'expense').map(cat => (
                  <div key={cat.categoryName} className="list-item" style={{ padding: '1rem 0' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{cat.categoryName}</span>
                    <span style={{ fontWeight: 700 }}>{cat.total.toLocaleString()} ₴</span>
                  </div>
                ))}
                {report.byCategory.filter(c => c.type === 'expense').length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>Даних немає.</p>}
              </div>
            </section>
            <section className="card">
              <h2 className="mb-8">Розподіл доходів</h2>
              <div className="list-container">
                {report.byCategory.filter(c => c.type === 'income').map(cat => (
                  <div key={cat.categoryName} className="list-item" style={{ padding: '1rem 0' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{cat.categoryName}</span>
                    <span style={{ fontWeight: 700 }}>{cat.total.toLocaleString()} ₴</span>
                  </div>
                ))}
                {report.byCategory.filter(c => c.type === 'income').length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>Даних немає.</p>}
              </div>
            </section>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Reports;

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, MapPin, Clock } from 'lucide-react';

type Report = {
  id: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string | null;
  status: string;
  createdAt: string;
};

export default function Home() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch('/api/reports');
        if (res.ok) {
          const data = await res.json();
          setReports(data);
        }
      } catch (error) {
        console.error('Failed to fetch reports', error);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'PENDING': return 'status-pending';
      case 'IN_PROGRESS': return 'status-progress';
      case 'RESOLVED': return 'status-resolved';
      default: return 'status-pending';
    }
  };

  return (
    <>
      <header className="header">
        <h1>EcoWatch</h1>
        <p>Platform Pelaporan Lingkungan Masyarakat</p>
      </header>

      <div className="dashboard-actions">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Laporan Terbaru</h2>
        <Link href="/report" className="btn primary-glow">
          <Plus size={20} /> Buat Laporan
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <p>Memuat laporan...</p>
        </div>
      ) : reports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <p>Belum ada laporan. Jadilah yang pertama melaporkan!</p>
        </div>
      ) : (
        <div className="reports-grid">
          {reports.map((report, i) => (
            <div 
              key={report.id} 
              className="report-card"
              style={{ animationDelay: `${(i % 10) * 0.1}s` }}
            >
              {report.imageUrl ? (
                <img src={report.imageUrl} alt={report.title} className="report-image" />
              ) : (
                <div className="report-image-placeholder">
                  <span>Tidak ada foto terlapor</span>
                </div>
              )}
              
              <div className="report-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 className="report-title" title={report.title}>{report.title}</h3>
                </div>
                
                <p className="report-desc">{report.description}</p>
                
                <div className="report-meta">
                  <span className={`status-badge ${getStatusClass(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                
                <div className="report-meta" style={{ marginTop: '0.5rem', paddingTop: '0.5rem', border: 'none' }}>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span style={{ maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {report.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>{new Date(report.createdAt).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

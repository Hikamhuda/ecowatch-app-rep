'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, UploadCloud, Loader2 } from 'lucide-react';

export default function ReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    if (file) {
      formData.set('image', file);
    } else {
      formData.delete('image');
    }
    
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to submit report');
      }

      router.push('/');
      router.refresh();
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'Terjadi kesalahan saat mengirim laporan.');
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/" className="btn" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
          <ArrowLeft size={18} /> Kembali
        </Link>
      </div>

      <div className="form-container">
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Buat Laporan Baru
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Laporkan masalah lingkungan di sekitar Anda.
        </p>

        {errorMsg && (
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--danger)', color: '#fca5a5', marginBottom: '1.5rem', borderRadius: '4px' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">Judul Laporan *</label>
            <input type="text" id="title" name="title" className="form-input" required placeholder="Contoh: Tumpukan sampah di jalan A" />
          </div>

          <div className="form-group">
            <label htmlFor="location" className="form-label">Lokasi *</label>
            <input type="text" id="location" name="location" className="form-input" required placeholder="Alamat lengkap atau patokan" />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Deskripsi *</label>
            <textarea id="description" name="description" className="form-textarea" required placeholder="Jelaskan detail masalahnya..." />
          </div>

          <div className="form-group">
            <label className="form-label">Foto Bukti</label>
            <div className="file-input-wrapper">
              {previewUrl ? (
                <div style={{ position: 'relative', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                  <button 
                    type="button" 
                    onClick={() => { setFile(null); setPreviewUrl(null); }}
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <input type="file" name="image" accept="image/*" onChange={handleFileChange} />
                  <div className="file-custom-btn">
                    <UploadCloud size={24} />
                    <span>Klik atau seret foto ke sini</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <button type="submit" className="btn primary-glow" style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginTop: '1rem' }} disabled={loading}>
            {loading ? (
              <><Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> Mengirim...</>
            ) : (
              'Kirim Laporan'
            )}
          </button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </>
  );
}

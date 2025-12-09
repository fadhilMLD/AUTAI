import React from 'react';

interface ToolbarProps {
  onExport?: () => void;
  onImport?: () => void;
  onShowTutorial?: () => void;
  onDownloadEvaluation?: () => void; // Add new prop
}

const Toolbar: React.FC<ToolbarProps> = ({ onExport, onImport, onShowTutorial, onDownloadEvaluation }) => {
  return (
    <div className="toolbar" style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 20px',
      background: 'linear-gradient(90deg, #0a0a0f 0%, #12121a 100%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.4)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: '22px', 
          color: '#fff',
          fontWeight: 700,
          letterSpacing: '0.5px',
          background: 'linear-gradient(to right, #2a8db8, #4a6fa5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>Autai</h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          color: '#8a9db8',
          fontSize: '12px',
          borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
          paddingLeft: '15px',
          lineHeight: '1.4'
        }}>
          <span>By Fadhil</span>
          <span style={{ fontStyle: 'italic' }}>-Feaven Technologies-</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        {/* Tutorial button */}
        <button 
          onClick={onShowTutorial}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.2)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <path d="M12 17h.01"/>
          </svg>
          <span>Help</span>
        </button>
        
        {/* Import button */}
        <button 
          onClick={onImport}
          style={{
            background: 'linear-gradient(135deg, #0f5e5e 0%, #1a7a7a 100%)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600',
            boxShadow: '0 2px 10px rgba(15, 94, 94, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(15, 94, 94, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(15, 94, 94, 0.3)';
          }}
        >
          <span>Import Model</span>
        </button>
        
        {/* Export button */}
        <button 
          onClick={onExport}
          style={{
            background: 'linear-gradient(135deg, #2a4d7a 0%, #3d5a7a 100%)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600',
            boxShadow: '0 2px 10px rgba(42, 77, 122, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(42, 77, 122, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(42, 77, 122, 0.3)';
          }}
        >
          <span>Export Model</span>
        </button>

        {/* Download Evaluation Script button */}
        <button 
          onClick={onDownloadEvaluation}
          style={{
            background: 'linear-gradient(135deg, #7a2a4d 0%, #5a1a4d 100%)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600',
            boxShadow: '0 2px 10px rgba(122, 42, 77, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(122, 42, 77, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(122, 42, 77, 0.3)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Download Evaluation</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
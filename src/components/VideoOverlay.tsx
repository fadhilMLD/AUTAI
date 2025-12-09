import React, { useState, useEffect } from 'react';

interface VideoOverlayProps {
    onClose: () => void;
}

const VideoOverlay: React.FC<VideoOverlayProps> = ({ onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    // Handle keyboard events
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [dontShowAgain]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            if (dontShowAgain) {
                localStorage.setItem('autai-tutorial-never-show', 'true');
            }
            onClose();
        }, 200);
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.2s ease-out',
            }}
            onClick={handleOverlayClick}
        >
            <div style={{
                position: 'relative',
                maxWidth: '95vw',
                maxHeight: '95vh',
                width: '900px',
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                transform: isVisible ? 'scale(1)' : 'scale(0.95)',
                transition: 'transform 0.2s ease-out',
            }}>
                {/* Header */}
                <div style={{
                    padding: '24px 32px',
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid #f1f3f4',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{
                            margin: 0,
                            fontSize: '24px',
                            fontWeight: '600',
                            color: '#1f2937',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        }}>
                            Getting Started with Autai
                        </h2>
                        <p style={{
                            margin: '4px 0 0 0',
                            fontSize: '14px',
                            color: '#6b7280',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        }}>
                            Learn how to build neural networks visually
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#9ca3af',
                            fontSize: '20px',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                            e.currentTarget.style.color = '#374151';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#9ca3af';
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Video Container */}
                <div style={{
                    padding: '0 32px 24px 32px'
                }}>
                    <video
                        controls
                        autoPlay
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '65vh',
                            borderRadius: '12px',
                            outline: 'none',
                            backgroundColor: '#f9fafb',
                            border: '1px solid #e5e7eb',
                        }}
                    >
                        <source src="/media/Tutorial_1.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '20px 32px 32px 32px',
                    backgroundColor: '#fafbfc',
                    borderTop: '1px solid #f1f3f4',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px', 
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#6b7280',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}>
                        <input 
                            type="checkbox" 
                            checked={dontShowAgain}
                            onChange={(e) => setDontShowAgain(e.target.checked)}
                            style={{ 
                                cursor: 'pointer',
                                accentColor: '#3b82f6',
                                width: '16px',
                                height: '16px',
                            }}
                        />
                        Don't show this tutorial again
                    </label>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={handleClose}
                            style={{
                                background: '#ffffff',
                                border: '1px solid #d1d5db',
                                color: '#6b7280',
                                padding: '12px 20px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'all 0.2s ease',
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f9fafb';
                                e.currentTarget.style.borderColor = '#9ca3af';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#ffffff';
                                e.currentTarget.style.borderColor = '#d1d5db';
                            }}
                        >
                            Skip Tutorial
                        </button>
                        <button
                            onClick={handleClose}
                            style={{
                                background: '#3b82f6',
                                border: 'none',
                                color: 'white',
                                padding: '12px 20px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'all 0.2s ease',
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                        >
                            {dontShowAgain ? 'Got it, don\'t show again' : 'Continue to Autai'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoOverlay;
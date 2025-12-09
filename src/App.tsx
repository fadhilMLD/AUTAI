import React, { useState, useRef, useEffect } from 'react';
import Canvas from './components/canvas/Canvas';
import LayerLibrary from './components/sidebar/LayerLibrary';
import PropertiesPanel from './components/sidebar/PropertiesPanel';
import Toolbar from './components/controls/Toolbar';
import VideoOverlay from './components/VideoOverlay';

interface TrainingOptions {
    batchSize: number;
    epochs: number;
    learningRate: number;
    optimizer: string;
    lossFunction: string;
}

const App: React.FC = () => {
    // State for video overlay
    const [showVideoOverlay, setShowVideoOverlay] = useState(false);
    
    // Add state to track export status
    const [exportStatus, setExportStatus] = useState<{
        isExporting: boolean;
        message: string;
        isError: boolean;
    }>({
        isExporting: false,
        message: '',
        isError: false
    });
    
    // Add state for evaluation download status
    const [evalStatus, setEvalStatus] = useState<{
        isDownloading: boolean;
        message: string;
        isError: boolean;
    }>({
        isDownloading: false,
        message: '',
        isError: false
    });

    // State for training options
    const [trainingOptions, setTrainingOptions] = useState<TrainingOptions>({
        batchSize: 32,
        epochs: 10,
        learningRate: 0.001,
        optimizer: 'adam',
        lossFunction: 'mse',
    });

    // Track visitor on page load with better error handling
    useEffect(() => {
        const trackVisitor = async () => {
            try {
                // Build endpoint list
                const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
                const metaTag = document.querySelector('meta[name="autai:api-base"]');
                const metaApiBase = metaTag ? (metaTag.getAttribute('content') || '').trim() : '';
                const apiBaseRaw = (process.env.REACT_APP_API_BASE || metaApiBase || '');
                const apiBase = apiBaseRaw.replace(/\/+$/, '');
                const sameOrigin = (typeof window !== 'undefined' ? window.location.origin : '').replace(/\/+$/, '');

                const candidates = [
                    apiBase ? `${apiBase}/api/track-visitor` : '',
                    apiBase ? `${apiBase}/track-visitor` : '',
                    `${sameOrigin}/api/track-visitor`,
                    `${sameOrigin}/track-visitor`,
                    !isHttps ? 'http://localhost:5000/api/track-visitor' : ''
                ].filter(Boolean);

                const seen = new Set<string>();
                const endpoints = candidates.filter(u => (seen.has(u) ? false : (seen.add(u), true)));

                console.log('Attempting to track visitor with endpoints:', endpoints);

                let tracked = false;
                for (const url of endpoints) {
                    try {
                        console.log(`Trying visitor tracking endpoint: ${url}`);
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

                        const response = await fetch(url, {
                            method: 'POST',
                            mode: 'cors',
                            cache: 'no-store',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                timestamp: new Date().toISOString(),
                                page: window.location.pathname,
                                referrer: document.referrer || 'Direct visit',
                                userAgent: navigator.userAgent
                            }),
                            signal: controller.signal
                        });

                        clearTimeout(timeoutId);

                        if (response.ok) {
                            console.log('Visitor tracked successfully via:', url);
                            tracked = true;
                            break;
                        } else {
                            console.warn(`Tracking failed on ${url}: ${response.status}`);
                        }
                    } catch (err) {
                        console.warn(`Failed to track visitor on ${url}:`, err);
                        continue;
                    }
                }

                if (!tracked) {
                    console.warn('Failed to track visitor on all endpoints');
                }
            } catch (error) {
                console.error('Visitor tracking failed:', error);
            }
        };

        // Track visitor immediately
        trackVisitor();
    }, []); // Run once on mount

    // Show video overlay when component mounts
    useEffect(() => {
        // Check if user has chosen to never see the tutorial
        const neverShowTutorial = localStorage.getItem('autai-tutorial-never-show');
        const hasSeenTutorial = localStorage.getItem('autai-tutorial-seen');
        
        if (!neverShowTutorial && !hasSeenTutorial) {
            setShowVideoOverlay(true);
        }
    }, []);

    // Handler to close video overlay
    const handleCloseVideoOverlay = () => {
        setShowVideoOverlay(false);
        // Mark tutorial as seen
        localStorage.setItem('autai-tutorial-seen', 'true');
    };

    // Handler to show tutorial again
    const handleShowTutorial = () => {
        setShowVideoOverlay(true);
    };

    // Handler to update training options
    const handleOptionChange = (option: string, value: any) => {
        setTrainingOptions(prev => ({ ...prev, [option]: value }));
    };

    // Reference to Canvas component to get model data
    const canvasRef = useRef<any>(null);
    
    // Function to handle export
    const handleExport = async () => {
        if (!canvasRef.current) {
            setExportStatus({
                isExporting: false,
                message: 'Canvas reference not available',
                isError: true
            });
            return;
        }
        
        try {
            setExportStatus({
                isExporting: true,
                message: 'Exporting model...',
                isError: false
            });
            
            // Get model data from Canvas component
            const modelData = canvasRef.current.getModelData();
            
            // Combine model data with training options
            const exportData = {
                ...modelData,
                trainingOptions: trainingOptions
            };

            // Build endpoint list safely for tunnel/https
            const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
            // Read meta without TS assertions/optional chaining
            const metaTag = document.querySelector('meta[name="autai:api-base"]');
            const metaApiBase = metaTag ? (metaTag.getAttribute('content') || '').trim() : '';
            const apiBaseRaw = (process.env.REACT_APP_API_BASE || metaApiBase || '');
            const apiBase = apiBaseRaw.replace(/\/+$/, '');
            const sameOrigin = (typeof window !== 'undefined' ? window.location.origin : '').replace(/\/+$/, '');

            const candidates = [
                `${sameOrigin}/api/export-model`,
                `${sameOrigin}/export-model`,
                apiBase ? `${apiBase}/api/export-model` : '',
                apiBase ? `${apiBase}/export-model` : '',
                !isHttps ? 'http://localhost:5000/api/export-model' : ''
            ].filter(Boolean);

            // De-duplicate while preserving order
            const seen = new Set<string>();
            const endpoints = candidates.filter(u => (seen.has(u) ? false : (seen.add(u), true)));

            let result: any = null;
            let lastError: any = null;

            for (const url of endpoints) {
                try {
                    // Add a timeout to the fetch request
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000);

                    const response = await fetch(url, {
                        method: 'POST',
                        mode: 'cors',
                        cache: 'no-store',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(exportData),
                        signal: controller.signal
                    });

                    clearTimeout(timeoutId);

                    const contentType = response.headers.get('content-type') || '';
                    const isJson = contentType.includes('application/json');
                    const payload = isJson ? await response.json() : await response.text();

                    if (!response.ok) {
                        const msg = typeof payload === 'string' ? payload.slice(0, 200) : JSON.stringify(payload);
                        throw new Error(`HTTP ${response.status} from ${url} - ${msg}`);
                    }

                    if (!isJson) {
                        // Likely got HTML (e.g., static host), try next candidate
                        throw new Error(`Non-JSON response from ${url}: ${String(payload).slice(0, 120)}`);
                    }

                    result = payload;
                    break;
                } catch (err) {
                    if (err instanceof Error && err.name === 'AbortError') {
                        lastError = new Error(`Request to ${url} timed out`);
                    } else {
                        lastError = err;
                    }
                    continue;
                }
            }

            if (!result) {
                throw lastError || new Error('Export failed: no valid response from any endpoint');
            }

            if (!result.success) {
                throw new Error(result.message || 'Export failed');
            }
            
            // Create a downloadable file from the Python code
            const blob = new Blob([result.message], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            // Create a temporary link element to trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = 'autai_model.py';
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            setExportStatus({
                isExporting: false,
                message: 'Export successful! File downloaded.',
                isError: false
            });
            
            // Clear status message after 3 seconds
            setTimeout(() => {
                setExportStatus(prev => ({
                    ...prev,
                    message: ''
                }));
            }, 3000);
            
        } catch (error) {
            console.error('Export failed:', error);
            setExportStatus({
                isExporting: false,
                message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                isError: true
            });
        }
    };

    // Function to handle evaluation script download
    const handleDownloadEvaluation = async () => {
        if (!canvasRef.current) {
            setEvalStatus({
                isDownloading: false,
                message: 'Canvas reference not available',
                isError: true
            });
            return;
        }
        
        try {
            setEvalStatus({
                isDownloading: true,
                message: 'Generating evaluation script...',
                isError: false
            });
            
            // Get model data from Canvas component
            const modelData = canvasRef.current.getModelData();
            
            // Build endpoint list
            const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
            const metaTag = document.querySelector('meta[name="autai:api-base"]');
            const metaApiBase = metaTag ? (metaTag.getAttribute('content') || '').trim() : '';
            const apiBaseRaw = (process.env.REACT_APP_API_BASE || metaApiBase || '');
            const apiBase = apiBaseRaw.replace(/\/+$/, '');
            const sameOrigin = (typeof window !== 'undefined' ? window.location.origin : '').replace(/\/+$/, '');

            const candidates = [
                `${sameOrigin}/api/download-evaluation`,
                `${sameOrigin}/download-evaluation`,
                apiBase ? `${apiBase}/api/download-evaluation` : '',
                apiBase ? `${apiBase}/download-evaluation` : '',
                !isHttps ? 'http://localhost:5000/api/download-evaluation' : ''
            ].filter(Boolean);

            const seen = new Set<string>();
            const endpoints = candidates.filter(u => (seen.has(u) ? false : (seen.add(u), true)));

            let result: any = null;
            let lastError: any = null;

            for (const url of endpoints) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000);

                    const response = await fetch(url, {
                        method: 'POST',
                        mode: 'cors',
                        cache: 'no-store',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(modelData),
                        signal: controller.signal
                    });

                    clearTimeout(timeoutId);

                    const contentType = response.headers.get('content-type') || '';
                    const isJson = contentType.includes('application/json');
                    const payload = isJson ? await response.json() : await response.text();

                    if (!response.ok) {
                        const msg = typeof payload === 'string' ? payload.slice(0, 200) : JSON.stringify(payload);
                        throw new Error(`HTTP ${response.status} from ${url} - ${msg}`);
                    }

                    if (!isJson) {
                        throw new Error(`Non-JSON response from ${url}: ${String(payload).slice(0, 120)}`);
                    }

                    result = payload;
                    break;
                } catch (err) {
                    if (err instanceof Error && err.name === 'AbortError') {
                        lastError = new Error(`Request to ${url} timed out`);
                    } else {
                        lastError = err;
                    }
                    continue;
                }
            }

            if (!result) {
                throw lastError || new Error('Download failed: no valid response from any endpoint');
            }

            if (!result.success) {
                throw new Error(result.message || 'Download failed');
            }
            
            // Create a downloadable file from the Python code
            const blob = new Blob([result.evaluation_script], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            // Create a temporary link element to trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = 'autai_evaluation.py';
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            setEvalStatus({
                isDownloading: false,
                message: 'Evaluation script downloaded successfully!',
                isError: false
            });
            
            // Clear status message after 3 seconds
            setTimeout(() => {
                setEvalStatus(prev => ({
                    ...prev,
                    message: ''
                }));
            }, 3000);
            
        } catch (error) {
            console.error('Download evaluation failed:', error);
            setEvalStatus({
                isDownloading: false,
                message: `Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                isError: true
            });
        }
    };

    return (
        <div className="app" style={{ 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #0a0a0f 0%, #12121a 100%)',
            color: '#ffffff'
        }}>
            {/* Video Overlay */}
            {showVideoOverlay && (
                <VideoOverlay onClose={handleCloseVideoOverlay} />
            )}
            
            <Toolbar 
                onExport={handleExport} 
                onShowTutorial={handleShowTutorial}
                onDownloadEvaluation={handleDownloadEvaluation}
            />
            
            {/* Status message - update to show both export and eval status */}
            {(exportStatus.message || evalStatus.message) && (
                <div style={{
                    padding: '10px 16px',
                    background: (exportStatus.isError || evalStatus.isError)
                        ? 'linear-gradient(90deg, #7a2a2a 0%, #5a1a1a 100%)' 
                        : 'linear-gradient(90deg, #1a4d4d 0%, #2a5a2a 100%)',
                    color: 'white',
                    textAlign: 'center',
                    opacity: (exportStatus.message || evalStatus.message) ? 1 : 0,
                    transition: 'opacity 0.3s',
                    fontWeight: '500',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                }}>
                    {exportStatus.message || evalStatus.message}
                </div>
            )}
            
            <div className="main-container" style={{ 
                flex: 1, 
                display: 'flex', 
                overflow: 'hidden',
                height: 'calc(100vh - 80px)'
            }}>
                <LayerLibrary />
                <div style={{ 
                    flex: 1, 
                    position: 'relative', 
                    overflow: 'hidden',
                    height: '100%'
                }}>
                    <Canvas ref={canvasRef} />
                </div>
                <PropertiesPanel 
                    trainingOptions={trainingOptions}
                    onOptionChange={handleOptionChange}
                />
            </div>
        </div>
    );
};

export default App;
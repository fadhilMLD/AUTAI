import React from 'react';

const LayerLibrary: React.FC = () => {
    const layers = [
        { type: 'InputLayer', name: 'Input Layer', icon: '◻', color: 'linear-gradient(135deg, #2a8db8 0%, #4a6fa5 100%)', available: true },
        { type: 'Conv2DLayer', name: 'Conv2D Layer', icon: '⬚', color: 'linear-gradient(135deg, #7a3d00 0%, #7a2a4d 100%)', available: false },
        { type: 'MaxPoolLayer', name: 'MaxPool Layer', icon: '◩', color: 'linear-gradient(135deg, #0f5e5e 0%, #1a7a7a 100%)', available: false },
        { type: 'FlattenLayer', name: 'Flatten Layer', icon: '⊟', color: 'linear-gradient(135deg, #7a2a0f 0%, #7a2a2a 100%)', available: false },
        { type: 'LinearLayer', name: 'Linear Layer', icon: '↔', color: 'linear-gradient(135deg, #2a4d7a 0%, #4a5a7a 100%)', available: true },
        { type: 'OutputLayer', name: 'Output Layer', icon: '◈', color: 'linear-gradient(135deg, #005a7a 0%, #00477a 100%)', available: true },
        { type: 'ConcatLayer', name: 'Concat Layer', icon: '⊕', color: 'linear-gradient(135deg, #4d2a5a 0%, #5a2a5a 100%)', available: false },
    ];

    // Utility function to generate random string IDs
    const generateRandomId = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleDragStart = (e: React.DragEvent, layerType: string, available: boolean) => {
        if (!available) {
            e.preventDefault();
            return;
        }
        
        const layerData = {
            type: layerType,
            id: generateRandomId() // Generate random string ID instead of Date.now() + Math.random()
        };
        e.dataTransfer.setData('text/plain', JSON.stringify(layerData));
    };

    return (
        <div style={{
            width: '250px',
            background: 'linear-gradient(135deg, #0a0a0f 0%, #12121a 100%)',
            padding: '16px',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            height: 'calc(100vh - 80px)', 
            overflowY: 'auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
        }}>
            <h3 style={{ 
                color: '#ffffff', 
                marginTop: 0, 
                marginBottom: '16px',
                fontSize: '18px',
                fontWeight: 600,
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                paddingBottom: '10px',
                letterSpacing: '0.5px'
            }}>
                Layer Library
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {layers.map((layer) => (
                    <div
                        key={layer.type}
                        draggable={layer.available}
                        onDragStart={(e) => handleDragStart(e, layer.type, layer.available)}
                        style={{
                            padding: '12px',
                            background: layer.available ? '#161620' : '#0f0f15',
                            borderRadius: '10px',
                            cursor: layer.available ? 'grab' : 'not-allowed',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            boxShadow: layer.available ? '0 2px 10px rgba(0, 0, 0, 0.2)' : '0 1px 5px rgba(0, 0, 0, 0.1)',
                            position: 'relative',
                            overflow: 'hidden',
                            opacity: layer.available ? 1 : 0.4,
                            filter: layer.available ? 'none' : 'grayscale(0.8)'
                        }}
                        onMouseDown={(e) => layer.available && (e.currentTarget.style.cursor = 'grabbing')}
                        onMouseUp={(e) => layer.available && (e.currentTarget.style.cursor = 'grab')}
                        onMouseOver={(e) => {
                            if (layer.available) {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (layer.available) {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
                            }
                        }}
                    >
                        {/* Color indicator with gradient */}
                        <div style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: '5px',
                            background: layer.available ? layer.color : 'rgba(128, 128, 128, 0.3)',
                            borderTopLeftRadius: '10px',
                            borderBottomLeftRadius: '10px'
                        }} />
                        
                        <div style={{ 
                            width: '36px', 
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: layer.available ? 'rgba(255, 255, 255, 0.03)' : 'rgba(128, 128, 128, 0.02)',
                            borderRadius: '8px',
                            fontSize: '20px',
                            marginLeft: '5px',
                            color: layer.available ? '#ffffff' : '#666'
                        }}>
                            {layer.icon}
                        </div>
                        
                        <div style={{ flex: 1 }}>
                            <span style={{ 
                                color: layer.available ? '#ffffff' : '#666', 
                                fontWeight: '500',
                                fontSize: '14px',
                                display: 'block'
                            }}>
                                {layer.name}
                            </span>
                            {!layer.available && (
                                <span style={{
                                    color: '#888',
                                    fontSize: '12px',
                                    fontStyle: 'italic',
                                    marginTop: '2px',
                                    display: 'block'
                                }}>
                                    Coming Soon
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LayerLibrary;
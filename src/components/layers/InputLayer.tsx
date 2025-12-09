import React from 'react';

interface InputLayerProps {
    inputShape?: number[];
}

const InputLayer: React.FC<InputLayerProps> = ({ inputShape = [16] }) => {
    return (
        <div style={{ userSelect: 'none' }}>
            <h4 style={{ 
                margin: 0, 
                fontSize: 16, 
                color: '#ffffff', 
                userSelect: 'none',
                fontWeight: 600,
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
            }}>Input Layer</h4>
            <div style={{ 
                fontSize: 13, 
                color: '#b0b8c4', 
                userSelect: 'none',
                marginTop: 6,
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                Shape: [{inputShape.join(', ')}]
            </div>
        </div>
    );
};

export default InputLayer;
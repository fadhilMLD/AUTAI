import React from 'react';

interface MaxPoolLayerProps {
    poolSize?: number;
    stride?: number;
    padding?: string;
}

const MaxPoolLayer: React.FC<MaxPoolLayerProps> = ({ 
    poolSize = 2, 
    stride = 2,
    padding = 'valid'
}) => {
    return (
        <div style={{
            padding: '8px',
            backgroundColor: '#2a2a2a',
            borderRadius: '4px',
            minWidth: '120px',
            textAlign: 'center'
        }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#42a5f5' }}>
                MaxPool Layer
            </div>
            <div style={{ fontSize: '12px', color: '#ccc' }}>
                Pool Size: {poolSize}×{poolSize}
            </div>
            <div style={{ fontSize: '12px', color: '#ccc' }}>
                Stride: {stride}
            </div>
            <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>
                Padding: {padding}
            </div>
        </div>
    );
};

export default MaxPoolLayer;

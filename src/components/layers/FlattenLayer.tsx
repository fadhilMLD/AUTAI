  import React from 'react';

interface FlattenLayerProps {
    startDim?: number;
    endDim?: number;
}

const FlattenLayer: React.FC<FlattenLayerProps> = ({ 
    startDim = 1, 
    endDim = -1
}) => {
    return (
        <div style={{
            padding: '8px',
            backgroundColor: '#2a2a2a',
            borderRadius: '4px',
            minWidth: '120px',
            textAlign: 'center'
        }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#ff9800' }}>
                Flatten Layer
            </div>
            <div style={{ fontSize: '12px', color: '#ccc' }}>
                Reshape to 1D
            </div>
            <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>
                Start Dim: {startDim}
            </div>
            <div style={{ fontSize: '10px', color: '#888' }}>
                End Dim: {endDim === -1 ? 'Last' : endDim}
            </div>
        </div>
    );
};

export default FlattenLayer;

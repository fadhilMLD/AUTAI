import React from 'react';

interface ConcatLayerProps {
    layers?: any[];
}

const ConcatLayer: React.FC<ConcatLayerProps> = ({ layers = [] }) => {
    return (
        <div style={{ userSelect: 'none' }}>
            <h4 style={{ margin: 0, fontSize: 14, color: '#ffffff', userSelect: 'none' }}>Concat Layer</h4>
            <div style={{ fontSize: 12, color: '#ccc', userSelect: 'none' }}>
                Inputs: {layers.length}
            </div>
        </div>
    );
};

export default ConcatLayer;
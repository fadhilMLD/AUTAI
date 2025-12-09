import React, { useState } from 'react';

interface Conv2DLayerProps {
    filterSize?: number;
    numFilters?: number;
    activationFunction?: string;
}

const Conv2DLayer: React.FC<Conv2DLayerProps> = ({ 
    filterSize = 3, 
    numFilters = 32, 
    activationFunction = 'relu' 
}) => {
    const [localFilterSize, setLocalFilterSize] = useState(filterSize);
    const [localNumFilters, setLocalNumFilters] = useState(numFilters);
    const [localActivationFunction, setLocalActivationFunction] = useState(activationFunction);

    const handleFilterSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalFilterSize(Number(event.target.value));
    };

    const handleNumFiltersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalNumFilters(Number(event.target.value));
    };

    const handleActivationFunctionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLocalActivationFunction(event.target.value);
    };

    return (
        <div className="conv2d-layer" style={{ userSelect: 'none' }}>
            <h4 style={{ 
                color: '#ffffff', 
                margin: 0, 
                fontSize: 16, 
                userSelect: 'none',
                fontWeight: 600,
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
            }}>Conv2D Layer</h4>
            
            <div style={{ 
                marginTop: 10, 
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '10px',
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{ marginBottom: 8, userSelect: 'none' }}>
                    <label style={{ color: '#b0b8c4', fontSize: 12, userSelect: 'none', fontWeight: 500 }}>Filter Size:</label>
                    <input 
                        type="number" 
                        value={localFilterSize} 
                        onChange={handleFilterSizeChange}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.07)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            width: '60px',
                            marginLeft: '4px',
                            outline: 'none'
                        }}
                    />
                </div>
                <div style={{ marginBottom: 8, userSelect: 'none' }}>
                    <label style={{ color: '#b0b8c4', fontSize: 12, userSelect: 'none', fontWeight: 500 }}>Filters:</label>
                    <input 
                        type="number" 
                        value={localNumFilters} 
                        onChange={handleNumFiltersChange}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.07)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            width: '60px',
                            marginLeft: '4px',
                            outline: 'none'
                        }}
                    />
                </div>
                <div style={{ marginBottom: 4, userSelect: 'none' }}>
                    <label style={{ color: '#b0b8c4', fontSize: 12, userSelect: 'none', fontWeight: 500 }}>Activation:</label>
                    <select 
                        value={localActivationFunction} 
                        onChange={handleActivationFunctionChange}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.07)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            marginLeft: '4px',
                            outline: 'none'
                        }}
                    >
                        <option value="relu">ReLU</option>
                        <option value="sigmoid">Sigmoid</option>
                        <option value="tanh">Tanh</option>
                    </select>
                </div>
            </div>
            
            <div style={{ 
                fontSize: 12, 
                color: '#8a9db8', 
                marginTop: 8, 
                userSelect: 'none',
                padding: '4px 0'
            }}>
                <div>Filters: <span style={{ color: '#b5ffb5' }}>{localNumFilters}</span></div>
                <div>Size: <span style={{ color: '#b5ffb5' }}>{localFilterSize}×{localFilterSize}</span></div>
                <div>Activation: <span style={{ color: '#b5ffb5' }}>{localActivationFunction}</span></div>
            </div>
        </div>
    );
};

export default Conv2DLayer;
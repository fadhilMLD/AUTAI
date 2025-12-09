import React, { useState } from 'react';

interface LinearLayerProps {
    outputSize?: number;
    bias?: boolean;
    activation?: string;
}

const LinearLayer: React.FC<LinearLayerProps> = ({ 
    outputSize = 64, 
    bias = true,
    activation = 'none'
}) => {
    const [localActivation, setLocalActivation] = useState(activation);

    const handleActivationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLocalActivation(event.target.value);
    };

    return (
        <div style={{
            padding: '8px',
            backgroundColor: '#2a2a2a',
            borderRadius: '4px',
            minWidth: '120px',
            textAlign: 'center'
        }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#4caf50' }}>
                Linear Layer
            </div>
            <div style={{ fontSize: '12px', color: '#ccc' }}>
                Neurons: {outputSize}
            </div>
            <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>
                Bias: {bias ? 'Yes' : 'No'}
            </div>
            <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>
                <label>Activation: </label>
                <select 
                    value={localActivation} 
                    onChange={handleActivationChange}
                    style={{
                        backgroundColor: 'rgba(40, 44, 52, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        outline: 'none'
                    }}
                >
                    <option value="relu" style={{ backgroundColor: '#2d2d3a', color: 'white' }}>ReLU</option>
                    <option value="sigmoid" style={{ backgroundColor: '#2d2d3a', color: 'white' }}>Sigmoid</option>
                    <option value="tanh" style={{ backgroundColor: '#2d2d3a', color: 'white' }}>Tanh</option>
                    <option value="none" style={{ backgroundColor: '#2d2d3a', color: 'white' }}>None</option>
                </select>
            </div>
        </div>
    );
};

export default LinearLayer;

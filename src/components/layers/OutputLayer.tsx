import React, { useState } from 'react';

interface OutputLayerProps {
    outputShape?: number[];
    activationFunction?: string;
}

const OutputLayer: React.FC<OutputLayerProps> = ({ 
    outputShape = [10], 
    activationFunction = 'softmax' 
}) => {
    const [localActivation, setLocalActivation] = useState(activationFunction);

    const handleActivationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLocalActivation(event.target.value);
    };

    return (
        <div style={{ userSelect: 'none' }}>
            <h4 style={{ 
                margin: 0, 
                fontSize: 16, 
                color: '#ffffff', 
                userSelect: 'none',
                fontWeight: 600,
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
            }}>Output Layer</h4>
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
                <div style={{ marginBottom: 4 }}>Shape: [{outputShape.join(', ')}]</div>
                <div>
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
                            fontSize: '12px',
                            outline: 'none'
                        }}
                    >
                        <option value="softmax" style={{ backgroundColor: '#2d2d3a', color: 'white' }}>Softmax</option>
                        <option value="sigmoid" style={{ backgroundColor: '#2d2d3a', color: 'white' }}>Sigmoid</option>
                        <option value="relu" style={{ backgroundColor: '#2d2d3a', color: 'white' }}>ReLU</option>
                        <option value="tanh" style={{ backgroundColor: '#2d2d3a', color: 'white' }}>Tanh</option>
                        <option value="none" style={{ backgroundColor: '#2d2d3a', color: 'white' }}>None</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default OutputLayer;
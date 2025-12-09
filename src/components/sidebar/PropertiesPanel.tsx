import React from 'react';

interface TrainingOptions {
    batchSize: number;
    epochs: number;
    learningRate: number;
    optimizer: string;
    lossFunction: string;
}

interface PropertiesPanelProps {
    trainingOptions: TrainingOptions;
    onOptionChange: (option: string, value: any) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ trainingOptions, onOptionChange }) => {
    return (
        <div style={{ 
            width: 200, 
            borderLeft: '1px solid rgba(255, 255, 255, 0.05)', 
            padding: 16, 
            background: 'linear-gradient(135deg, #0a0a0f 0%, #12121a 100%)',
            color: '#ffffff',
            height: 'calc(100vh - 80px)',
            overflowY: 'auto',
            boxShadow: '-2px 0 15px rgba(0, 0, 0, 0.4)'
        }}>
            <h3 style={{ 
                color: '#ffffff', 
                marginTop: 0,
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                paddingBottom: '10px',
                fontWeight: 600,
                letterSpacing: '0.5px'
            }}>Training Options</h3>
            
            <div style={{
                marginTop: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                {/* Batch Size */}
                <div className="training-option">
                    <label style={{ display: 'block', marginBottom: '6px', color: '#b0b8c4', fontSize: '14px', fontWeight: 500 }}>Batch Size</label>
                    <input
                        type="number"
                        value={trainingOptions.batchSize}
                        onChange={(e) => onOptionChange('batchSize', Number(e.target.value))}
                        style={{
                            width: '100%', padding: '8px 10px', background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white',
                            fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                        }}
                    />
                </div>

                {/* Epochs */}
                <div className="training-option">
                    <label style={{ display: 'block', marginBottom: '6px', color: '#b0b8c4', fontSize: '14px', fontWeight: 500 }}>Epochs</label>
                    <input
                        type="number"
                        value={trainingOptions.epochs}
                        onChange={(e) => onOptionChange('epochs', Number(e.target.value))}
                        style={{
                            width: '100%', padding: '8px 10px', background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white',
                            fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                        }}
                    />
                </div>

                {/* Learning Rate */}
                <div className="training-option">
                    <label style={{ display: 'block', marginBottom: '6px', color: '#b0b8c4', fontSize: '14px', fontWeight: 500 }}>Learning Rate</label>
                    <input
                        type="number"
                        step="0.0001"
                        value={trainingOptions.learningRate}
                        onChange={(e) => onOptionChange('learningRate', Number(e.target.value))}
                        style={{
                            width: '100%', padding: '8px 10px', background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white',
                            fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                        }}
                    />
                </div>

                {/* Optimizer */}
                <div className="training-option">
                    <label style={{ display: 'block', marginBottom: '6px', color: '#b0b8c4', fontSize: '14px', fontWeight: 500 }}>Optimizer</label>
                    <select
                        value={trainingOptions.optimizer}
                        onChange={(e) => onOptionChange('optimizer', e.target.value)}
                        style={{
                            width: '100%', padding: '8px 10px', background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white',
                            fontSize: '14px', outline: 'none'
                        }}
                    >
                        <option value="adam">Adam</option>
                        <option value="sgd">SGD</option>
                        <option value="rmsprop">RMSprop</option>
                    </select>
                </div>

                {/* Loss Function */}
                <div className="training-option">
                    <label style={{ display: 'block', marginBottom: '6px', color: '#b0b8c4', fontSize: '14px', fontWeight: 500 }}>Loss Function</label>
                    <select
                        value={trainingOptions.lossFunction}
                        onChange={(e) => onOptionChange('lossFunction', e.target.value)}
                        style={{
                            width: '100%', padding: '8px 10px', background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white',
                            fontSize: '14px', outline: 'none'
                        }}
                    >
                        <option value="mse">Mean Squared Error</option>
                        <option value="crossentropy">Cross Entropy</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default PropertiesPanel;
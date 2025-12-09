import React from 'react';

interface Layer {
    type: string;
    neurons: number;
    activation: string;
}

interface LayerControlsProps {
    layer: Layer;
    onUpdate: (layer: Layer) => void;
}

const LayerControls: React.FC<LayerControlsProps> = ({ layer, onUpdate }) => {
    const handleNeuronsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newNeurons = Number(event.target.value);
        onUpdate({ ...layer, neurons: newNeurons });
    };

    const handleActivationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newActivation = event.target.value;
        onUpdate({ ...layer, activation: newActivation });
    };

    return (
        <div className="layer-controls">
            <h3>{layer.type} Layer Controls</h3>
            <div>
                <label>Number of Neurons:</label>
                <input
                    type="number"
                    value={layer.neurons}
                    onChange={handleNeuronsChange}
                />
            </div>
            <div>
                <label>Activation Function:</label>
                <select
                    value={layer.activation}
                    onChange={handleActivationChange}
                >
                    <option value="relu">ReLU</option>
                    <option value="sigmoid">Sigmoid</option>
                    <option value="tanh">Tanh</option>
                    <option value="softmax">Softmax</option>
                </select>
            </div>
        </div>
    );
};

export default LayerControls;
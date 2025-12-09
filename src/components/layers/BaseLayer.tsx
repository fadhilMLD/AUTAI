import React from 'react';

export interface BaseLayerProps {
    id?: number;
    selected?: boolean;
    onSelect?: (id: number) => void;
    children?: React.ReactNode;
}

export interface LayerConfig {
    type: string;
    name: string;
    parameters: Record<string, any>;
}

const BaseLayer: React.FC<BaseLayerProps> = ({ id, selected, onSelect, children }) => {
    const handleClick = () => {
        if (id && onSelect) {
            onSelect(id);
        }
    };

    return (
        <div
            onClick={handleClick}
            style={{
                border: selected ? '2px solid #007acc' : '1px solid #ccc',
                borderRadius: 4,
                padding: 8,
                cursor: 'pointer',
                backgroundColor: selected ? '#f0f8ff' : '#fff',
            }}
        >
            {children}
        </div>
    );
};

export default BaseLayer;

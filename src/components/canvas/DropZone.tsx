import React from 'react';

interface DropZoneProps {
    onDrop: (layer: { type: string; id: number; x: number; y: number }) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ onDrop }) => {
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        try {
            const data = e.dataTransfer.getData('text/plain');
            const layer = JSON.parse(data);

            // Calculate the drop position relative to the DropZone
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            onDrop({
                ...layer,
                x: x - 60, // Offset to center the node on cursor
                y: y - 50,
            });
        } catch (error) {
            console.error('Failed to parse dropped data:', error);
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 5, // Lower z-index, between connections and nodes
                pointerEvents: 'none' // Don't capture mouse events, only drag events
            }}
        />
    );
};

export default DropZone;
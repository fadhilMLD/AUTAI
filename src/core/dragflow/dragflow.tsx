import React, { useState } from 'react';
import { Node } from './node';

const Dragflow = () => {
	const [nodes, setNodes] = useState<Node[]>([]);
    
	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const layerType = event.dataTransfer.getData('layerType');
		addNode(layerType);
	};

	const addNode = (layerType: string) => {
		const newNode = new Node({
			id: `node-${Date.now()}`,
			type: layerType,
			position: { x: 100, y: 100 },
			data: {}
		});
		setNodes([...nodes, newNode]);
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	return (
		<div 
			onDrop={handleDrop} 
			onDragOver={handleDragOver} 
			className="dragflow-canvas"
		>
			{nodes.map((node, index) => (
				<div key={index} className="node">
					{node.type}
				</div>
			))}
		</div>
	);
};

export default Dragflow;

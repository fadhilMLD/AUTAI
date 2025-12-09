import React, { useState, useRef, useEffect, useCallback } from 'react';
import InputLayer from '../layers/InputLayer';
import Conv2DLayer from '../layers/Conv2DLayer';
import OutputLayer from '../layers/OutputLayer';
import ConcatLayer from '../layers/ConcatLayer';
import LinearLayer from '../layers/LinearLayer';
import FlattenLayer from '../layers/FlattenLayer';
import MaxPoolLayer from '../layers/MaxPoolLayer';

type LayerType = 'InputLayer' | 'Conv2DLayer' | 'OutputLayer' | 'ConcatLayer' | 'LinearLayer' | 'FlattenLayer' | 'MaxPoolLayer';

interface LayerProps {
    [key: string]: any;
}

const layerComponentMap: Record<LayerType, React.ComponentType<LayerProps>> = {
    InputLayer: InputLayer,
    Conv2DLayer: Conv2DLayer,
    OutputLayer: OutputLayer,
    ConcatLayer: ConcatLayer,
    LinearLayer: LinearLayer,
    FlattenLayer: FlattenLayer,
    MaxPoolLayer: MaxPoolLayer,
};

const defaultParams: Record<LayerType, Record<string, any>> = {
    InputLayer: { inputShape: [16] },
    Conv2DLayer: { filterSize: 3, numFilters: 32, activationFunction: 'relu' },
    OutputLayer: { outputShape: [10], activationFunction: 'softmax' },
    ConcatLayer: { layers: [] },
    LinearLayer: { outputSize: 64, bias: true, activation: 'relu' },
    FlattenLayer: { startDim: 1, endDim: -1 },
    MaxPoolLayer: { poolSize: 2, stride: 2, padding: 'valid' },
};

interface DroppedLayer {
    type: LayerType;
    id: string; // Changed from number to string
    parameters: Record<string, any>;
    x: number;
    y: number;
    selected?: boolean;
    width?: number;
}

interface Connection {
    from: string; // Changed from number to string
    to: string; // Changed from number to string
}

const Canvas = React.forwardRef<{getModelData: () => any}, React.PropsWithChildren<{}>>((props, ref) => {
    const [layers, setLayers] = useState<DroppedLayer[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [draggedId, setDraggedId] = useState<string | null>(null); // Changed from number to string
    const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [connecting, setConnecting] = useState<{ from: string | null, to: string | null }>({ from: null, to: null }); // Changed from number to string
    const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null); // Changed from number to string
    const [connectionPreview, setConnectionPreview] = useState<{ from: { x: number; y: number }, to: { x: number; y: number } } | null>(null);
    const [nearbyHandle, setNearbyHandle] = useState<string | null>(null); // Changed from number to string
    
    // Canvas transform state
    const [canvasTransform, setCanvasTransform] = useState({ 
        x: 0, 
        y: 0, 
        scale: 1 
    });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    
    const canvasRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Keyboard event handler for deleting selected nodes
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't delete if user is typing in an input field
            const activeElement = document.activeElement;
            if (activeElement instanceof HTMLInputElement || 
                activeElement instanceof HTMLTextAreaElement || 
                activeElement instanceof HTMLSelectElement) {
                return;
            }

            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedLayerId !== null) {
                // Remove the selected layer
                setLayers(prev => prev.filter(l => l.id !== selectedLayerId));
                // Remove all connections involving this layer
                setConnections(prev => prev.filter(
                    conn => conn.from !== selectedLayerId && conn.to !== selectedLayerId
                ));
                setSelectedLayerId(null);
                e.preventDefault();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [selectedLayerId]);

    // Zoom and pan controls - reduced sensitivity
    const handleWheel = useCallback((e: React.WheelEvent) => {
        // Only call preventDefault if needed and if it's not a passive listener
        if (e.cancelable) {
            e.preventDefault();
        }
        
        if (!canvasRef.current) return;
        
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Reduced sensitivity: changed from -0.01 to -0.001
        const delta = e.deltaY * -0.001;
        const scaleFactor = Math.max(0.1, Math.min(3, canvasTransform.scale + delta));
        
        // Calculate new position to zoom towards mouse position
        const newX = mouseX - (mouseX - canvasTransform.x) * (scaleFactor / canvasTransform.scale);
        const newY = mouseY - (mouseY - canvasTransform.y) * (scaleFactor / canvasTransform.scale);
        
        setCanvasTransform({
            x: newX,
            y: newY,
            scale: scaleFactor
        });
    }, [canvasTransform]);

    const handlePanStart = useCallback((e: React.MouseEvent) => {
        // Only start panning if middle mouse button or space + left click
        if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
            e.preventDefault();
            setIsPanning(true);
            setPanStart({ x: e.clientX - canvasTransform.x, y: e.clientY - canvasTransform.y });
        }
    }, [canvasTransform]);

    const handlePanMove = useCallback((e: React.MouseEvent) => {
        if (isPanning) {
            e.preventDefault();
            setCanvasTransform(prev => ({
                ...prev,
                x: e.clientX - panStart.x,
                y: e.clientY - panStart.y
            }));
        }
    }, [isPanning, panStart]);

    const handlePanEnd = useCallback(() => {
        setIsPanning(false);
    }, []);

    // Reset zoom and pan
    const resetTransform = useCallback(() => {
        setCanvasTransform({ x: 0, y: 0, scale: 1 });
    }, []);

    // Convert screen coordinates to canvas coordinates
    const screenToCanvas = useCallback((screenX: number, screenY: number) => {
        return {
            x: (screenX - canvasTransform.x) / canvasTransform.scale,
            y: (screenY - canvasTransform.y) / canvasTransform.scale
        };
    }, [canvasTransform]);

    // Convert canvas coordinates to screen coordinates
    const canvasToScreen = useCallback((canvasX: number, canvasY: number) => {
        return {
            x: canvasX * canvasTransform.scale + canvasTransform.x,
            y: canvasY * canvasTransform.scale + canvasTransform.y
        };
    }, [canvasTransform]);

    // Utility function to generate random string IDs
    const generateRandomId = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    // Add new layer at the mouse drop position - updated for string IDs
    const handleDrop = (layer: { type: string; id: string; x?: number; y?: number }) => {
        // Define unavailable layer types
        const unavailableTypes = ['Conv2DLayer', 'MaxPoolLayer', 'FlattenLayer', 'ConcatLayer'];
        
        // Prevent dropping unavailable layers
        if (unavailableTypes.includes(layer.type)) {
            console.log(`${layer.type} is not available yet`);
            return;
        }
        
        // Only allow valid LayerType
        if (!['InputLayer', 'Conv2DLayer', 'OutputLayer', 'ConcatLayer', 'LinearLayer', 'FlattenLayer', 'MaxPoolLayer'].includes(layer.type)) {
            return;
        }
        
        const validLayerTypes: LayerType[] = ['InputLayer', 'Conv2DLayer', 'OutputLayer', 'ConcatLayer', 'LinearLayer', 'FlattenLayer', 'MaxPoolLayer'];
        const type = validLayerTypes.find(t => t === layer.type);
        
        if (!type) {
            return;
        }

        // Convert drop position to canvas coordinates if provided
        let dropX = 100;
        let dropY = 100;
        
        if (layer.x !== undefined && layer.y !== undefined) {
            const canvasCoords = screenToCanvas(layer.x, layer.y);
            dropX = canvasCoords.x;
            dropY = canvasCoords.y;
        }
        
        setLayers(prev => [
            ...prev,
            {
                ...layer,
                type: type,
                id: generateRandomId(), // Generate random string ID
                parameters: { ...defaultParams[type] },
                x: dropX,
                y: dropY,
            },
        ]);
    };

    // Improved drag logic with input element detection and selection - updated for string IDs
    const handleMouseDown = (id: string, e: React.MouseEvent) => {
        // Prevent dragging if clicking on input elements, labels, or select elements
        const target = e.target;
        if (target instanceof HTMLInputElement || 
            target instanceof HTMLLabelElement || 
            target instanceof HTMLSelectElement) {
            return;
        }

        // Don't start dragging if we're connecting or panning
        if (connecting.from !== null || isPanning) {
            return;
        }

        // Set selected layer
        setSelectedLayerId(id);

        if (!canvasRef.current) return;
        
        const layer = layers.find(l => l.id === id);
        if (!layer) return;
        
        const rect = canvasRef.current.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        const canvasCoords = screenToCanvas(screenX, screenY);
        
        // Calculate offset from mouse position to layer's top-left corner
        const offsetX = canvasCoords.x - layer.x;
        const offsetY = canvasCoords.y - layer.y;
        
        setDraggedId(id);
        setDragOffset({ x: offsetX, y: offsetY });
        e.stopPropagation();
    };

    // Click outside to deselect
    const handleCanvasClick = (e: React.MouseEvent) => {
        if (e.target === canvasRef.current) {
            setSelectedLayerId(null);
        }
    };

    const handleMouseUp = () => {
        setDraggedId(null);
        setDragOffset({ x: 0, y: 0 });
        handlePanEnd();
        
        // End connection if we're connecting
        if (connecting.from !== null) {
            setConnecting({ from: null, to: null });
            setConnectionPreview(null);
            setNearbyHandle(null);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!canvasRef.current) return;
        
        const rect = canvasRef.current.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        const canvasCoords = screenToCanvas(screenX, screenY);

        // Handle panning
        handlePanMove(e);

        // Handle node dragging
        if (draggedId !== null && !isPanning) {
            const x = canvasCoords.x - dragOffset.x;
            const y = canvasCoords.y - dragOffset.y;
            setLayers(prev => prev.map(l => l.id === draggedId ? { ...l, x, y } : l));
        }

        // Handle connection preview
        if (connecting.from !== null) {
            const fromLayer = layers.find(l => l.id === connecting.from);
            if (fromLayer) {
                const fromPos = getHandlePosition(fromLayer, 'output');
                const fromScreen = canvasToScreen(fromPos.x, fromPos.y);
                
                // Check for nearby input handles
                let closestHandle: string | null = null;
                let minDistance = 30; // Snap distance
                
                layers.forEach(layer => {
                    if (layer.id !== connecting.from) {
                        const inputPos = getHandlePosition(layer, 'input');
                        const inputScreen = canvasToScreen(inputPos.x, inputPos.y);
                        const distance = Math.sqrt(
                            Math.pow(screenX - inputScreen.x, 2) + Math.pow(screenY - inputScreen.y, 2)
                        );
                        
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestHandle = layer.id;
                        }
                    }
                });
                
                setNearbyHandle(closestHandle);
                

                if (closestHandle) {
                    const targetLayer = layers.find(l => l.id === closestHandle);
                    if (targetLayer) {
                        const targetPos = getHandlePosition(targetLayer, 'input');
                        const targetScreen = canvasToScreen(targetPos.x, targetPos.y);
                        setConnectionPreview({
                            from: fromScreen,
                            to: targetScreen
                        });
                    }
                } else {
                    setConnectionPreview({
                        from: fromScreen,
                        to: { x: screenX, y: screenY }
                    });
                }
            }
        }
    };

    // Inline parameter editing with proper type conversion - updated for string IDs
    const handleParamChange = (id: string, param: string, value: string) => {
        setLayers(prev => prev.map(l => {
            if (l.id === id) {
                let convertedValue: any = value;
                
                // Convert numeric strings to numbers
                if (!isNaN(Number(value)) && value.trim() !== '') {
                    convertedValue = Number(value);
                }
                
                // Handle array inputs (for inputShape, outputShape)
                if (param.includes('Shape') && typeof value === 'string') {
                    try {
                        // Parse comma-separated values as array
                        convertedValue = value.split(',').map(v => Number(v.trim())).filter(v => !isNaN(v));
                    } catch {
                        convertedValue = value;
                    }
                }
                
                return { ...l, parameters: { ...l.parameters, [param]: convertedValue } };
            }
            return l;
        }));
    };

    // Handler for ID changes - updated to handle string IDs
    const handleIdChange = (currentId: string, newIdValue: string) => {
        // Validate that the new ID is not empty and not already used
        if (!newIdValue.trim()) {
            return; // Empty ID, don't update
        }
        
        const newId = newIdValue.trim();
        
        // Check if the new ID is already in use by another layer
        const existingLayer = layers.find(l => l.id === newId && l.id !== currentId);
        if (existingLayer) {
            // ID already exists, could show a warning or auto-generate a unique ID
            return;
        }
        
        // Update the layer ID
        setLayers(prev => prev.map(l => 
            l.id === currentId ? { ...l, id: newId } : l
        ));
        
        // Update connections to use the new ID
        setConnections(prev => prev.map(conn => ({
            from: conn.from === currentId ? newId : conn.from,
            to: conn.to === currentId ? newId : conn.to
        })));
        
        // Update selected layer ID if this layer was selected
        if (selectedLayerId === currentId) {
            setSelectedLayerId(newId);
        }
    };

    // Connection logic with handles - updated for string IDs
    const handleConnectionStart = (id: string, type: 'input' | 'output', e: React.MouseEvent) => {
        console.log('Connection start:', { id, type }); // Debug log
        e.preventDefault();
        e.stopPropagation();
        
        if (type === 'output') {
            setConnecting({ from: id, to: null });
            console.log('Started connecting from node:', id); // Debug log
        }
    };

    const handleConnectionEnd = (id: string, type: 'input' | 'output', e: React.MouseEvent) => {
        console.log('Connection end:', { id, type, connectingFrom: connecting.from }); // Debug log
        e.preventDefault();
        e.stopPropagation();
        
        if (type === 'input' && connecting.from !== null && connecting.from !== id) {
            // Check if connection already exists
            const existingConnectionIndex = connections.findIndex(
                conn => conn.from === connecting.from && conn.to === id
            );
            
            if (existingConnectionIndex !== -1) {
                // Disconnect if connection exists
                console.log('Removing existing connection'); // Debug log
                setConnections(prev => prev.filter((_, index) => index !== existingConnectionIndex));
            } else {
                // Connect if no connection exists
                console.log('Creating new connection from', connecting.from, 'to', id); // Debug log
                const fromId: string = connecting.from;
                setConnections(prev => [...prev, { from: fromId, to: id }]);
            }
        }
        
        // Always clear connection state
        setConnecting({ from: null, to: null });
        setConnectionPreview(null);
        setNearbyHandle(null);
    };

    // Function to get all model data for export
    const getModelData = () => {
        return {
            layers: layers.map(layer => ({
                id: layer.id,
                type: layer.type,
                parameters: layer.parameters,
                position: { x: layer.x, y: layer.y }
            })),
            connections: connections.map(connection => ({
                from: connection.from,
                to: connection.to
            }))
        };
    };
    
    // Expose the getModelData function via ref
    React.useImperativeHandle(ref, () => ({
        getModelData
    }));
    
    // Function to update node width after render - updated for string IDs
    const updateNodeWidth = useCallback((layerId: string, element: HTMLDivElement | null) => {
        if (element) {
            const currentWidth = element.offsetWidth;
            
            // Only update if width has actually changed
            setLayers(prev => {
                const existingLayer = prev.find(layer => layer.id === layerId);
                if (existingLayer && existingLayer.width !== currentWidth) {
                    return prev.map(layer => 
                        layer.id === layerId 
                            ? { ...layer, width: currentWidth }
                            : layer
                    );
                }
                return prev;
            });
        }
    }, []);

    // Use useEffect to measure width after initial render instead of ref callback
    useEffect(() => {
        layers.forEach(layer => {
            if (!layer.width) {
                const element = document.querySelector(`[data-layer-id="${layer.id}"]`);
                if (element && element instanceof HTMLDivElement) {
                    const width = element.offsetWidth;
                    setLayers(prev => prev.map(l => 
                        l.id === layer.id ? { ...l, width } : l
                    ));
                }
            }
        });
    }, [layers.length]); // Only run when number of layers changes

    // Helper function to get handle positions - using actual width
    const getHandlePosition = (layer: DroppedLayer, type: 'input' | 'output') => {
        if (type === 'input') {
            return {
                x: layer.x - 8,
                y: layer.y + 50
            };
        } else {
            const nodeWidth = layer.width || 270;
            return {
                x: layer.x + nodeWidth + 8,
                y: layer.y + 50
            };
        }
    };

    // Update connection line positions to connect handles
    const getLayerCenter = (layer: DroppedLayer) => {
        return {
            x: layer.x + 60,
            y: layer.y + 50
        };
    };

    // Updated render connections to use screen coordinates
    const renderConnections = () => {
        const connectionLines = connections.map((connection, index) => {
            const fromLayer = layers.find(l => l.id === connection.from);
            const toLayer = layers.find(l => l.id === connection.to);
            
            if (!fromLayer || !toLayer) return null;
            
            const from = getHandlePosition(fromLayer, 'output');
            const to = getHandlePosition(toLayer, 'input');
            const fromScreen = canvasToScreen(from.x, from.y);
            const toScreen = canvasToScreen(to.x, to.y);
            
            return (
                <line
                    key={`connection-${index}`}
                    x1={fromScreen.x}
                    y1={fromScreen.y}
                    x2={toScreen.x}
                    y2={toScreen.y}
                    stroke="#007acc"
                    strokeWidth={2}
                    markerEnd="url(#arrowhead)"
                />
            );
        });

        // Add preview connection
        const previewLine = connectionPreview && (
            <line
                key="preview"
                x1={connectionPreview.from.x}
                y1={connectionPreview.from.y}
                x2={connectionPreview.to.x}
                y2={connectionPreview.to.y}
                stroke={nearbyHandle ? "#4caf50" : "#ffa726"}
                strokeWidth={2}
                strokeDasharray="5,5"
                markerEnd="url(#previewArrowhead)"
            />
        );

        return (
            <svg
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 15 // Higher than canvas content but lower than handles
                }}
            >
                <defs>
                    <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon
                            points="0 0, 10 3.5, 0 7"
                            fill="#007acc"
                        />
                    </marker>
                    <marker
                        id="previewArrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon
                            points="0 0, 10 3.5, 0 7"
                            fill={nearbyHandle ? "#4caf50" : "#ffa726"}
                        />
                    </marker>
                </defs>
                {connectionLines}
                {previewLine}
            </svg>
        );
    };

    return (
        <div
            className="canvas"
            ref={canvasRef}
            style={{ 
                height: '100%',
                width: '100%',
                border: '1px solid rgba(255, 255, 255, 0.03)', 
                position: 'relative', 
                overflow: 'hidden',
                background: `
                    linear-gradient(135deg, #0a0a10 0%, #12121a 100%)
                    repeating-linear-gradient(rgba(255, 255, 255, 0.02) 0px, rgba(255, 255, 255, 0.02) 1px, transparent 1px, transparent 20px),
                    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.02) 0px, rgba(255, 255, 255, 0.02) 1px, transparent 1px, transparent 20px)
                `,
                backgroundSize: `
                    100% 100%,
                    20px 20px,
                    20px 20px
                `,
                cursor: isPanning ? 'grabbing' : connecting.from !== null ? 'crosshair' : 'default',
                boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.4)'
            }}
            onWheel={handleWheel}
            onMouseDown={handlePanStart}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleCanvasClick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                e.preventDefault();
                try {
                    const data = e.dataTransfer.getData('text/plain');
                    const layer = JSON.parse(data);
                    
                    // Calculate drop position relative to canvas
                    const rect = canvasRef.current?.getBoundingClientRect();
                    if (rect) {
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        handleDrop({
                            ...layer,
                            x: x - 60,
                            y: y - 50
                        });
                    }
                } catch (error) {
                    console.error('Failed to parse dropped data:', error);
                }
            }}
            tabIndex={0}
        >
            {/* Zoom controls */}
            <div style={{
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 200,
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                background: 'linear-gradient(135deg, #12121a 0%, #1a1a24 100%)',
                padding: 8,
                borderRadius: 10,
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 2px 15px rgba(0, 0, 0, 0.4)'
            }}>
                <button
                    onClick={() => setCanvasTransform(prev => ({ ...prev, scale: Math.min(3, prev.scale * 1.2) }))}
                    style={{
                        background: 'linear-gradient(135deg, #2a4d7a 0%, #3d5a7a 100%)',
                        border: 'none',
                        color: '#fff',
                        padding: '6px 10px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    +
                </button>
                <button
                    onClick={() => setCanvasTransform(prev => ({ ...prev, scale: Math.max(0.1, prev.scale / 1.2) }))}
                    style={{
                        background: 'linear-gradient(135deg, #2a4d7a 0%, #3d5a7a 100%)',
                        border: 'none',
                        color: '#fff',
                        padding: '6px 10px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    -
                </button>
                <button
                    onClick={resetTransform}
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: 'none',
                        color: '#fff',
                        padding: '6px 10px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: 10
                    }}
                >
                    Reset
                </button>
                <div style={{ 
                    color: '#fff', 
                    fontSize: 10, 
                    textAlign: 'center',
                    padding: '4px 0',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 6
                }}>
                    {Math.round(canvasTransform.scale * 100)}%
                </div>
            </div>

            {/* Help text */}
            <div style={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                color: '#b0b8c4',
                fontSize: 11,
                background: 'linear-gradient(135deg, rgba(18, 18, 26, 0.8) 0%, rgba(30, 30, 45, 0.8) 100%)',
                padding: '8px 12px',
                borderRadius: 8,
                zIndex: 200,
                backdropFilter: 'blur(5px)',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
                Scroll to zoom • Ctrl+Click or Middle-click to pan<br/>
                Click red dot then green dot to connect nodes
            </div>

            {/* Canvas content with transform */}
            <div
                ref={contentRef}
                style={{
                    transform: `translate(${canvasTransform.x}px, ${canvasTransform.y}px) scale(${canvasTransform.scale})`,
                    transformOrigin: '0 0',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    zIndex: 10,
                    pointerEvents: 'auto',
                    backgroundImage: `
                        linear-gradient(rgba(255, 255, 255, 0.01) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.01) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0'
                }}
            >
                {/* Render blocks */}
                {layers.map((layer) => {
                    const LayerComponent = layerComponentMap[layer.type];
                    if (!LayerComponent) return null;
                    
                    const isSelected = selectedLayerId === layer.id;
                    const isConnecting = connecting.from === layer.id;
                    const isNearbyTarget = nearbyHandle === layer.id;
                    
                    // Get gradient based on layer type
                    const getLayerGradient = (type: LayerType) => {
                        const gradients: Record<LayerType, string> = {
                            InputLayer: 'linear-gradient(135deg, #2a8db8 0%, #4a6fa5 100%)',
                            Conv2DLayer: 'linear-gradient(135deg, #7a3d00 0%, #7a2a4d 100%)',
                            OutputLayer: 'linear-gradient(135deg, #005a7a 0%, #00477a 100%)',
                            ConcatLayer: 'linear-gradient(135deg, #4d2a5a 0%, #5a2a5a 100%)',
                            LinearLayer: 'linear-gradient(135deg, #2a4d7a 0%, #4a5a7a 100%)',
                            FlattenLayer: 'linear-gradient(135deg, #7a2a0f 0%, #7a2a2a 100%)',
                            MaxPoolLayer: 'linear-gradient(135deg, #0f5e5e 0%, #1a7a7a 100%)'
                        };
                        return gradients[type] || 'linear-gradient(135deg, #333 0%, #555 100%)';
                    };
                    
                    // Inline parameter editing UI for demo
                    const paramInputs = Object.keys(layer.parameters)
    .filter(param => !['activation', 'activationFunction', 'inputSize'].includes(param))
    .map(param => {
    const value = layer.parameters[param];
    const displayValue = Array.isArray(value) ? value.join(', ') : String(value);
    
    return (
                            <div key={param} style={{ marginBottom: 8 }}>
                                <label style={{ fontSize: 12, color: '#b0b8c4', fontWeight: 500 }}>{param}: </label>
                                <input
                                    style={{ 
                                        fontSize: 12, 
                                        width: 90,
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: '#ffffff',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        outline: 'none'
                                    }}
                                    value={displayValue}
                                    onChange={e => handleParamChange(layer.id, param, e.target.value)}
                                    placeholder={param.includes('Shape') ? "e.g. 28, 28, 1" : ""}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onFocus={(e) => e.stopPropagation()}
                                />
                            </div>
                        );
                    });
                    
                    return (
                        <div key={layer.id}>
                            {/* Input Handle */}
                            <div
                                style={{
                                    position: 'absolute',
                                    left: layer.x - 8,
                                    top: layer.y + 42,
                                    width: 16,
                                    height: 16,
                                    background: isNearbyTarget 
                                        ? 'linear-gradient(135deg, #1a4d4d 0%, #2a5a2a 100%)' 
                                        : 'linear-gradient(135deg, #0f5e5e 0%, #1a7a7a 100%)',
                                    borderRadius: '50%',
                                    border: '2px solid #ffffff',
                                    cursor: 'pointer',
                                    zIndex: 100,
                                    boxShadow: isNearbyTarget 
                                        ? '0 0 12px rgba(26, 77, 77, 0.8)' 
                                        : '0 2px 8px rgba(0, 0, 0, 0.5)',
                                    transform: isNearbyTarget ? 'scale(1.2)' : 'scale(1)',
                                    transition: 'all 0.2s ease',
                                    pointerEvents: 'auto'
                                }}
                                onMouseDown={(e) => {
                                    console.log('Input handle mouse down'); // Debug log
                                    handleConnectionStart(layer.id, 'input', e);
                                }}
                                onMouseUp={(e) => {
                                    console.log('Input handle mouse up'); // Debug log
                                    handleConnectionEnd(layer.id, 'input', e);
                                }}
                                onClick={(e) => {
                                    console.log('Input handle clicked'); // Debug log
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                title="Input - Click to connect from another node's output"
                            />
                            
                            {/* Main Node */}
                            <div
                                data-layer-id={layer.id}
                                style={{
                                    position: 'absolute',
                                    left: layer.x,
                                    top: layer.y,
                                    background: isConnecting 
                                        ? 'linear-gradient(135deg, #0a0a0f 0%, #1a1a24 100%)' 
                                        : isSelected 
                                            ? 'linear-gradient(135deg, #1a1a2e 0%, #242438 100%)'
                                            : 'linear-gradient(135deg, #161620 0%, #1a1a24 100%)',
                                    border: isConnecting 
                                        ? `2px solid ${getLayerGradient(layer.type)}` 
                                        : isSelected 
                                            ? '2px solid #5a5a6b' 
                                            : '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: 12,
                                    padding: 16,
                                    minWidth: 120,
                                    cursor: connecting.from !== null ? 'crosshair' : isPanning ? 'grabbing' : 'move',
                                    zIndex: draggedId === layer.id ? 80 : 30,
                                    color: '#ffffff',
                                    boxShadow: isSelected 
                                        ? '0 0 20px rgba(90, 90, 107, 0.3)' 
                                        : '0 4px 20px rgba(0, 0, 0, 0.4)',
                                    userSelect: 'none',
                                    WebkitUserSelect: 'none',
                                    MozUserSelect: 'none',
                                    msUserSelect: 'none',
                                    pointerEvents: 'auto',
                                    backdropFilter: 'blur(5px)'
                                }}
                                onMouseDown={e => handleMouseDown(layer.id, e)}
                            >
                                {/* Subtle indicator of layer type at the top */}
                                <div style={{
                                    height: '4px',
                                    background: getLayerGradient(layer.type),
                                    borderRadius: '10px',
                                    marginBottom: '10px',
                                    opacity: 0.8
                                }}></div>
                                
                                <LayerComponent {...layer.parameters} />
                                
                                {/* Layer Properties Section */}
                                <div style={{ marginTop: 12, userSelect: 'none' }}>
                                    {/* Layer ID Input */}
                                    <div style={{ marginBottom: 8 }}>
                                        <label style={{ 
                                            fontSize: 12, 
                                            color: '#ffa726', 
                                            fontWeight: 600,
                                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                                        }}>
                                            ID: 
                                        </label>
                                        <input
                                            type="text"
                                            style={{ 
                                                fontSize: 12, 
                                                width: 90,
                                                backgroundColor: 'rgba(255, 167, 38, 0.1)',
                                                border: '1px solid rgba(255, 167, 38, 0.3)',
                                                color: '#ffa726',
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                outline: 'none',
                                                fontWeight: 600
                                            }}
                                            value={layer.id}
                                            onChange={e => handleIdChange(layer.id, e.target.value)}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onFocus={(e) => e.stopPropagation()}
                                            placeholder="e.g. layer1, input_A"
                                            title="Layer unique identifier (any string)"
                                        />
                                    </div>
                                    
                                    {/* Other Parameters */}
                                    {paramInputs}
                                </div>
                            </div>
                            
                            {/* Output Handle */}
                            <div
                                style={{
                                    position: 'absolute',
                                    left: layer.x + (layer.width || 270) + 8,
                                    top: layer.y + 42,
                                    width: 16,
                                    height: 16,
                                    background: 'linear-gradient(135deg, #7a2a2a 0%, #5a1a1a 100%)',
                                    borderRadius: '50%',
                                    border: '2px solid #ffffff',
                                    cursor: 'pointer',
                                    zIndex: 100,
                                    boxShadow: connecting.from === layer.id 
                                        ? '0 0 12px rgba(122, 42, 42, 0.8)' 
                                        : '0 2px 8px rgba(0, 0, 0, 0.5)',
                                    transform: connecting.from === layer.id ? 'scale(1.2)' : 'scale(1)',
                                    transition: 'all 0.2s ease',
                                    pointerEvents: 'auto'
                                }}
                                onMouseDown={(e) => {
                                    console.log('Output handle mouse down'); // Debug log
                                    handleConnectionStart(layer.id, 'output', e);
                                }}
                                onMouseUp={(e) => {
                                    console.log('Output handle mouse up'); // Debug log
                                    handleConnectionEnd(layer.id, 'output', e);
                                }}
                                onClick={(e) => {
                                    console.log('Output handle clicked'); // Debug log
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                title="Output - Click and drag to connect to another node's output"
                            />
                        </div>
                    );
                })}
            </div>

            {/* Render connection lines */}
            {renderConnections()}
        </div>
    );
});

export default Canvas;
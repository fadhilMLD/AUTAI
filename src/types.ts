export type LayerType = 'input' | 'conv2d' | 'output' | 'concat';

export interface LayerParameters {
    type: LayerType;
    [key: string]: any; // Additional parameters specific to each layer type
}

export interface NetworkModel {
    layers: LayerParameters[];
}

export interface Connection {
    from: number; // Index of the source layer
    to: number;   // Index of the target layer
}
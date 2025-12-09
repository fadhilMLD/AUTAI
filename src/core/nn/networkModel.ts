import { Layer } from './layerTypes';

export class NetworkModel {
    layers: Layer[];

    constructor() {
        this.layers = [];
    }

    addLayer(layer: Layer) {
        this.layers.push(layer);
    }

    removeLayer(layerIndex: number) {
        if (layerIndex >= 0 && layerIndex < this.layers.length) {
            this.layers.splice(layerIndex, 1);
        }
    }

    getLayers() {
        return this.layers;
    }

    clear() {
        this.layers = [];
    }

    toJSON() {
        return {
            layers: this.layers.map(layer => layer.toJSON())
        };
    }
}
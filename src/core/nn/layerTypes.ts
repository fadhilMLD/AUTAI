export interface LayerConfig {
    type: string;
    parameters: Record<string, any>;
}

export abstract class Layer {
    public type: string;
    public parameters: Record<string, any>;
    public id: string;

    constructor(type: string, parameters: Record<string, any> = {}) {
        this.type = type;
        this.parameters = parameters;
        this.id = `${type}-${Date.now()}`;
    }

    abstract forward(input: any): any;
    
    getParameter(key: string): any {
        return this.parameters[key];
    }

    setParameter(key: string, value: any): void {
        this.parameters[key] = value;
    }

    toJSON(): LayerConfig {
        return {
            type: this.type,
            parameters: this.parameters
        };
    }
}

export class InputLayer extends Layer {
    constructor(inputShape: number[] = [16]) {
        super('InputLayer', { inputShape });
    }

    forward(input: any): any {
        return input;
    }
}

export class Conv2DLayer extends Layer {
    constructor(filterSize: number = 3, numFilters: number = 32, activationFunction: string = 'relu') {
        super('Conv2DLayer', { filterSize, numFilters, activationFunction });
    }

    forward(input: any): any {
        return input;
    }
}

export class OutputLayer extends Layer {
    constructor(outputShape: number[] = [10], activationFunction: string = 'softmax') {
        super('OutputLayer', { outputShape, activationFunction });
    }

    forward(input: any): any {
        return input;
    }
}

export class ConcatLayer extends Layer {
    constructor(layers: any[] = []) {
        super('ConcatLayer', { layers });
    }

    forward(input: any): any {
        return input;
    }
}

export const LayerTypes = {
    INPUT: 'InputLayer',
    CONV2D: 'Conv2DLayer',
    OUTPUT: 'OutputLayer',
    CONCAT: 'ConcatLayer',
};
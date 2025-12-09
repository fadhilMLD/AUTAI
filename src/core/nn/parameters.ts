export interface InputLayerParams {
    inputShape: number[];
}

export interface Conv2DLayerParams {
    filters: number;
    kernelSize: number;
    activation: string;
}

export interface OutputLayerParams {
    outputShape: number[];
    activation: string;
}

export interface ConcatLayerParams {
    axis: number;
}

export type LayerParameters = 
    | InputLayerParams
    | Conv2DLayerParams
    | OutputLayerParams
    | ConcatLayerParams;
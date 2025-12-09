export const validateLayerParameters = (layerType: string, params: any): boolean => {
    switch (layerType) {
        case 'InputLayer':
            return validateInputLayerParams(params);
        case 'Conv2DLayer':
            return validateConv2DLayerParams(params);
        case 'OutputLayer':
            return validateOutputLayerParams(params);
        case 'ConcatLayer':
            return validateConcatLayerParams(params);
        default:
            return false;
    }
};

const validateInputLayerParams = (params: any): boolean => {
    return params.inputShape && Array.isArray(params.inputShape) && params.inputShape.length > 0;
};

const validateConv2DLayerParams = (params: any): boolean => {
    return params.filters > 0 && params.kernelSize > 0 && params.activation && typeof params.activation === 'string';
};

const validateOutputLayerParams = (params: any): boolean => {
    return params.outputShape && Array.isArray(params.outputShape) && params.outputShape.length > 0 && params.activation;
};

const validateConcatLayerParams = (params: any): boolean => {
    return Array.isArray(params.layers) && params.layers.length > 1;
};
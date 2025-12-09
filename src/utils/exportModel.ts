interface ExportableModel {
    layers?: any[];
    connections?: any[];
    metadata?: Record<string, any>;
}

export const exportModel = (model: ExportableModel): void => {
    try {
        // Add metadata about the tool
        if (!model.metadata) {
            model.metadata = {};
        }
        model.metadata.tool = "Autai";
        model.metadata.version = "1.0.0";
        
        const modelJson = JSON.stringify(model, null, 2);
        const blob = new Blob([modelJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'autai_model.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Failed to export model:', error);
        throw new Error('Model export failed');
    }
};

export const exportModelAsString = (model: ExportableModel): string => {
    return JSON.stringify(model, null, 2);
};
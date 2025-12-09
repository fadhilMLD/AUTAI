export interface NodeData {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: Record<string, any>;
}

export class Node {
    public id: string;
    public type: string;
    public position: { x: number; y: number };
    public data: Record<string, any>;

    constructor(nodeData: NodeData) {
        this.id = nodeData.id;
        this.type = nodeData.type;
        this.position = nodeData.position;
        this.data = nodeData.data;
    }

    updatePosition(x: number, y: number): void {
        this.position = { x, y };
    }

    updateData(newData: Record<string, any>): void {
        this.data = { ...this.data, ...newData };
    }

    getData(): Record<string, any> {
        return this.data;
    }

    getPosition(): { x: number; y: number } {
        return this.position;
    }
}
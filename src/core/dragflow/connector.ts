import { Node } from './node';

export class Connector {
    private connections: Map<Node, Node[]>;

    constructor() {
        this.connections = new Map();
    }

    connect(fromNode: Node, toNode: Node): void {
        if (!fromNode || !toNode) {
            throw new Error('Both fromNode and toNode must be valid Node instances');
        }
        
        if (!this.connections.has(fromNode)) {
            this.connections.set(fromNode, []);
        }
        
        const existingConnections = this.connections.get(fromNode);
        if (existingConnections && !existingConnections.includes(toNode)) {
            existingConnections.push(toNode);
        }
    }

    disconnect(fromNode: Node, toNode: Node): void {
        const toNodes = this.connections.get(fromNode);
        if (toNodes) {
            this.connections.set(fromNode, toNodes.filter(node => node !== toNode));
        }
    }

    getConnections(node: Node): Node[] {
        return this.connections.get(node) || [];
    }

    clearConnections(node: Node): void {
        this.connections.delete(node);
    }
}
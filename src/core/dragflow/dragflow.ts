import { Node } from './node';
import { Connector } from './connector';

export interface DragflowConfig {
    canvas: HTMLElement;
    allowMultipleConnections?: boolean;
    snapToGrid?: boolean;
    gridSize?: number;
}

export class Dragflow {
    private nodes: Map<string, Node>;
    private connector: Connector;
    private config: DragflowConfig;

    constructor(config: DragflowConfig) {
        this.nodes = new Map();
        this.connector = new Connector();
        this.config = config;
    }

    addNode(nodeData: { id: string; type: string; position: { x: number; y: number }; data?: Record<string, any> }): Node {
        const node = new Node({
            id: nodeData.id,
            type: nodeData.type,
            position: nodeData.position,
            data: nodeData.data || {}
        });
        
        this.nodes.set(node.id, node);
        return node;
    }

    removeNode(nodeId: string): boolean {
        const node = this.nodes.get(nodeId);
        if (node) {
            this.connector.clearConnections(node);
            this.nodes.delete(nodeId);
            return true;
        }
        return false;
    }

    getNode(nodeId: string): Node | undefined {
        return this.nodes.get(nodeId);
    }

    getAllNodes(): Node[] {
        return Array.from(this.nodes.values());
    }

    connectNodes(fromNodeId: string, toNodeId: string): boolean {
        const fromNode = this.nodes.get(fromNodeId);
        const toNode = this.nodes.get(toNodeId);
        
        if (fromNode && toNode) {
            this.connector.connect(fromNode, toNode);
            return true;
        }
        return false;
    }

    disconnectNodes(fromNodeId: string, toNodeId: string): boolean {
        const fromNode = this.nodes.get(fromNodeId);
        const toNode = this.nodes.get(toNodeId);
        
        if (fromNode && toNode) {
            this.connector.disconnect(fromNode, toNode);
            return true;
        }
        return false;
    }

    getConnections(nodeId: string): Node[] {
        const node = this.nodes.get(nodeId);
        return node ? this.connector.getConnections(node) : [];
    }
}

export default Dragflow;

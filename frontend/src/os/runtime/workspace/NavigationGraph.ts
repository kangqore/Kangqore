// Navigation Graph
// Generation III Runtime

export interface GraphNode {
    id: string;
    type: 'OBJECT' | 'MISSION' | 'SIMULATION' | 'OPTIMIZATION' | 'DECISION' | 'EXECUTION';
    entityId: string;
    lensId?: string;
}

export interface GraphEdge {
    from: string;
    to: string;
    relationship: string;
}

/**
 * Navigation is no longer URL routing. It is enterprise state (Graph).
 * The URL simply serializes the graph position.
 */
export class NavigationGraph {
    private nodes: Map<string, GraphNode> = new Map();
    private edges: GraphEdge[] = [];
    private currentNodeId: string | null = null;

    public navigateTo(node: GraphNode) {
        this.nodes.set(node.id, node);
        if (this.currentNodeId) {
            this.edges.push({
                from: this.currentNodeId,
                to: node.id,
                relationship: 'NAVIGATED'
            });
        }
        this.currentNodeId = node.id;
        this.serializeToUrl(node);
    }

    public getCurrentNode(): GraphNode | null {
        if (!this.currentNodeId) return null;
        return this.nodes.get(this.currentNodeId) || null;
    }

    public getHistory(): GraphNode[] {
        // Simple linear history for now, but really a graph traversal
        return Array.from(this.nodes.values());
    }

    private serializeToUrl(node: GraphNode) {
        // Push state to browser history without triggering React Router if possible
        // e.g., /workspace/revenue/object/cust-123
        const path = `/workspace/${node.lensId || 'default'}/${node.type.toLowerCase()}/${node.entityId}`;
        window.history.pushState({ nodeId: node.id }, '', path);
    }
}

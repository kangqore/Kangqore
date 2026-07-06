import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface GraphNode {
  id: string;
  type: string;
  name: string;
  [key: string]: any;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
  weight?: number;
  [key: string]: any;
}

export interface GraphTraceResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export class KnowledgeEngine {
  private nodes: Map<string, GraphNode> = new Map();
  private edges: Map<string, GraphEdge> = new Map();
  
  // Adjacency lists for fast traversal
  private outgoingEdges: Map<string, GraphEdge[]> = new Map();
  private incomingEdges: Map<string, GraphEdge[]> = new Map();

  constructor() {
    this.loadGraphPacks();
  }

  private loadGraphPacks() {
    try {
      const baseDir = path.join(__dirname, 'packs');
      const files = fs.readdirSync(baseDir);

      for (const file of files) {
        if (!file.endsWith('.yaml')) continue;
        const filePath = path.join(baseDir, file);
        const doc = yaml.load(fs.readFileSync(filePath, 'utf8')) as any;

        if (doc.nodes) {
          doc.nodes.forEach((node: GraphNode) => {
            this.nodes.set(node.id, node);
            if (!this.outgoingEdges.has(node.id)) this.outgoingEdges.set(node.id, []);
            if (!this.incomingEdges.has(node.id)) this.incomingEdges.set(node.id, []);
          });
        }

        if (doc.edges) {
          doc.edges.forEach((edge: GraphEdge) => {
            this.edges.set(edge.id, edge);
          });
        }
      }

      // Build adjacency
      this.edges.forEach(edge => {
        if (this.outgoingEdges.has(edge.source)) {
          this.outgoingEdges.get(edge.source)!.push(edge);
        }
        if (this.incomingEdges.has(edge.target)) {
          this.incomingEdges.get(edge.target)!.push(edge);
        }
      });

      console.log(`[KnowledgeEngine] Graph loaded: ${this.nodes.size} Nodes, ${this.edges.size} Edges.`);
    } catch (err) {
      console.error("[KnowledgeEngine] Failed to load graph packs:", err);
    }
  }

  // --- Graph Traversal APIs ---

  public getGraphStats() {
    let orphans = 0;
    for (const [id, node] of this.nodes.entries()) {
      const inEdges = this.incomingEdges.get(id) || [];
      const outEdges = this.outgoingEdges.get(id) || [];
      if (inEdges.length === 0 && outEdges.length === 0) {
        orphans++;
      }
    }
    
    // Simplistic pack calculation: in a real implementation we'd track source files
    const packsCount = 2; // core-nodes.yaml, core-edges.yaml

    return {
      nodes: this.nodes.size,
      edges: this.edges.size,
      packs: packsCount,
      orphans,
      cycles: 0, // Placeholder
      warnings: 0
    };
  }

  public getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  public getNodesByType(type: string): GraphNode[] {
    return Array.from(this.nodes.values()).filter(n => n.type === type);
  }

  public getOutgoingEdges(nodeId: string, relationship?: string): GraphEdge[] {
    const edges = this.outgoingEdges.get(nodeId) || [];
    if (relationship) return edges.filter(e => e.relationship === relationship);
    return edges;
  }

  public getIncomingEdges(nodeId: string, relationship?: string): GraphEdge[] {
    const edges = this.incomingEdges.get(nodeId) || [];
    if (relationship) return edges.filter(e => e.relationship === relationship);
    return edges;
  }

  public getAllNodes(): GraphNode[] {
    return Array.from(this.nodes.values());
  }

  public getAllEdges(): GraphEdge[] {
    return Array.from(this.edges.values());
  }

  // --- Utility Lookups (for HCIP) ---

  public mapUrlToEventNode(url: string): GraphNode | null {
    const eventNodes = this.getNodesByType('event');
    for (const node of eventNodes) {
      if (node.matchUrl && url.includes(node.matchUrl)) {
        return node;
      }
    }
    return null;
  }

  public mapEventIdToEventNode(eventId: string): GraphNode | null {
    const eventNodes = this.getNodesByType('event');
    for (const node of eventNodes) {
      if (node.matchEventId === eventId || node.id === eventId) {
        return node;
      }
    }
    return null;
  }
}

export const knowledgeEngine = new KnowledgeEngine();

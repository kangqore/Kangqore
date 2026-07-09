import { EnterpriseConnector } from './EnterpriseConnector';

export class ConnectorRegistry {
  private static connectors = new Map<string, EnterpriseConnector>();

  public static register(connector: EnterpriseConnector): void {
    if (this.connectors.has(connector.metadata.id)) {
      throw new Error(`Connector [${connector.metadata.id}] is already registered.`);
    }
    this.connectors.set(connector.metadata.id, connector);
    console.log(`[Connector Registry] Registered: ${connector.metadata.name} (v${connector.metadata.version})`);
  }

  public static get(connectorId: string): EnterpriseConnector {
    const connector = this.connectors.get(connectorId);
    if (!connector) {
      throw new Error(`Connector [${connectorId}] not found in registry.`);
    }
    return connector;
  }

  public static getAll(): EnterpriseConnector[] {
    return Array.from(this.connectors.values());
  }
}

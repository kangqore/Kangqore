export interface ConnectorMetadata {
  id: string;
  name: string;
  version: string;
  provider: string; // e.g. "Slack", "Microsoft", "Salesforce"
  type: 'MESSAGING' | 'COMMUNICATION' | 'RPA' | 'ERP_SYNC' | 'API_GATEWAY';
}

export interface ConnectorPayload {
  [key: string]: any;
}

export interface ConnectorResponse {
  success: boolean;
  externalId?: string;
  error?: string;
  timestamp: string;
}

export interface EnterpriseConnector {
  metadata: ConnectorMetadata;
  
  /**
   * Evaluates if the connector can physically connect to the remote service.
   */
  healthCheck(): Promise<boolean>;

  /**
   * Executes the action against the external service.
   */
  execute(payload: ConnectorPayload): Promise<ConnectorResponse>;
}

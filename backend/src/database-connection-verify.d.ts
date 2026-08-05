declare module './database-connection-verify' {
  class DatabaseConnectionVerifier {
    constructor();
    verifyConnection(): Promise<{
      success: boolean;
      connectionTime?: number;
      totalAnuncios?: number;
      publicAnuncios?: number;
      queryTime?: number;
      error?: string;
    }>;
  }
  export = DatabaseConnectionVerifier;
}

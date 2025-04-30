export interface Website {
  id: string;
  url: string;
  status: 'up' | 'down' | 'checking' | 'error';
  lastCheck?: Date | null;
  statusCode?: number | null;
  error?: string | null;
}

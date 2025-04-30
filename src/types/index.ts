export interface WebsiteCheck {
  timestamp: Date;
  status: 'up' | 'down' | 'checking' | 'error';
  statusCode: number | null;
  error?: string | null;
}

export interface Website {
  id: string;
  url: string;
  status: 'up' | 'down' | 'checking' | 'error';
  lastCheck?: Date | null;
  statusCode?: number | null;
  error?: string | null;
  history?: WebsiteCheck[]; // Added history array
}

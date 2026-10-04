export interface SourceCitation {
  id: string;
  chunk_type: 'context' | 'qa';
  title: string;
  content: string;
  similarity: number;
  metadata?: any;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceCitation[];
  timestamp: string;
}

export interface SystemStatus {
  status: string;
  database?: {
    connected: boolean;
    totalChunks: number;
    breakdown: Array<{ type: string; count: number }>;
  };
  services?: {
    bgeM3Local: boolean;
    geminiConfigured: boolean;
    pgvectorReady: boolean;
  };
}

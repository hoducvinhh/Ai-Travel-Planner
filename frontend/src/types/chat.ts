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
  createdAt?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  userId?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    messages: number;
  };
}

export interface ChatSessionDetail extends ChatSession {
  messages: Array<{
    id: string;
    sessionId: string;
    role: 'user' | 'assistant';
    content: string;
    sources?: SourceCitation[];
    createdAt: string;
  }>;
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

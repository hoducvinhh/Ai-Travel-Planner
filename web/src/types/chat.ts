export interface SourceCitation {
  id: string;
  chunk_type: 'context' | 'qa';
  title: string;
  content: string;
  similarity: number;
  metadata?: any;
}

export interface WebSourceCitation {
  title: string;
  url: string;
  domain?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode?: 'internal' | 'live_web';
  sources?: SourceCitation[];
  webSources?: WebSourceCitation[];
  disclaimer?: string | null;
  routerReason?: string;
  timestamp: string;
  createdAt?: string;
}

export interface KnowledgeFeedbackPayload {
  sessionId?: string;
  userQuestion: string;
  botAnswer: string;
  reason: string; // "OUTDATED_PRICE" | "CLOSED" | "INCORRECT_INFO" | "OTHER"
  userNote?: string;
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
    sources?: any;
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

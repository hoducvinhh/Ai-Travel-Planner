export interface ChatUser {
  id: string;
  name?: string | null;
  email: string;
  preferredStyles?: string[];
  budgetLevel?: string | null;
}

export interface DirectMessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    name?: string | null;
    email: string;
  };
}

export interface ConversationItem {
  id: string;
  partner: ChatUser;
  lastMessage: DirectMessageItem | null;
  unreadCount: number;
  lastMessageAt: string;
}

export interface ConversationDetail {
  conversationId: string;
  partner: ChatUser;
  messages: DirectMessageItem[];
}

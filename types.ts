// types.ts
export interface Conversation {
    id: number;
    name: string;
    text: string;
    time: string;
    avatar: string;
    unread?: number;
  }
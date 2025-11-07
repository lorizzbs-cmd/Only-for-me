import { type Message, type OnlineUser } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Messages
  getMessages(): Promise<Message[]>;
  addMessage(username: string, text: string): Promise<Message>;
  
  // Online users
  getOnlineUsers(): Promise<OnlineUser[]>;
  addOnlineUser(id: string, username: string): Promise<OnlineUser>;
  removeOnlineUser(id: string): Promise<void>;
  getOnlineUser(id: string): Promise<OnlineUser | undefined>;
}

export class MemStorage implements IStorage {
  private messages: Message[] = [];
  private onlineUsers: Map<string, OnlineUser> = new Map();

  // Messages
  async getMessages(): Promise<Message[]> {
    return [...this.messages];
  }

  async addMessage(username: string, text: string): Promise<Message> {
    const message: Message = {
      id: randomUUID(),
      username,
      text,
      timestamp: Date.now(),
    };
    this.messages.push(message);
    
    // Keep only last 100 messages to prevent memory overflow
    if (this.messages.length > 100) {
      this.messages = this.messages.slice(-100);
    }
    
    return message;
  }

  // Online users
  async getOnlineUsers(): Promise<OnlineUser[]> {
    return Array.from(this.onlineUsers.values());
  }

  async addOnlineUser(id: string, username: string): Promise<OnlineUser> {
    const user: OnlineUser = { id, username };
    this.onlineUsers.set(id, user);
    return user;
  }

  async removeOnlineUser(id: string): Promise<void> {
    this.onlineUsers.delete(id);
  }

  async getOnlineUser(id: string): Promise<OnlineUser | undefined> {
    return this.onlineUsers.get(id);
  }
}

export const storage = new MemStorage();

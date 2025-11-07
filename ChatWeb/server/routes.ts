import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { type WSMessage } from "@shared/schema";
import { randomUUID } from "crypto";

interface WebSocketClient extends WebSocket {
  userId?: string;
  username?: string;
  isAlive?: boolean;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Create WebSocket server on /ws path to avoid conflicts with Vite HMR
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Heartbeat to detect broken connections
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
      const client = ws as WebSocketClient;
      if (client.isAlive === false) {
        return client.terminate();
      }
      client.isAlive = false;
      client.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(heartbeatInterval);
  });

  wss.on('connection', (ws: WebSocketClient) => {
    ws.isAlive = true;
    
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', async (data) => {
      try {
        const message: WSMessage = JSON.parse(data.toString());

        switch (message.type) {
          case 'join': {
            // Assign user ID and username
            ws.userId = randomUUID();
            ws.username = message.username;

            // Add user to storage
            await storage.addOnlineUser(ws.userId, ws.username);

            // Send init data to the new user
            const messages = await storage.getMessages();
            const onlineUsers = await storage.getOnlineUsers();
            
            const initMessage: WSMessage = {
              type: 'init',
              messages,
              onlineUsers,
              userId: ws.userId,
            };
            ws.send(JSON.stringify(initMessage));

            // Broadcast to all other clients that a new user joined
            const userJoinedMessage: WSMessage = {
              type: 'user_joined',
              username: ws.username,
              userId: ws.userId,
            };
            broadcast(wss, userJoinedMessage, ws);
            break;
          }

          case 'message': {
            if (!ws.userId || !ws.username) {
              return;
            }

            // Store message
            const newMessage = await storage.addMessage(ws.username, message.text);

            // Broadcast message to all clients
            const messageBroadcast: WSMessage = {
              type: 'message_broadcast',
              message: newMessage,
            };
            broadcast(wss, messageBroadcast);
            break;
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', async () => {
      if (ws.userId && ws.username) {
        // Remove user from storage
        await storage.removeOnlineUser(ws.userId);

        // Broadcast to all clients that user left
        const userLeftMessage: WSMessage = {
          type: 'user_left',
          username: ws.username,
          userId: ws.userId,
        };
        broadcast(wss, userLeftMessage);
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return httpServer;
}

// Helper function to broadcast messages to all connected clients
function broadcast(wss: WebSocketServer, message: WSMessage, excludeWs?: WebSocket) {
  const messageStr = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
}

import { useEffect, useRef, useState, useCallback } from "react";
import { type Message, type OnlineUser, type WSMessage } from "@shared/schema";

interface UseWebSocketReturn {
  messages: Message[];
  onlineUsers: OnlineUser[];
  isConnected: boolean;
  currentUserId: string | null;
  sendMessage: (text: string) => void;
  joinChat: (username: string) => void;
}

export function useWebSocket(): UseWebSocketReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Use refs to avoid triggering reconnects when username changes
  const usernameRef = useRef<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isIntentionalCloseRef = useRef(false);

  const connect = useCallback(() => {
    // Don't create duplicate connections
    if (wsRef.current?.readyState === WebSocket.CONNECTING || 
        wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      
      // Clear any pending reconnect timeout on successful connection
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      // Auto-rejoin if we have a stored username (reconnection scenario)
      if (usernameRef.current) {
        const joinMessage: WSMessage = { type: "join", username: usernameRef.current };
        ws.send(JSON.stringify(joinMessage));
      }
    };

    ws.onmessage = (event) => {
      try {
        const data: WSMessage = JSON.parse(event.data);

        switch (data.type) {
          case "init":
            // Clear stale data and set fresh state from server
            setMessages(data.messages);
            setOnlineUsers(data.onlineUsers);
            setCurrentUserId(data.userId);
            break;

          case "message_broadcast":
            setMessages((prev) => [...prev, data.message]);
            break;

          case "user_joined":
            setOnlineUsers((prev) => [
              ...prev,
              { id: data.userId, username: data.username },
            ]);
            break;

          case "user_left":
            setOnlineUsers((prev) => prev.filter((u) => u.id !== data.userId));
            break;
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      // Skip all state updates if this is an intentional close (unmount)
      if (isIntentionalCloseRef.current) {
        return;
      }

      setIsConnected(false);
      // Clear user ID and stale data until we reconnect and get a new init message
      setCurrentUserId(null);
      setMessages([]);
      setOnlineUsers([]);
      
      // Clear any existing reconnect timeout before scheduling a new one
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      // Attempt to reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectTimeoutRef.current = null;
        connect();
      }, 3000);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, []); // No dependencies - connection lifecycle is independent

  useEffect(() => {
    isIntentionalCloseRef.current = false;
    connect();

    return () => {
      // Mark as intentional close to prevent reconnects and state updates
      isIntentionalCloseRef.current = true;
      
      // Clear any pending reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      // Close the WebSocket
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const joinChat = useCallback((username: string) => {
    // Store username in ref for reconnection scenarios
    usernameRef.current = username;
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message: WSMessage = { type: "join", username };
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN && currentUserId) {
      const message: WSMessage = { type: "message", text };
      wsRef.current.send(JSON.stringify(message));
    }
  }, [currentUserId]);

  return {
    messages,
    onlineUsers,
    isConnected,
    currentUserId,
    sendMessage,
    joinChat,
  };
}

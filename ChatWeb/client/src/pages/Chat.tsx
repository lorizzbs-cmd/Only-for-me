import { useEffect, useRef, useState } from "react";
import { UsernameModal } from "@/components/UsernameModal";
import { MessageBubble } from "@/components/MessageBubble";
import { UserList } from "@/components/UserList";
import { ChatInput } from "@/components/ChatInput";
import { ChatHeader } from "@/components/ChatHeader";
import { useWebSocket } from "@/hooks/useWebSocket";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

export default function Chat() {
  const [hasJoined, setHasJoined] = useState(false);
  const [showUserList, setShowUserList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { messages, onlineUsers, isConnected, currentUserId, sendMessage, joinChat } =
    useWebSocket();

  const handleJoin = (username: string) => {
    joinChat(username);
    setHasJoined(true);
  };

  const handleSendMessage = (text: string) => {
    sendMessage(text);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!hasJoined) {
    return <UsernameModal onJoin={handleJoin} />;
  }

  // Show loading state while connecting
  if (!isConnected || !currentUserId) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground" data-testid="text-connecting">
            Connecting to chat...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <ChatHeader
        onToggleUserList={() => setShowUserList(!showUserList)}
        showUserListToggle={true}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          <ScrollArea className="flex-1 px-4 lg:px-6" ref={scrollAreaRef}>
            <div className="py-4 space-y-0" data-testid="messages-container">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[400px]">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground" data-testid="text-empty-state">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => {
                  const previousMessage = index > 0 ? messages[index - 1] : null;
                  const showUsername =
                    !previousMessage || previousMessage.username !== message.username;
                  const isOwn = message.username === onlineUsers.find(u => u.id === currentUserId)?.username;

                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={isOwn}
                      showUsername={showUsername}
                    />
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <ChatInput onSendMessage={handleSendMessage} disabled={!isConnected} />
        </div>

        {/* User list - hidden on mobile unless toggled */}
        <div className={`${showUserList ? "block" : "hidden"} lg:block`}>
          <UserList users={onlineUsers} currentUserId={currentUserId} />
        </div>
      </div>
    </div>
  );
}

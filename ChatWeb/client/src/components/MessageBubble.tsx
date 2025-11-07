import { type Message } from "@shared/schema";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showUsername: boolean;
}

export function MessageBubble({ message, isOwn, showUsername }: MessageBubbleProps) {
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const initials = message.username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`flex gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"} ${
        showUsername ? "mt-4" : "mt-1"
      }`}
      data-testid={`message-${message.id}`}
    >
      {showUsername && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
      )}
      {!showUsername && <div className="w-8 flex-shrink-0" />}

      <div className={`flex flex-col max-w-md ${isOwn ? "items-end" : "items-start"}`}>
        {showUsername && (
          <span
            className="text-xs font-semibold text-foreground mb-1 px-1"
            data-testid={`text-message-username-${message.id}`}
          >
            {message.username}
          </span>
        )}
        <div
          className={`px-4 py-3 ${
            isOwn
              ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md"
              : "bg-card border border-card-border text-card-foreground rounded-2xl rounded-bl-md"
          }`}
        >
          <p className="text-base leading-relaxed break-words" data-testid={`text-message-content-${message.id}`}>
            {message.text}
          </p>
        </div>
        <span
          className="text-xs text-muted-foreground mt-1 px-1 opacity-70"
          data-testid={`text-message-time-${message.id}`}
        >
          {formattedTime}
        </span>
      </div>
    </div>
  );
}

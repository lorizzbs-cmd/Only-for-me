import { type OnlineUser } from "@shared/schema";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from "lucide-react";

interface UserListProps {
  users: OnlineUser[];
  currentUserId?: string;
}

export function UserList({ users, currentUserId }: UserListProps) {
  return (
    <div className="w-56 bg-card border-l border-card-border flex flex-col h-full">
      <div className="p-4 border-b border-card-border">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-card-foreground">Online</h2>
        </div>
        <Badge variant="secondary" className="w-full justify-center" data-testid="badge-user-count">
          {users.length} {users.length === 1 ? "user" : "users"}
        </Badge>
      </div>

      <ScrollArea className="flex-1">
        <div className="py-4 space-y-1">
          {users.map((user) => {
            const initials = user.username
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            const isCurrentUser = user.id === currentUserId;

            return (
              <div
                key={user.id}
                className="flex items-center gap-3 px-4 py-2 hover-elevate"
                data-testid={`user-item-${user.id}`}
              >
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-status-online border border-card" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate" data-testid={`text-username-${user.id}`}>
                    {user.username}
                    {isCurrentUser && (
                      <span className="text-xs text-muted-foreground ml-1">(you)</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

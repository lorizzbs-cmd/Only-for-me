import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";

interface UsernameModalProps {
  onJoin: (username: string) => void;
}

export function UsernameModal({ onJoin }: UsernameModalProps) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onJoin(username.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-card-border rounded-2xl p-8 w-full max-w-md shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-card-foreground mb-2" data-testid="text-modal-title">
            Join Chat
          </h1>
          <p className="text-sm text-muted-foreground text-center" data-testid="text-modal-subtitle">
            Enter your name to start chatting with friends
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-base"
              maxLength={20}
              autoFocus
              data-testid="input-username"
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-lg py-3 font-semibold"
            disabled={!username.trim()}
            data-testid="button-join"
          >
            Join Chat
          </Button>
        </form>
      </div>
    </div>
  );
}

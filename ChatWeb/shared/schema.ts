import { z } from "zod";

// Message schema
export const messageSchema = z.object({
  id: z.string(),
  username: z.string(),
  text: z.string(),
  timestamp: z.number(),
});

export const insertMessageSchema = messageSchema.omit({ id: true, timestamp: true });

export type Message = z.infer<typeof messageSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Online user schema
export const onlineUserSchema = z.object({
  id: z.string(),
  username: z.string(),
});

export type OnlineUser = z.infer<typeof onlineUserSchema>;

// WebSocket message types
export const wsMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("join"),
    username: z.string(),
  }),
  z.object({
    type: z.literal("message"),
    text: z.string(),
  }),
  z.object({
    type: z.literal("user_joined"),
    username: z.string(),
    userId: z.string(),
  }),
  z.object({
    type: z.literal("user_left"),
    username: z.string(),
    userId: z.string(),
  }),
  z.object({
    type: z.literal("message_broadcast"),
    message: messageSchema,
  }),
  z.object({
    type: z.literal("init"),
    messages: z.array(messageSchema),
    onlineUsers: z.array(onlineUserSchema),
    userId: z.string(),
  }),
]);

export type WSMessage = z.infer<typeof wsMessageSchema>;

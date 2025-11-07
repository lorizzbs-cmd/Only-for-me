# Real-time Chat Application

## Overview

This is a real-time chat application that enables users to communicate instantly in a shared chat room. Users join by providing a username and can immediately start sending and receiving messages. The application features a clean, modern interface inspired by Discord and Slack's messaging patterns, with a focus on readability and efficient use of space.

The application is built as a full-stack TypeScript project with a React frontend and Express backend, using WebSockets for real-time bidirectional communication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **React 18** with TypeScript for the UI layer
- **Vite** as the build tool and development server
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management
- **Tailwind CSS** with custom design system for styling
- **shadcn/ui** component library (New York style) built on Radix UI primitives

**Design System:**
The application uses a carefully crafted design system defined in `design_guidelines.md` that prioritizes:
- System-based spacing using Tailwind units (2, 3, 4, 6, 8)
- Three-column desktop layout: Sidebar (w-64) | Chat Area (flex-1) | User List (w-56)
- Mobile-responsive design that collapses to single column
- Message bubble patterns with rounded corners and proper grouping
- Theme support (light/dark mode) with persistent user preference

**Component Architecture:**
- Atomic component structure with reusable UI primitives in `/client/src/components/ui/`
- Feature components for chat functionality (`ChatHeader`, `ChatInput`, `MessageBubble`, `UserList`, `UsernameModal`)
- Custom hooks pattern (`useWebSocket`, `useToast`, `useIsMobile`) for shared logic
- Path aliases configured for clean imports: `@/` for client code, `@shared/` for shared types

**State Management Strategy:**
- WebSocket connection state managed via custom `useWebSocket` hook
- Local component state for UI interactions
- Real-time message synchronization through WebSocket events
- Automatic reconnection logic with username persistence

### Backend Architecture

**Technology Stack:**
- **Node.js** with **Express** for HTTP server
- **ws** library for WebSocket server implementation
- **TypeScript** for type safety across the stack
- **Drizzle ORM** configured for PostgreSQL (currently using in-memory storage)

**Server Design:**
- HTTP server and WebSocket server run on the same port
- WebSocket path isolated to `/ws` to avoid conflicts with Vite HMR
- In-memory storage implementation (`MemStorage`) for messages and online users
- Storage interface (`IStorage`) designed for easy migration to database persistence
- Heartbeat mechanism (30-second intervals) to detect and clean up broken connections

**WebSocket Protocol:**
The application uses a custom message protocol defined in `shared/schema.ts` with discriminated unions:
- `join` - User joins the chat room
- `message` - User sends a chat message
- `user_joined` - Broadcast when a user connects
- `user_left` - Broadcast when a user disconnects
- `message_broadcast` - Broadcast of new messages to all clients
- `init` - Initial state sent to new connections (message history, online users)

**Message Flow:**
1. Client sends message via WebSocket
2. Server validates and stores message
3. Server broadcasts to all connected clients
4. Clients update UI optimistically or on receipt

**Data Storage Strategy:**
Currently uses in-memory storage with:
- Message history limited to last 100 messages to prevent memory overflow
- Online user tracking with Map data structure for O(1) lookups
- Designed for migration to PostgreSQL via Drizzle ORM (configuration present in `drizzle.config.ts`)

### External Dependencies

**UI Component Libraries:**
- **Radix UI** - Headless, accessible component primitives (dialogs, popovers, tooltips, etc.)
- **Lucide React** - Icon library for consistent iconography
- **class-variance-authority** - Type-safe variant styling
- **tailwind-merge** and **clsx** - Utility class composition

**Form and Validation:**
- **Zod** - Runtime type validation and schema definition
- **react-hook-form** with **@hookform/resolvers** - Form state management
- **drizzle-zod** - Schema integration between Drizzle and Zod

**Database and ORM:**
- **Drizzle ORM** - Type-safe SQL query builder
- **@neondatabase/serverless** - PostgreSQL driver for Neon (configured but not actively used)
- **connect-pg-simple** - PostgreSQL session store for Express (available for future use)

**Real-time Communication:**
- **ws** - WebSocket server implementation
- Native WebSocket API on client side

**Development Tools:**
- **@replit/vite-plugin-*** - Replit-specific Vite plugins for development experience
- **esbuild** - Fast JavaScript bundler for production builds
- **tsx** - TypeScript execution for development

**Utilities:**
- **date-fns** - Date formatting and manipulation
- **nanoid** - Unique ID generation
- **embla-carousel-react** - Carousel component (available but not currently used)

**Build and Development:**
- Vite handles client-side bundling with React plugin
- esbuild bundles server code for production
- TypeScript strict mode enabled across the entire codebase
- Path aliases resolve consistently between client and server

**Notable Architectural Decisions:**
- Schema definitions in `shared/schema.ts` are shared between client and server for type safety
- WebSocket reconnection logic preserves username to maintain user identity
- Message grouping logic prevents repetitive username display for consecutive messages from same user
- Auto-scroll behavior keeps chat view at bottom when new messages arrive
# Design Guidelines: Simple Chat Website

## Design Approach
**System-Based Approach**: Drawing from Discord and Slack's messaging patterns for optimal chat UX
- Prioritize message readability and conversation flow
- Emphasize clear information hierarchy
- Focus on efficient space utilization and real-time feedback

## Layout System
**Spacing Primitives**: Use Tailwind units of 2, 3, 4, 6, and 8 (p-2, p-3, m-4, gap-6, h-8)
- Consistent padding within message bubbles: p-3 or p-4
- Message spacing: gap-2 between consecutive messages, gap-6 for visual breaks
- Sidebar padding: p-4 for content areas
- Input field padding: p-3

**Core Layout Structure**:
- Three-column layout on desktop: Sidebar (w-64) | Chat Area (flex-1) | User List (w-56)
- Mobile: Stack to single column with bottom nav for users list
- Fixed header (h-16) and input area (h-20), scrollable message area between

## Typography
**Font Stack**: System fonts (ui-sans-serif) for performance
- Username/Headers: font-semibold text-sm
- Messages: font-normal text-base leading-relaxed
- Timestamps: font-normal text-xs
- Input field: font-normal text-base

## Component Library

### Message Components
**Message Bubble**:
- Own messages: Align right, max-w-md, rounded-2xl rounded-br-md
- Other messages: Align left, max-w-md, rounded-2xl rounded-bl-md
- Padding: p-3, includes username above (text-xs font-semibold) and timestamp below (text-xs opacity-70)
- Group consecutive messages from same user (no username repetition, reduced spacing)

### User List Panel
- Fixed width sidebar (w-56) on desktop
- User items: flex items-center gap-3 p-2, hover state
- Online indicator: w-2 h-2 rounded-full next to username
- User count badge at top: "Online: X users"
- Scrollable list with py-4 container padding

### Chat Input Area
- Fixed bottom bar: h-20 with p-4
- Input field: flex-1, rounded-full, px-4 py-3
- Send button: h-10 w-10 rounded-full, positioned absolute right
- Container: flex items-center gap-2

### Header Bar
- Fixed top bar: h-16 flex items-center px-6
- Room title: text-lg font-semibold
- Desktop: Shows room name
- Mobile: Includes menu toggle for user list

### Username Entry Modal
- Centered overlay with backdrop
- Modal card: max-w-md, rounded-2xl, p-8
- Title: text-2xl font-bold mb-2
- Subtitle: text-sm mb-6
- Input: w-full rounded-lg px-4 py-3
- Join button: w-full rounded-lg py-3 font-semibold

## Interaction Patterns
- Message send: Instant display with subtle fade-in
- Auto-scroll: Smooth scroll to bottom on new messages
- Typing indicators: Small text below input area (optional)
- Message hover: Reveal timestamp if hidden
- No elaborate animations - focus on speed and clarity

## Responsive Behavior
**Desktop (lg:)**: Three-column layout, user list always visible
**Tablet (md:)**: Two-column (hide user list, show on tap), collapsible sidebar
**Mobile (base)**: Single column, bottom sheet for user list, full-width messages

## Images
No hero images or decorative imagery needed. This is a functional chat application. Optional: Add user avatars as circular placeholders (w-8 h-8 rounded-full) next to usernames in both messages and user list for visual identification.

## Accessibility
- Clear focus states on input fields and buttons
- Keyboard navigation support (Enter to send, Tab to navigate)
- ARIA labels for icon buttons
- Sufficient contrast for message text
- Screen reader announcements for new messages (aria-live)
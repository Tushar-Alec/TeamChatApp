# Real-Time Chat Application <a href="https://team-chat-app-three.vercel.app/"> Live App<a>
<a><a>
A full-stack real-time chat application that allows users to join channels, send messages instantly, view online users, and load older messages using pagination. The app supports authentication, presence tracking, and smooth real-time communication across multiple users.

## Features

* User authentication
* Channel-based real-time chat
* Real-time message updates
* Message pagination (load older messages)
* Auto-scroll for new messages
* Online user presence tracking
* Clean and responsive UI

## Tech Stack

* Frontend: Next.js (React), CSS
* Backend & Realtime: Firebase Firestore, Firebase Realtime Database
* Authentication: Firebase Authentication

## Setup & Run Instructions

1. Clone the project repository.
2. Install dependencies.
3. Enable the following Firebase services:

   * Authentication (Email/Password)
   * Firestore Database
   * Realtime Database
4. Start the development server using `npm run dev`.

## Assumptions & Limitations
• Firebase free tier limits apply for database reads/writes and concurrent connections.
• The application currently supports basic email/password authentication only.
• Presence detection depends on browser and network stability, so sudden disconnects may not update status instantly.

## Optional Add-Ons
• Typing Indicators – Shows when another user is actively typing in the channel.
• Message Editing and Deletion – Users can edit or delete their own messages after sending.

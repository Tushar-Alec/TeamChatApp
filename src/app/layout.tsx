// src/app/layout.tsx
export const metadata = {
  title: " Chat App",
  description: "Realtime chat app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

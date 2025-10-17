"use client";
import { AuthContextProvider } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToastConfig from "@/components/toasts/ToastConfig";
import "@/assets/styles/animations.css";
import "@/assets/styles/skeleton.css";
import "./Global.css"

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>
            {children}
            <ToastConfig />
          </AuthContextProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

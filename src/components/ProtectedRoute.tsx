"use client";

import { useAuthContext } from "@/hooks/useAuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, user } = useAuthContext();
  const router = useRouter();

  const forceLogin = () => {
    router.push("/auth/login");
  };

  useEffect(() => {
    if (!loading && !user) {
      forceLogin();
    }
  }, [loading, user, forceLogin]);

  if (loading) return <p>Loading...</p>;

  return <>{user ? children : null}</>;
}

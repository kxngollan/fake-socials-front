"use client";

import { useRouter } from "next/navigation";
import { useAuthContext } from "./useAuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useFetch() {
  const { user } = useAuthContext();
  const router = useRouter();

  const handleFetch = async (url, options = {}, content_type = true) => {
    try {
      const response = await fetch(API_URL + url, {
        headers: {
          ...(content_type ? { "Content-Type": "application/json" } : {}),
          ...(user ? { Authorization: `Bearer ${user.token}` } : {}),
        },
        mode: "cors",
        ...options,
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        router.push("/auth/login"); // Client-side redirect
        throw new Error("Unauthorized. Redirecting to login...");
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch data");
      }

      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  return handleFetch;
}

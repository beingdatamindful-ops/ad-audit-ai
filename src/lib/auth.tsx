/* eslint-disable react-refresh/only-export-components -- AuthProvider + useAuth + shared types */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type ProfileStatus = "pending" | "approved" | "rejected";

function normalizeProfileStatus(value: string | null | undefined): ProfileStatus {
  const s = value?.toLowerCase().trim();
  if (s === "approved" || s === "rejected" || s === "pending") return s;
  return "pending";
}

/**
 * Reads `profiles.status` for the current JWT user.
 * Prefer RPC (SECURITY DEFINER, stable with RLS); fall back to REST if RPC is missing.
 */
export async function fetchProfileApprovalStatus(userId: string): Promise<ProfileStatus> {
  const rpc = await supabase.rpc("get_my_profile_status");
  if (!rpc.error) {
    const raw = rpc.data;
    if (raw != null && String(raw).trim() !== "") {
      return normalizeProfileStatus(String(raw));
    }
    return "pending";
  }

  const err = rpc.error;
  const msg = err.message?.toLowerCase() ?? "";
  const missingRpc =
    err.code === "PGRST202" ||
    err.code === "42883" ||
    msg.includes("could not find") ||
    msg.includes("does not exist");

  if (!missingRpc) {
    console.error("[auth] get_my_profile_status failed:", err.message);
  }

  const maxAttempts = missingRpc ? 8 : 2;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const { data, error } = await supabase
      .from("profiles")
      .select("status")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("[auth] profiles select failed:", error.message);
      return "pending";
    }
    if (data?.status != null && String(data.status).trim() !== "") {
      return normalizeProfileStatus(data.status);
    }
    await new Promise<void>((r) => {
      setTimeout(r, 60 + attempt * 50);
    });
  }

  console.warn("[auth] No profile row for user after REST retries:", userId);
  return "pending";
}

type AuthContextValue = {
  session: Session | null;
  status: ProfileStatus | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<ProfileStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let profileRequestId = 0;

    async function fetchProfileForUser(userSession: Session) {
      const requestId = ++profileRequestId;
      setLoading(true);

      await new Promise<void>((resolve) => {
        setTimeout(resolve, 0);
      });
      if (cancelled || requestId !== profileRequestId) return;

      const next = await fetchProfileApprovalStatus(userSession.user.id);
      if (cancelled || requestId !== profileRequestId) return;

      setStatus(next);
      setLoading(false);
    }

    const { data: subscription } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);

      if (!nextSession) {
        setStatus(null);
        setLoading(false);
        return;
      }

      if (event === "TOKEN_REFRESHED") return;

      void fetchProfileForUser(nextSession);
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => ({ session, status, loading }), [session, status, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}

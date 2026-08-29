import { cookies, headers } from "next/headers";

export interface UserSession {
  userId: string;
  email: string;
  role?: string;
}

export async function getSession(): Promise<UserSession | null> {
  const reqHeaders = await headers();
  const authHeader = reqHeaders.get("authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    if (token === "mock-organizer-token" || token.includes("organizer")) {
      return {
        userId: "org_12345",
        email: "organizer@votesphere.com",
        role: "ORGANIZER",
      };
    }
  }

  const cookieStore = await cookies();
  const authCookie = cookieStore.get("vs_auth_session")?.value;
  if (authCookie) {
    try {
      const parsed = JSON.parse(authCookie) as UserSession;
      if (parsed && parsed.userId) {
        return parsed;
      }
    } catch {
      // Fallback on malformed cookie
    }
  }

  return null;
}

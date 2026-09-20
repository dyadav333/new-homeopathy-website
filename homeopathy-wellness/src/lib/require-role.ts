import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@/types/enums";

/**
 * Server-side authorization guard. Call this at the top of any protected
 * Server Component or Route Handler — never rely on hiding a UI element
 * as the only protection, since that check happens client-side only.
 */
export async function requireRole(allowed: Role[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { authorized: false as const, session: null };
  }
  if (!allowed.includes(session.user.role)) {
    return { authorized: false as const, session };
  }
  return { authorized: true as const, session };
}

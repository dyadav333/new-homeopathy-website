"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return <button className="dashboard-logout" onClick={() => signOut({ callbackUrl: "/" })}>Log out <span>↗</span></button>;
}

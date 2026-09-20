"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const items = [
  ["Overview", "/patient/dashboard"],
  ["My Appointments", "/patient/appointments"],
  ["My Tests", "/patient/tests"],
  ["My Medicine Orders", "/patient/orders"],
  ["My Medical Records", "/patient/records"],
  ["My Feedback", "/patient/feedback"],
  ["View / Update Profile", "/patient/profile"],
  ["Settings", "/patient/settings"],
];

export function DashboardNav({ canSwitch }: { canSwitch: boolean }) {
  const pathname = usePathname();
  return <aside className="dashboard-nav">
    <div className="dashboard-mark"><span>HW</span><div><strong>Patient space</strong><small>Homeopathy Wellness</small></div></div>
    <nav aria-label="Patient dashboard">
      {items.map(([label, href]) => <Link key={href} href={href} className={pathname === href ? "active" : ""}><span className="nav-dot" />{label}</Link>)}
    </nav>
    {canSwitch && <Link href="/doctor/dashboard" className="provider-switch"><strong>Switch to provider space</strong><span>Manage consultations and patients <b>→</b></span></Link>}
    <button className="dashboard-logout" onClick={() => signOut({ callbackUrl: "/" })}>Log out <span>↗</span></button>
  </aside>;
}
"use client";

import { useRouter, usePathname } from "next/navigation";
import DashboardShell from "@/components/direction-3-premium/Dashboard-Premium/DashboardShell";

const ROLE_CONFIG = {
  creator: {
    isAdmin: false,
    tabs: ["overview", "products", "orders", "analytics", "settings"],
  },
  admin: {
    isAdmin: true,
    tabs: ["overview", "creators", "orders", "analytics", "settings", "moderation"],
  },
};

export default function DashboardLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();

  // Works for ANY base path, e.g.:
  //   /dashboard/creator/orders
  //   /mockups/direction-3-premium/dashboard/creator/orders
  const segments = pathname.split("/").filter(Boolean);

  // Find "creator" or "admin" wherever it appears in the path
  const roleIndex = segments.findIndex((s) => s === "creator" || s === "admin");
  const role      = segments[roleIndex] ?? "creator";
  const tabSlug   = segments[roleIndex + 1];

  // Reconstruct full base path up to and including the role segment
  // e.g. /mockups/direction-3-premium/dashboard/creator
  const basePath  = "/" + segments.slice(0, roleIndex + 1).join("/");

  const config    = ROLE_CONFIG[role] ?? ROLE_CONFIG.creator;
  const activeTab = Math.max(config.tabs.indexOf(tabSlug), 0);

  return (
    <DashboardShell
      isAdmin={config.isAdmin}
      activeTab={activeTab}
      onTabChange={(slug) => router.push(`${basePath}/${slug}`)}
    >
      {children}
    </DashboardShell>
  );
}
"use client";

import { usePathname } from "next/navigation";

export default function NavbarDetector({ children }) {
  const pathname = usePathname();

  // List all valid routes in your app
  const validRoutes = [
    "/",
    "/about",
    "/contact",
    "/dashboard",
    "/profile",
    "/settings",
    // Add all your valid routes here
  ];

  // Check if current pathname matches any valid route
  const showNavbar = validRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  return showNavbar ? children : null;
}
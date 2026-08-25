"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/direction-3-premium/Layout/Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  // Hide navbar only on the not-found page
  const isNotFoundPage = pathname === "/not-found";

  return !isNotFoundPage ? <Navbar /> : null;
}
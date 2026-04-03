// app/dashboard/[role]/page.jsx
// Default page when user visits /dashboard/[role] without a specific tab
// Automatically redirects to the overview tab

import { redirect } from "next/navigation";

export async function generateStaticParams() {
  return [
    { role: "customer" },
    { role: "creator" },
    { role: "admin" },
  ];
}

export default async function DashboardRoleHome({ params }) {
  const { role } = await params;

  // Validate role
  const validRoles = ["customer", "creator", "admin"];
  if (!validRoles.includes(role)) {
    return notFound();
  }

  // Redirect to overview tab
  redirect(`/dashboard/${role}/overview`);
}
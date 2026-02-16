import { redirect } from "next/navigation";

// Redirect to the default tab relative to wherever this file is mounted.
// Next.js resolves this relative to the current route group automatically.
export default function CreatorRoot() {
  redirect("./overview");
}
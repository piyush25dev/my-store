import { notFound } from "next/navigation";
import AdminOverviewPage    from "@/components/direction-3-premium/Dashboard-Premium/Admin_Dashboard/Components/AdminOverviewPage";
import AdminCreatorsPage    from "@/components/direction-3-premium/Dashboard-Premium/Admin_Dashboard/Components/Admincreatorspage"
import AdminOrdersPage      from "@/components/direction-3-premium/Dashboard-Premium/Admin_Dashboard/Components/Adminorderspage";
import AdminAnalyticsPage   from "@/components/direction-3-premium/Dashboard-Premium/Admin_Dashboard/Components/Adminanalyticspage";
import AdminSettingsPage    from "@/components/direction-3-premium/Dashboard-Premium/Admin_Dashboard/Components/Adminsettingspage";
import AdminModerationPage    from "@/components/direction-3-premium/Dashboard-Premium/Admin_Dashboard/Components/Adminmoderationpage";

const TABS = {
  overview:  AdminOverviewPage,
  creators:  AdminCreatorsPage,
  orders:    AdminOrdersPage,
  analytics: AdminAnalyticsPage,
  settings:  AdminSettingsPage,
  moderation:  AdminModerationPage,
};

export function generateStaticParams() {
  return Object.keys(TABS).map((tab) => ({ tab }));
}

export default async function AdminTabPage({ params }) {
  const { tab } = await params;
  const Page = TABS[tab];
  if (!Page) notFound();
  return <Page />;
}
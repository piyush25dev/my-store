import { notFound } from "next/navigation";
import OverviewPage  from "@/components/direction-3-premium/Dashboard-Premium/Creator_Dashboard/Components/OverviewPage";
import ProductsPage  from "@/components/direction-3-premium/Dashboard-Premium/Creator_Dashboard/Components/ProductsPage";
import OrdersPage    from "@/components/direction-3-premium/Dashboard-Premium/Creator_Dashboard/Components/OrdersPage";
import AnalyticsPage from "@/components/direction-3-premium/Dashboard-Premium/Creator_Dashboard/Components/AnalyticsPage";
import SettingsPage  from "@/components/direction-3-premium/Dashboard-Premium/Creator_Dashboard/Components/SettingsPage";

const TABS = {
  overview:  OverviewPage,
  products:  ProductsPage,
  orders:    OrdersPage,
  analytics: AnalyticsPage,
  settings:  SettingsPage,
};

export function generateStaticParams() {
  return Object.keys(TABS).map((tab) => ({ tab }));
}

export default async function CreatorTabPage({ params }) {
  const { tab } = await params;
  const Page = TABS[tab];
  if (!Page) notFound();
  return <Page />;
}
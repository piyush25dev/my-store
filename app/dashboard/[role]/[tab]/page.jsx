// app/dashboard/[role]/[tab]/page.jsx
// Unified dashboard page that handles all roles dynamically

import { notFound } from "next/navigation";

// ============================================================================
// CUSTOMER COMPONENTS
// ============================================================================
import CustomerOverviewPage from "@/components/direction-3-premium/Dashboard-Premium/Customer_Dashboard/CustomerOverviewPage";
import CustomerOrdersPage from "@/components/direction-3-premium/Dashboard-Premium/Customer_Dashboard/CustomerOrdersPage";
import CustomerWishlistPage from "@/components/direction-3-premium/Dashboard-Premium/Customer_Dashboard/CustomerWishlistPage";
import CustomerSettingsPage from "@/components/direction-3-premium/Dashboard-Premium/Customer_Dashboard/CustomerSettingsPage";

// ============================================================================
// CREATOR COMPONENTS
// ============================================================================
import CreatorOverviewPage from "@/components/direction-3-premium/Dashboard-Premium/Creator_Dashboard/Components/OverviewPage";
import CreatorProductsPage from "@/components/direction-3-premium/Dashboard-Premium/Creator_Dashboard/Components/Products/ProductsPage";
import CreatorOrdersPage from "@/components/direction-3-premium/Dashboard-Premium/Creator_Dashboard/Components/OrdersPage";
import CreatorAnalyticsPage from "@/components/direction-3-premium/Dashboard-Premium/Creator_Dashboard/Components/AnalyticsPage";
import CreatorSettingsPage from "@/components/direction-3-premium/Dashboard-Premium/Creator_Dashboard/Components/SettingsPage";

// ============================================================================
// ADMIN COMPONENTS
// ============================================================================
import AdminOverviewPage from "@/components/direction-3-premium/Dashboard-Premium/Admin_Dashboard/Components/AdminOverviewPage";
import AdminCreatorsPage from "@/components/direction-3-premium/Dashboard-Premium/Admin_Dashboard/Components/Admincreatorspage";
import AdminOrdersPage from "@/components/direction-3-premium/Dashboard-Premium/Admin_Dashboard/Components/Adminorderspage";
import AdminAnalyticsPage from "@/components/direction-3-premium/Dashboard-Premium/Admin_Dashboard/Components/Adminanalyticspage";
import AdminSettingsPage from "@/components/direction-3-premium/Dashboard-Premium/Admin_Dashboard/Components/Adminsettingspage";
import AdminModerationPage from "@/components/direction-3-premium/Dashboard-Premium/Admin_Dashboard/Components/Adminmoderationpage";

// ============================================================================
// ROLE-BASED TAB MAPPING
// ============================================================================

const ROLE_TABS = {
  customer: {
    overview: CustomerOverviewPage,
    orders: CustomerOrdersPage,
    wishlist: CustomerWishlistPage,
    settings: CustomerSettingsPage,
  },
  creator: {
    overview: CreatorOverviewPage,
    products: CreatorProductsPage,
    orders: CreatorOrdersPage,
    analytics: CreatorAnalyticsPage,
    settings: CreatorSettingsPage,
  },
  admin: {
    overview: AdminOverviewPage,
    creators: AdminCreatorsPage,
    orders: AdminOrdersPage,
    analytics: AdminAnalyticsPage,
    settings: AdminSettingsPage,
    moderation: AdminModerationPage,
  },
};

// ============================================================================
// VALID ROLES
// ============================================================================
const VALID_ROLES = Object.keys(ROLE_TABS);

// ============================================================================
// STATIC PARAMS GENERATION
// ============================================================================

export function generateStaticParams() {
  const params = [];

  // Generate params for each role and its tabs
  Object.entries(ROLE_TABS).forEach(([role, tabs]) => {
    Object.keys(tabs).forEach((tab) => {
      params.push({ role, tab });
    });
  });

  return params;
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default async function DashboardTabPage({ params }) {
  // Await params (Next.js 15+)
  const { role, tab } = await params;

  // Validate role
  if (!VALID_ROLES.includes(role)) {
    return notFound();
  }

  // Get tabs for this role
  const tabsForRole = ROLE_TABS[role];

  // Validate tab exists for this role
  if (!tabsForRole[tab]) {
    return notFound();
  }

  // Get the component for this role + tab
  const PageComponent = tabsForRole[tab];

  // Render the page component
  return <PageComponent />;
}

// ============================================================================
// METADATA
// ============================================================================

export async function generateMetadata({ params }) {
  const { role, tab } = await params;

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
  const tabLabel = tab.charAt(0).toUpperCase() + tab.replace(/_/g, " ").slice(1);

  return {
    title: `${tabLabel} - ${roleLabel} Dashboard`,
    description: `${tabLabel} page for ${role} dashboard`,
  };
}
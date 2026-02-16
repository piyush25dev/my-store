// ── Platform Stats ────────────────────────────────────────────────────────────
export const adminStats = [
  { label: "Gross Revenue",    value: "₹48.2L",  trend: "+22.4%", trendUp: true,  color: "emerald", icon: "IndianRupee"    },
  { label: "Active Creators",  value: "1,284",   trend: "+156",   trendUp: true,  color: "blue",    icon: "Users"          },
  { label: "Total Orders",     value: "18,492",  trend: "+2,140", trendUp: true,  color: "purple",  icon: "ShoppingCart"   },
  { label: "Dispute Rate",     value: "0.8%",    trend: "-0.2%",  trendUp: false, color: "amber",   icon: "AlertTriangle"  },
];

// ── Stores ────────────────────────────────────────────────────────────────────
export const adminStores = [
  { id: "s-01", name: "Neha's Studio",      owner: "Neha Sharma",  category: "Education",   revenue: 342000, orders: 612, products: 14, status: "Active",    created: "Oct 2024", rating: 4.9 },
  { id: "s-02", name: "Rohan Design Co.",   owner: "Rohan Mehta",  category: "Design",      revenue: 218000, orders: 389, products: 8,  status: "Active",    created: "Sep 2024", rating: 4.7 },
  { id: "s-03", name: "Ananya Creates",     owner: "Ananya Iyer",  category: "Templates",   revenue: 187000, orders: 301, products: 11, status: "Active",    created: "Nov 2024", rating: 4.6 },
  { id: "s-04", name: "Kunal's Toolbox",    owner: "Kunal Bose",   category: "Productivity",revenue: 94000,  orders: 178, products: 5,  status: "Suspended", created: "Aug 2024", rating: 3.8 },
  { id: "s-05", name: "Meera Photography",  owner: "Meera Pillai", category: "Photography", revenue: 76000,  orders: 142, products: 7,  status: "Active",    created: "Dec 2024", rating: 4.8 },
  { id: "s-06", name: "Sid's Code Lab",     owner: "Sid Kapoor",   category: "Development", revenue: 51000,  orders: 98,  products: 3,  status: "Pending",   created: "Jan 2025", rating: null },
  { id: "s-07", name: "Priya Wellness",     owner: "Priya Mehta",  category: "Wellness",    revenue: 38000,  orders: 71,  products: 6,  status: "Active",    created: "Jan 2025", rating: 4.5 },
  { id: "s-08", name: "Dev's Dev Hub",      owner: "Dev Kumar",    category: "Development", revenue: 29000,  orders: 54,  products: 4,  status: "Suspended", created: "Dec 2024", rating: 2.9 },
];

// ── Creators ──────────────────────────────────────────────────────────────────
export const adminCreators = [
  { id: "c-01", name: "Neha Sharma",  handle: "@nehasharma",  email: "neha@studio.com",    revenue: 342000, orders: 612, products: 14, status: "Active",    joined: "Oct 2024", avatar: "NS", country: "India",  payoutPending: 18420  },
  { id: "c-02", name: "Rohan Mehta",  handle: "@rohanm",      email: "rohan@designco.com", revenue: 218000, orders: 389, products: 8,  status: "Active",    joined: "Sep 2024", avatar: "RM", country: "India",  payoutPending: 12800  },
  { id: "c-03", name: "Ananya Iyer",  handle: "@ananyai",     email: "ananya@creates.in",  revenue: 187000, orders: 301, products: 11, status: "Active",    joined: "Nov 2024", avatar: "AI", country: "India",  payoutPending: 9400   },
  { id: "c-04", name: "Kunal Bose",   handle: "@kunalbose",   email: "kunal@toolbox.io",   revenue: 94000,  orders: 178, products: 5,  status: "Suspended", joined: "Aug 2024", avatar: "KB", country: "India",  payoutPending: 0      },
  { id: "c-05", name: "Meera Pillai", handle: "@meera.p",     email: "meera@photo.in",     revenue: 76000,  orders: 142, products: 7,  status: "Active",    joined: "Dec 2024", avatar: "MP", country: "India",  payoutPending: 5100   },
  { id: "c-06", name: "Sid Kapoor",   handle: "@sidk",        email: "sid@codelab.dev",    revenue: 51000,  orders: 98,  products: 3,  status: "Pending",   joined: "Jan 2025", avatar: "SK", country: "USA",    payoutPending: 0      },
  { id: "c-07", name: "Priya Mehta",  handle: "@priyaw",      email: "priya@wellness.com", revenue: 38000,  orders: 71,  products: 6,  status: "Active",    joined: "Jan 2025", avatar: "PM", country: "India",  payoutPending: 2200   },
  { id: "c-08", name: "Dev Kumar",    handle: "@devkumar",    email: "dev@devhub.io",      revenue: 29000,  orders: 54,  products: 4,  status: "Suspended", joined: "Dec 2024", avatar: "DK", country: "India",  payoutPending: 0      },
];

// ── Users (buyers) ────────────────────────────────────────────────────────────
export const adminUsers = [
  { id: "u-01", name: "Riya Sharma",    email: "riya@email.com",    orders: 8,  spent: 14200, status: "Active",  joined: "Nov 2024", country: "India"     },
  { id: "u-02", name: "Aman Verma",     email: "aman@email.com",    orders: 5,  spent: 6800,  status: "Active",  joined: "Dec 2024", country: "India"     },
  { id: "u-03", name: "Priya Mehta",    email: "priyam@email.com",  orders: 12, spent: 24400, status: "Active",  joined: "Oct 2024", country: "India"     },
  { id: "u-04", name: "Arjun Nair",     email: "arjun@email.com",   orders: 3,  spent: 3900,  status: "Active",  joined: "Jan 2025", country: "India"     },
  { id: "u-05", name: "Sneha Patil",    email: "sneha@email.com",   orders: 7,  spent: 9800,  status: "Banned",  joined: "Sep 2024", country: "India"     },
  { id: "u-06", name: "James Wilson",   email: "james@email.com",   orders: 4,  spent: 8200,  status: "Active",  joined: "Nov 2024", country: "USA"       },
  { id: "u-07", name: "Emma Clarke",    email: "emma@email.com",    orders: 6,  spent: 11400, status: "Active",  joined: "Dec 2024", country: "UK"        },
  { id: "u-08", name: "Rahul Joshi",    email: "rahul@email.com",   orders: 2,  spent: 1600,  status: "Active",  joined: "Jan 2025", country: "India"     },
];

// ── Transactions ──────────────────────────────────────────────────────────────
export const adminTransactions = [
  { id: "TXN-8821", user: "Riya Sharma",   creator: "Neha Sharma",  product: "Signature Course", amount: 2499, fee: 200, net: 2299, status: "Settled",  date: "Jan 14, 2025", method: "UPI"        },
  { id: "TXN-8820", user: "Aman Verma",    creator: "Rohan Mehta",  product: "UI Kit Pro",       amount: 1299, fee: 104, net: 1195, status: "Settled",  date: "Jan 14, 2025", method: "Card"       },
  { id: "TXN-8819", user: "Priya Mehta",   creator: "Ananya Iyer",  product: "Design Bundle",    amount: 1299, fee: 104, net: 1195, status: "Pending",  date: "Jan 13, 2025", method: "UPI"        },
  { id: "TXN-8818", user: "Dev Kumar",     creator: "Neha Sharma",  product: "Notion Kit",       amount: 799,  fee: 64,  net: 735,  status: "Refunded", date: "Jan 13, 2025", method: "NetBanking" },
  { id: "TXN-8817", user: "Sneha Patil",   creator: "Meera Pillai", product: "Photo Pack",       amount: 599,  fee: 48,  net: 551,  status: "Settled",  date: "Jan 12, 2025", method: "Card"       },
  { id: "TXN-8816", user: "Arjun Nair",    creator: "Ananya Iyer",  product: "Notion Template",  amount: 499,  fee: 40,  net: 459,  status: "Settled",  date: "Jan 12, 2025", method: "UPI"        },
  { id: "TXN-8815", user: "James Wilson",  creator: "Rohan Mehta",  product: "Branding Kit",     amount: 1099, fee: 88,  net: 1011, status: "Pending",  date: "Jan 11, 2025", method: "Card"       },
  { id: "TXN-8814", user: "Emma Clarke",   creator: "Neha Sharma",  product: "Signature Course", amount: 2499, fee: 200, net: 2299, status: "Settled",  date: "Jan 11, 2025", method: "Card"       },
];

// ── Moderation / Approvals ────────────────────────────────────────────────────
export const adminModeration = [
  { id: "mod-01", type: "Store Approval", subject: "Sid's Code Lab",      submittedBy: "Sid Kapoor",   date: "Jan 14, 2025", priority: "high",   status: "Pending",  note: "New store application - needs KYC review" },
  { id: "mod-02", type: "Product Review", subject: "Advanced Hacking PDF", submittedBy: "Dev Kumar",    date: "Jan 13, 2025", priority: "high",   status: "Flagged",  note: "Content policy violation reported" },
  { id: "mod-03", type: "Payout Request", subject: "₹18,420 payout",       submittedBy: "Neha Sharma",  date: "Jan 13, 2025", priority: "medium", status: "Pending",  note: "Payout threshold met - awaiting approval" },
  { id: "mod-04", type: "Payout Request", subject: "₹12,800 payout",       submittedBy: "Rohan Mehta",  date: "Jan 12, 2025", priority: "medium", status: "Pending",  note: "Payout threshold met - awaiting approval" },
  { id: "mod-05", type: "Dispute",        subject: "Order #TXN-8818",      submittedBy: "Dev Kumar",    date: "Jan 12, 2025", priority: "high",   status: "Open",     note: "Customer claims product not delivered" },
  { id: "mod-06", type: "Store Suspend",  subject: "Dev's Dev Hub",        submittedBy: "System",       date: "Jan 11, 2025", priority: "low",    status: "Resolved", note: "Auto-suspended for policy violation" },
  { id: "mod-07", type: "Review Flag",    subject: "1-star review bomb",   submittedBy: "Kunal Bose",   date: "Jan 10, 2025", priority: "medium", status: "Resolved", note: "Coordinated negative review attack" },
];

// ── Platform Analytics ────────────────────────────────────────────────────────
export const platformRevenueByMonth = [
  { month: "Aug", gmv: 312000, fee: 24960,  creators: 890,  orders: 1840 },
  { month: "Sep", gmv: 378000, fee: 30240,  creators: 940,  orders: 2210 },
  { month: "Oct", gmv: 492000, fee: 39360,  creators: 1020, orders: 2890 },
  { month: "Nov", gmv: 441000, fee: 35280,  creators: 1090, orders: 2640 },
  { month: "Dec", gmv: 618000, fee: 49440,  creators: 1180, orders: 3610 },
  { month: "Jan", gmv: 724000, fee: 57920,  creators: 1284, orders: 4210 },
];

export const revenueByCategory = [
  { name: "Education",    revenue: 1840000, pct: 38 },
  { name: "Design",       revenue: 1210000, pct: 25 },
  { name: "Templates",    revenue: 730000,  pct: 15 },
  { name: "Productivity", revenue: 486000,  pct: 10 },
  { name: "Photography",  revenue: 340000,  pct: 7  },
  { name: "Other",        revenue: 214000,  pct: 5  },
];

export const platformTopCountries = [
  { country: "India",     users: 12840, orders: 14200, pct: 72 },
  { country: "USA",       users: 2140,  orders: 1890,  pct: 12 },
  { country: "UK",        users: 980,   orders: 840,   pct: 6  },
  { country: "Canada",    users: 620,   orders: 540,   pct: 4  },
  { country: "Australia", users: 480,   orders: 410,   pct: 3  },
];

// ── Platform Settings ─────────────────────────────────────────────────────────
export const platformSettings = {
  general:  { platformName: "Premium", domain: "premium.in", supportEmail: "support@premium.in", maintenanceMode: false, signupsOpen: true, requireKYC: true },
  fees:     { commissionPct: 8, paymentProcessingFee: 2, gstIncluded: true, minPayoutAmount: 1000, payoutCycleDays: 7 },
  features: { reviews: true, wishlists: true, coupons: true, affiliates: false, referralProgram: true, subscriptionProducts: false },
  security: { twoFactorRequired: false, sessionTimeoutMins: 60, ipWhitelist: false, auditLogs: true },
};
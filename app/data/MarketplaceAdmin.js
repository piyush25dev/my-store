// Admin Platform Data - For managing the entire marketplace

// All Creators on the platform
export const adminCreators = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    storeName: "Alex's Digital Studio",
    storeUrl: "alexs-digital-studio",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    status: "Active",
    verified: true,
    joinDate: "2023-11-15",
    totalProducts: 8,
    totalSales: 241500,
    totalOrders: 342,
    rating: 4.8,
    commission: 15,
    payoutPending: 18500,
    lastActive: "2024-02-15",
    category: "Digital Art"
  },
  {
    id: 2,
    name: "Sam Wilson",
    email: "sam.wilson@example.com",
    storeName: "Sam's Creator Hub",
    storeUrl: "sams-creator-hub",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
    status: "Active",
    verified: true,
    joinDate: "2023-09-22",
    totalProducts: 12,
    totalSales: 394101,
    totalOrders: 567,
    rating: 4.9,
    commission: 15,
    payoutPending: 25600,
    lastActive: "2024-02-16",
    category: "Courses"
  },
  {
    id: 3,
    name: "Taylor Martinez",
    email: "taylor.m@example.com",
    storeName: "Taylor's Design Shop",
    storeUrl: "taylors-design-shop",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
    status: "Suspended",
    verified: true,
    joinDate: "2024-02-28",
    totalProducts: 5,
    totalSales: 156789,
    totalOrders: 234,
    rating: 4.3,
    commission: 15,
    payoutPending: 0,
    lastActive: "2024-02-10",
    category: "Templates"
  },
  {
    id: 4,
    name: "Jordan Lee",
    email: "jordan.lee@example.com",
    storeName: "Jordan's Graphics Lab",
    storeUrl: "jordans-graphics-lab",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    status: "Pending",
    verified: false,
    joinDate: "2024-02-14",
    totalProducts: 3,
    totalSales: 0,
    totalOrders: 0,
    rating: 0,
    commission: 15,
    payoutPending: 0,
    lastActive: "2024-02-14",
    category: "Graphics"
  },
  {
    id: 5,
    name: "Chris Evans",
    email: "chris.evans@example.com",
    storeName: "Chris's Merch Store",
    storeUrl: "chris-merch-store",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris",
    status: "Active",
    verified: true,
    joinDate: "2023-12-05",
    totalProducts: 15,
    totalSales: 523400,
    totalOrders: 789,
    rating: 4.7,
    commission: 12,
    payoutPending: 42300,
    lastActive: "2024-02-16",
    category: "Merchandise"
  },
  {
    id: 6,
    name: "Emma Stone",
    email: "emma.stone@example.com",
    storeName: "Emma's Creative Space",
    storeUrl: "emmas-creative-space",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    status: "Active",
    verified: true,
    joinDate: "2023-08-18",
    totalProducts: 20,
    totalSales: 678900,
    totalOrders: 1023,
    rating: 4.9,
    commission: 10,
    payoutPending: 56700,
    lastActive: "2024-02-15",
    category: "Audio"
  }
];

// All Buyers/Customers on the platform
export const adminBuyers = [
  {
    id: 1,
    name: "Michael Brown",
    email: "michael.b@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    status: "Active",
    joinDate: "2024-01-10",
    totalPurchases: 6,
    totalSpent: 8994,
    lastPurchase: "2024-02-14",
    favoriteCategories: ["Templates", "Graphics"],
    location: "Mumbai, MH"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    status: "Active",
    joinDate: "2023-11-22",
    totalPurchases: 15,
    totalSpent: 23456,
    lastPurchase: "2024-02-15",
    favoriteCategories: ["Courses", "Audio"],
    location: "Delhi, DL"
  },
  {
    id: 3,
    name: "David Wilson",
    email: "david.w@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    status: "Inactive",
    joinDate: "2023-09-05",
    totalPurchases: 3,
    totalSpent: 2100,
    lastPurchase: "2023-12-20",
    favoriteCategories: ["Merchandise"],
    location: "Bangalore, KA"
  },
  {
    id: 4,
    name: "Lisa Anderson",
    email: "lisa.a@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    status: "Active",
    joinDate: "2024-01-28",
    totalPurchases: 12,
    totalSpent: 18900,
    lastPurchase: "2024-02-16",
    favoriteCategories: ["Templates", "Courses"],
    location: "Pune, MH"
  }
];

// All platform products
export const adminAllProducts = [
  {
    id: 1,
    name: "Premium Photography Presets",
    creator: "Alex Johnson",
    creatorId: 1,
    storeName: "Alex's Digital Studio",
    category: "Templates",
    type: "Digital",
    price: 899,
    sales: 421,
    revenue: 378279,
    status: "Active",
    approved: true,
    rating: 4.8,
    created: "2023-12-10",
    flagged: false
  },
  {
    id: 2,
    name: "Fitness Training Program",
    creator: "Sam Wilson",
    creatorId: 2,
    storeName: "Sam's Creator Hub",
    category: "Courses",
    type: "Digital",
    price: 2499,
    sales: 156,
    revenue: 389844,
    status: "Active",
    approved: true,
    rating: 4.9,
    created: "2023-11-15",
    flagged: false
  },
  {
    id: 3,
    name: "UI/UX Design Kit",
    creator: "Jordan Lee",
    creatorId: 4,
    storeName: "Jordan's Graphics Lab",
    category: "Graphics",
    type: "Digital",
    price: 1299,
    sales: 0,
    revenue: 0,
    status: "Review",
    approved: false,
    rating: 0,
    created: "2024-02-14",
    flagged: false
  },
  {
    id: 4,
    name: "Branded Hoodies Collection",
    creator: "Chris Evans",
    creatorId: 5,
    storeName: "Chris's Merch Store",
    category: "Merchandise",
    type: "Physical",
    price: 1899,
    sales: 234,
    revenue: 444366,
    status: "Active",
    approved: true,
    rating: 4.7,
    created: "2023-12-20",
    flagged: false
  },
  {
    id: 5,
    name: "Podcast Audio Essentials",
    creator: "Emma Stone",
    creatorId: 6,
    storeName: "Emma's Creative Space",
    category: "Audio",
    type: "Digital",
    price: 1599,
    sales: 312,
    revenue: 498888,
    status: "Active",
    approved: true,
    rating: 4.9,
    created: "2023-10-05",
    flagged: false
  },
  {
    id: 6,
    name: "Suspicious Product Listing",
    creator: "Taylor Martinez",
    creatorId: 3,
    storeName: "Taylor's Design Shop",
    category: "Templates",
    type: "Digital",
    price: 499,
    sales: 89,
    revenue: 44411,
    status: "Flagged",
    approved: false,
    rating: 3.2,
    created: "2024-02-05",
    flagged: true
  }
];

// All platform transactions
export const adminTransactions = [
  {
    id: "TXN-8934",
    type: "Sale",
    buyer: "Sarah Johnson",
    buyerId: 2,
    seller: "Sam Wilson",
    sellerId: 2,
    product: "Fitness Training Program",
    amount: 2499,
    platformFee: 375,
    sellerEarnings: 2124,
    date: "2024-02-16T10:30:00",
    status: "Completed",
    paymentMethod: "Credit Card"
  },
  {
    id: "TXN-8933",
    type: "Sale",
    buyer: "Lisa Anderson",
    buyerId: 4,
    seller: "Alex Johnson",
    sellerId: 1,
    product: "Premium Photography Presets",
    amount: 899,
    platformFee: 135,
    sellerEarnings: 764,
    date: "2024-02-16T09:15:00",
    status: "Completed",
    paymentMethod: "UPI"
  },
  {
    id: "TXN-8932",
    type: "Payout",
    buyer: null,
    buyerId: null,
    seller: "Emma Stone",
    sellerId: 6,
    product: null,
    amount: 56700,
    platformFee: 0,
    sellerEarnings: 56700,
    date: "2024-02-15T16:00:00",
    status: "Processing",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "TXN-8931",
    type: "Sale",
    buyer: "Michael Brown",
    buyerId: 1,
    seller: "Chris Evans",
    sellerId: 5,
    product: "Branded Hoodies Collection",
    amount: 1899,
    platformFee: 228,
    sellerEarnings: 1671,
    date: "2024-02-15T14:20:00",
    status: "Completed",
    paymentMethod: "Debit Card"
  },
  {
    id: "TXN-8930",
    type: "Refund",
    buyer: "David Wilson",
    buyerId: 3,
    seller: "Taylor Martinez",
    sellerId: 3,
    product: "Suspicious Product Listing",
    amount: 499,
    platformFee: -75,
    sellerEarnings: -424,
    date: "2024-02-15T11:00:00",
    status: "Completed",
    paymentMethod: "Credit Card"
  }
];

// Platform analytics data
export const platformAnalytics = {
  overview: {
    totalRevenue: 8214567,
    platformFees: 1232185,
    creatorEarnings: 6982382,
    totalTransactions: 12456,
    totalUsers: 1590,
    totalCreators: 248,
    totalBuyers: 1342,
    activeStores: 215,
    pendingApprovals: 42,
    flaggedContent: 8,
    supportTickets: 18
  },
  growth: {
    revenueGrowth: 18.3,
    userGrowth: 23.1,
    creatorGrowth: 15.7,
    transactionGrowth: 14.7
  },
  categoryBreakdown: [
    { category: "Courses", revenue: 2345678, percentage: 28.5, count: 234 },
    { category: "Merchandise", revenue: 1987654, percentage: 24.2, count: 456 },
    { category: "Templates", revenue: 1654321, percentage: 20.1, count: 789 },
    { category: "Graphics", revenue: 1234567, percentage: 15.0, count: 567 },
    { category: "Audio", revenue: 992347, percentage: 12.1, count: 345 }
  ],
  revenueByMonth: [
    { month: "Sep", revenue: 4567890, transactions: 8234 },
    { month: "Oct", revenue: 5234567, transactions: 9123 },
    { month: "Nov", revenue: 6123456, transactions: 10234 },
    { month: "Dec", revenue: 7012345, transactions: 11123 },
    { month: "Jan", revenue: 7654321, transactions: 11890 },
    { month: "Feb", revenue: 8214567, transactions: 12456 }
  ],
  topCreators: [
    { name: "Emma Stone", revenue: 678900, sales: 1023, commission: 67890 },
    { name: "Chris Evans", revenue: 523400, sales: 789, commission: 62808 },
    { name: "Sam Wilson", revenue: 394101, sales: 567, commission: 59115 },
    { name: "Alex Johnson", revenue: 241500, sales: 342, commission: 36225 },
    { name: "Taylor Martinez", revenue: 156789, sales: 234, commission: 23518 }
  ],
  userActivity: [
    { date: "2024-02-10", signups: 23, purchases: 145, revenue: 234567 },
    { date: "2024-02-11", signups: 19, purchases: 156, revenue: 267890 },
    { date: "2024-02-12", signups: 31, purchases: 178, revenue: 289012 },
    { date: "2024-02-13", signups: 27, purchases: 192, revenue: 312345 },
    { date: "2024-02-14", signups: 34, purchases: 203, revenue: 345678 },
    { date: "2024-02-15", signups: 29, purchases: 198, revenue: 328901 },
    { date: "2024-02-16", signups: 25, purchases: 187, revenue: 298765 }
  ]
};

// Pending approvals
export const pendingApprovals = [
  {
    id: 1,
    type: "Product",
    itemName: "UI/UX Design Kit",
    creator: "Jordan Lee",
    creatorId: 4,
    submittedDate: "2024-02-14",
    category: "Graphics",
    price: 1299,
    description: "Complete UI/UX design toolkit with 500+ components",
    status: "Pending Review"
  },
  {
    id: 2,
    type: "Creator",
    itemName: "Jordan Lee",
    creator: "Jordan Lee",
    creatorId: 4,
    submittedDate: "2024-02-14",
    category: "Graphics",
    price: null,
    description: "Application for creator account verification",
    status: "Pending Review"
  },
  {
    id: 3,
    type: "Payout",
    itemName: "Payout Request",
    creator: "Chris Evans",
    creatorId: 5,
    submittedDate: "2024-02-15",
    category: null,
    price: 42300,
    description: "Payout request for January earnings",
    status: "Pending Processing"
  }
];

// Support tickets
export const supportTickets = [
  {
    id: "TICK-7841",
    subject: "Payment not received",
    user: "Sarah Johnson",
    userId: 2,
    userType: "Buyer",
    priority: "High",
    status: "Open",
    category: "Payment",
    created: "2024-02-16T08:30:00",
    lastUpdated: "2024-02-16T08:30:00",
    assignedTo: "Support Team"
  },
  {
    id: "TICK-7840",
    subject: "Product approval delayed",
    user: "Jordan Lee",
    userId: 4,
    userType: "Creator",
    priority: "Medium",
    status: "In Progress",
    category: "Approval",
    created: "2024-02-15T14:20:00",
    lastUpdated: "2024-02-16T09:15:00",
    assignedTo: "Review Team"
  },
  {
    id: "TICK-7839",
    subject: "Account verification issue",
    user: "Michael Brown",
    userId: 1,
    userType: "Buyer",
    priority: "Low",
    status: "Resolved",
    category: "Account",
    created: "2024-02-14T11:00:00",
    lastUpdated: "2024-02-15T16:30:00",
    assignedTo: "Support Team"
  }
];

// Platform settings & configuration
export const platformSettings = {
  commissionRates: {
    default: 15,
    premium: 10,
    enterprise: 5
  },
  payoutSchedule: "Weekly",
  minPayoutAmount: 1000,
  refundPeriod: 14,
  approvalRequired: true,
  autoApproveVerifiedCreators: true
};

// System health metrics
export const systemHealth = {
  serverUptime: 99.9,
  activeSessions: 1248,
  apiResponseTime: 45,
  storageUsed: 67,
  bandwidthUsed: 234.5,
  databaseSize: 12.3,
  lastBackup: "2024-02-16T03:00:00",
  errors24h: 3,
  warnings24h: 12
};

// Recent platform activity
export const recentActivity = [
  {
    id: 1,
    type: "creator_joined",
    message: "New creator 'Jordan Lee' joined",
    timestamp: "2024-02-16T10:30:00",
    icon: "user-plus",
    user: "Jordan Lee"
  },
  {
    id: 2,
    type: "product_approved",
    message: "Product 'Fitness Training Program' approved",
    timestamp: "2024-02-16T09:15:00",
    icon: "check",
    user: "Sam Wilson"
  },
  {
    id: 3,
    type: "user_suspended",
    message: "User 'Taylor Martinez' suspended",
    timestamp: "2024-02-15T16:45:00",
    icon: "alert",
    user: "Taylor Martinez"
  },
  {
    id: 4,
    type: "platform_update",
    message: "Platform update v2.1 deployed",
    timestamp: "2024-02-15T14:00:00",
    icon: "update",
    user: "System"
  },
  {
    id: 5,
    type: "support_ticket",
    message: "New support ticket #7841 received",
    timestamp: "2024-02-16T08:30:00",
    icon: "ticket",
    user: "Sarah Johnson"
  },
  {
    id: 6,
    type: "payout_processed",
    message: "Payout of ₹56,700 processed for Emma Stone",
    timestamp: "2024-02-15T16:00:00",
    icon: "money",
    user: "Emma Stone"
  },
  {
    id: 7,
    type: "high_sales",
    message: "Chris Evans reached 500+ sales milestone",
    timestamp: "2024-02-15T12:30:00",
    icon: "trophy",
    user: "Chris Evans"
  }
];

// Store analytics
export const storeAnalytics = [
  {
    storeId: 1,
    storeName: "Alex's Digital Studio",
    creator: "Alex Johnson",
    totalProducts: 8,
    activeProducts: 8,
    totalSales: 241500,
    monthlyRevenue: 45600,
    orderCount: 342,
    rating: 4.8,
    status: "Active"
  },
  {
    storeId: 2,
    storeName: "Sam's Creator Hub",
    creator: "Sam Wilson",
    totalProducts: 12,
    activeProducts: 12,
    totalSales: 394101,
    monthlyRevenue: 67800,
    orderCount: 567,
    rating: 4.9,
    status: "Active"
  },
  {
    storeId: 3,
    storeName: "Taylor's Design Shop",
    creator: "Taylor Martinez",
    totalProducts: 5,
    activeProducts: 0,
    totalSales: 156789,
    monthlyRevenue: 0,
    orderCount: 234,
    rating: 4.3,
    status: "Suspended"
  }
];
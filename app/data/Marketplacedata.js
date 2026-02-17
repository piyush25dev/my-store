// Mock data for Creator Marketplace Dashboard

export const creatorProducts = [
  { 
    id: 1, 
    name: "Instagram Reels Template Pack", 
    type: "Digital", 
    price: 499, 
    inventory: "Unlimited", 
    status: "Active", 
    sales: 142, 
    revenue: 70858, 
    category: "Templates",
    description: "Professional Instagram Reels templates with 50+ unique designs",
    rating: 4.8,
    reviews: 89,
    created: "2024-01-15",
    lastUpdated: "2024-03-10"
  },
  { 
    id: 2, 
    name: "Premium Creator Hoodie", 
    type: "Physical", 
    price: 1899, 
    inventory: "45", 
    status: "Active", 
    sales: 89, 
    revenue: 169011, 
    category: "Merchandise",
    description: "High-quality branded hoodie with custom embroidery",
    rating: 4.9,
    reviews: 67,
    created: "2024-02-01",
    lastUpdated: "2024-03-12"
  },
  { 
    id: 3, 
    name: "YouTube Thumbnail Bundle", 
    type: "Digital", 
    price: 299, 
    inventory: "Unlimited", 
    status: "Active", 
    sales: 256, 
    revenue: 76544, 
    category: "Graphics",
    description: "Click-worthy thumbnail templates for YouTubers",
    rating: 4.7,
    reviews: 134,
    created: "2024-01-20",
    lastUpdated: "2024-03-08"
  },
  { 
    id: 4, 
    name: "Podcast Intro Sound Pack", 
    type: "Digital", 
    price: 699, 
    inventory: "Unlimited", 
    status: "Draft", 
    sales: 0, 
    revenue: 0, 
    category: "Audio",
    description: "Professional podcast intros and outros with royalty-free music",
    rating: 0,
    reviews: 0,
    created: "2024-03-14",
    lastUpdated: "2024-03-14"
  },
  { 
    id: 5, 
    name: "Limited Edition Stickers", 
    type: "Physical", 
    price: 249, 
    inventory: "0", 
    status: "Out", 
    sales: 312, 
    revenue: 77688, 
    category: "Merchandise",
    description: "Exclusive sticker pack with holographic finish",
    rating: 4.6,
    reviews: 178,
    created: "2024-01-10",
    lastUpdated: "2024-03-05"
  },
  { 
    id: 6, 
    name: "Social Media Planner", 
    type: "Digital", 
    price: 399, 
    inventory: "Unlimited", 
    status: "Active", 
    sales: 198, 
    revenue: 79002, 
    category: "Templates",
    description: "Complete content planning toolkit for creators",
    rating: 4.9,
    reviews: 112,
    created: "2024-02-05",
    lastUpdated: "2024-03-11"
  },
  { 
    id: 7, 
    name: "Creator Masterclass", 
    type: "Digital", 
    price: 2999, 
    inventory: "Unlimited", 
    status: "Active", 
    sales: 67, 
    revenue: 200933, 
    category: "Courses",
    description: "Complete course on building a creator business",
    rating: 5.0,
    reviews: 45,
    created: "2024-01-25",
    lastUpdated: "2024-03-13"
  },
  { 
    id: 8, 
    name: "Branded Phone Case", 
    type: "Physical", 
    price: 899, 
    inventory: "78", 
    status: "Active", 
    sales: 156, 
    revenue: 140244, 
    category: "Merchandise",
    description: "Premium phone cases with custom creator branding",
    rating: 4.5,
    reviews: 89,
    created: "2024-02-10",
    lastUpdated: "2024-03-09"
  },
  { 
    id: 9, 
    name: "Lightroom Presets Pack", 
    type: "Digital", 
    price: 599, 
    inventory: "Unlimited", 
    status: "Active", 
    sales: 289, 
    revenue: 173111, 
    category: "Graphics",
    description: "Professional photo editing presets for Instagram",
    rating: 4.8,
    reviews: 201,
    created: "2024-01-18",
    lastUpdated: "2024-03-07"
  },
  { 
    id: 10, 
    name: "Coffee Mug Set", 
    type: "Physical", 
    price: 699, 
    inventory: "23", 
    status: "Active", 
    sales: 134, 
    revenue: 93666, 
    category: "Merchandise",
    description: "Premium ceramic mugs with motivational quotes",
    rating: 4.7,
    reviews: 76,
    created: "2024-02-15",
    lastUpdated: "2024-03-06"
  },
  { 
    id: 11, 
    name: "Notion Templates Bundle", 
    type: "Digital", 
    price: 449, 
    inventory: "Unlimited", 
    status: "Active", 
    sales: 223, 
    revenue: 100127, 
    category: "Templates",
    description: "Productivity templates for content creators",
    rating: 4.9,
    reviews: 145,
    created: "2024-01-28",
    lastUpdated: "2024-03-10"
  },
  { 
    id: 12, 
    name: "Video Editing Course", 
    type: "Digital", 
    price: 3499, 
    inventory: "Unlimited", 
    status: "Draft", 
    sales: 0, 
    revenue: 0, 
    category: "Courses",
    description: "Advanced video editing techniques for creators",
    rating: 0,
    reviews: 0,
    created: "2024-03-12",
    lastUpdated: "2024-03-12"
  }
];

export const creatorOrders = [
  { 
    id: "ORD-7841", 
    customer: "Alex Johnson", 
    customerEmail: "alex.j@email.com",
    product: "Premium Creator Hoodie", 
    productId: 2,
    date: "2024-03-15", 
    amount: 1899, 
    status: "Delivered",
    paymentMethod: "Credit Card",
    shippingAddress: "123 Main St, Mumbai, MH 400001",
    trackingNumber: "TRK-9834756"
  },
  { 
    id: "ORD-7840", 
    customer: "Sam Wilson", 
    customerEmail: "sam.w@email.com",
    product: "Instagram Reels Template Pack", 
    productId: 1,
    date: "2024-03-14", 
    amount: 499, 
    status: "Processing",
    paymentMethod: "UPI",
    shippingAddress: "Digital Download",
    trackingNumber: null
  },
  { 
    id: "ORD-7839", 
    customer: "Taylor Swift", 
    customerEmail: "taylor.s@email.com",
    product: "YouTube Thumbnail Bundle", 
    productId: 3,
    date: "2024-03-14", 
    amount: 299, 
    status: "Shipped",
    paymentMethod: "Debit Card",
    shippingAddress: "Digital Download",
    trackingNumber: null
  },
  { 
    id: "ORD-7838", 
    customer: "Chris Evans", 
    customerEmail: "chris.e@email.com",
    product: "Lightroom Presets Pack", 
    productId: 9,
    date: "2024-03-13", 
    amount: 599, 
    status: "Delivered",
    paymentMethod: "UPI",
    shippingAddress: "Digital Download",
    trackingNumber: null
  },
  { 
    id: "ORD-7837", 
    customer: "Emma Stone", 
    customerEmail: "emma.s@email.com",
    product: "Branded Phone Case", 
    productId: 8,
    date: "2024-03-13", 
    amount: 899, 
    status: "Shipped",
    paymentMethod: "Credit Card",
    shippingAddress: "456 Park Ave, Delhi, DL 110001",
    trackingNumber: "TRK-9834755"
  },
  { 
    id: "ORD-7836", 
    customer: "Robert Downey", 
    customerEmail: "robert.d@email.com",
    product: "Creator Masterclass", 
    productId: 7,
    date: "2024-03-12", 
    amount: 2999, 
    status: "Delivered",
    paymentMethod: "Credit Card",
    shippingAddress: "Digital Download",
    trackingNumber: null
  },
  { 
    id: "ORD-7835", 
    customer: "Scarlett Johansson", 
    customerEmail: "scarlett.j@email.com",
    product: "Social Media Planner", 
    productId: 6,
    date: "2024-03-12", 
    amount: 399, 
    status: "Delivered",
    paymentMethod: "UPI",
    shippingAddress: "Digital Download",
    trackingNumber: null
  },
  { 
    id: "ORD-7834", 
    customer: "Tom Holland", 
    customerEmail: "tom.h@email.com",
    product: "Coffee Mug Set", 
    productId: 10,
    date: "2024-03-11", 
    amount: 699, 
    status: "Processing",
    paymentMethod: "Debit Card",
    shippingAddress: "789 Lake Rd, Bangalore, KA 560001",
    trackingNumber: "TRK-9834754"
  },
  { 
    id: "ORD-7833", 
    customer: "Zendaya Coleman", 
    customerEmail: "zendaya.c@email.com",
    product: "Notion Templates Bundle", 
    productId: 11,
    date: "2024-03-11", 
    amount: 449, 
    status: "Delivered",
    paymentMethod: "UPI",
    shippingAddress: "Digital Download",
    trackingNumber: null
  },
  { 
    id: "ORD-7832", 
    customer: "Benedict Cumberbatch", 
    customerEmail: "benedict.c@email.com",
    product: "Premium Creator Hoodie", 
    productId: 2,
    date: "2024-03-10", 
    amount: 1899, 
    status: "Delivered",
    paymentMethod: "Credit Card",
    shippingAddress: "321 Hill St, Pune, MH 411001",
    trackingNumber: "TRK-9834753"
  }
];

export const creatorStats = [
  { 
    title: "Total Revenue", 
    value: 394101, 
    change: "+12.5%", 
    changeValue: 12.5,
    color: "text-green-600",
    bgColor: "bg-green-600",
    trend: "up"
  },
  { 
    title: "Total Orders", 
    value: 799, 
    change: "+8.2%", 
    changeValue: 8.2,
    color: "text-blue-600",
    bgColor: "bg-blue-600",
    trend: "up"
  },
  { 
    title: "Products", 
    value: 12, 
    change: "+2", 
    changeValue: 2,
    color: "text-purple-600",
    bgColor: "bg-purple-600",
    trend: "up"
  },
  { 
    title: "Customers", 
    value: 642, 
    change: "+5.1%", 
    changeValue: 5.1,
    color: "text-orange-600",
    bgColor: "bg-orange-600",
    trend: "up"
  }
];

export const salesData = [
  { month: "Jan", revenue: 45678, orders: 89, customers: 67 },
  { month: "Feb", revenue: 91356, orders: 142, customers: 98 },
  { month: "Mar", revenue: 137034, orders: 198, customers: 145 },
  { month: "Apr", revenue: 182712, orders: 256, customers: 189 },
  { month: "May", revenue: 228390, orders: 312, customers: 234 },
  { month: "Jun", revenue: 274068, orders: 367, customers: 278 }
];

export const customerData = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.j@email.com",
    totalOrders: 12,
    totalSpent: 14589,
    joinDate: "2023-08-15",
    status: "VIP",
    location: "Mumbai, MH"
  },
  {
    id: 2,
    name: "Sam Wilson",
    email: "sam.w@email.com",
    totalOrders: 8,
    totalSpent: 8934,
    joinDate: "2023-10-22",
    status: "Active",
    location: "Delhi, DL"
  },
  {
    id: 3,
    name: "Taylor Swift",
    email: "taylor.s@email.com",
    totalOrders: 15,
    totalSpent: 18756,
    joinDate: "2023-07-10",
    status: "VIP",
    location: "Bangalore, KA"
  },
  {
    id: 4,
    name: "Chris Evans",
    email: "chris.e@email.com",
    totalOrders: 6,
    totalSpent: 5678,
    joinDate: "2023-11-05",
    status: "Active",
    location: "Pune, MH"
  },
  {
    id: 5,
    name: "Emma Stone",
    email: "emma.s@email.com",
    totalOrders: 10,
    totalSpent: 11234,
    joinDate: "2023-09-18",
    status: "Active",
    location: "Hyderabad, TG"
  }
];

export const analyticsData = {
  overview: {
    totalRevenue: 394101,
    totalOrders: 799,
    avgOrderValue: 493,
    conversionRate: 3.8,
    revenueGrowth: 12.5,
    orderGrowth: 8.2
  },
  topProducts: [
    { name: "Creator Masterclass", revenue: 200933, sales: 67 },
    { name: "Lightroom Presets Pack", revenue: 173111, sales: 289 },
    { name: "Premium Creator Hoodie", revenue: 169011, sales: 89 },
    { name: "Branded Phone Case", revenue: 140244, sales: 156 },
    { name: "Notion Templates Bundle", revenue: 100127, sales: 223 }
  ],
  categoryPerformance: [
    { category: "Courses", revenue: 200933, percentage: 51 },
    { category: "Graphics", revenue: 249655, percentage: 63 },
    { category: "Merchandise", revenue: 480609, percentage: 122 },
    { category: "Templates", revenue: 249987, percentage: 63 },
    { category: "Audio", revenue: 0, percentage: 0 }
  ],
  revenueByMonth: [
    { month: "Sep", revenue: 234567 },
    { month: "Oct", revenue: 289012 },
    { month: "Nov", revenue: 312456 },
    { month: "Dec", revenue: 356789 },
    { month: "Jan", revenue: 378901 },
    { month: "Feb", revenue: 394101 }
  ],
  trafficSources: [
    { source: "Instagram", visits: 12543, conversion: 4.2 },
    { source: "YouTube", visits: 8934, conversion: 3.8 },
    { source: "Twitter", visits: 6721, conversion: 2.9 },
    { source: "Direct", visits: 4532, conversion: 5.1 },
    { source: "Google", visits: 3421, conversion: 3.2 }
  ]
};

export const notificationData = [
  {
    id: 1,
    type: "order",
    title: "New Order Received",
    message: "Alex Johnson ordered Premium Creator Hoodie",
    time: "5 minutes ago",
    read: false
  },
  {
    id: 2,
    type: "review",
    title: "New 5-Star Review",
    message: "Your Lightroom Presets received a great review",
    time: "1 hour ago",
    read: false
  },
  {
    id: 3,
    type: "stock",
    title: "Low Stock Alert",
    message: "Coffee Mug Set inventory is running low",
    time: "3 hours ago",
    read: true
  },
  {
    id: 4,
    type: "payout",
    title: "Payout Processed",
    message: "₹45,678 has been transferred to your account",
    time: "1 day ago",
    read: true
  }
];
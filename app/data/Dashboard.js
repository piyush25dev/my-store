// ── Creator Stats ─────────────────────────────────────────────────────────────
export const creatorStats = [
  { label: "Revenue",    value: "₹3,42,000", icon: "IndianRupee",  trend: "+18.2%", trendUp: true,  color: "emerald" },
  { label: "Orders",     value: "612",        icon: "ShoppingCart", trend: "+45",    trendUp: true,  color: "blue"    },
  { label: "Products",   value: "14",         icon: "Package",      trend: "+2",     trendUp: true,  color: "purple"  },
  { label: "Conversion", value: "3.8%",       icon: "TrendingUp",   trend: "+0.5%",  trendUp: true,  color: "amber"   },
];

export const creatorOrders = [
  { id: "#1042", customer: "Riya Sharma",  product: "Signature Course", amount: 2499, status: "Completed",  date: "Jan 14, 2025", time: "2 hours ago" },
  { id: "#1041", customer: "Aman Verma",   product: "Notion Kit",       amount: 799,  status: "Processing", date: "Jan 14, 2025", time: "5 hours ago" },
  { id: "#1040", customer: "Priya Mehta",  product: "Design Bundle",    amount: 1299, status: "Completed",  date: "Jan 13, 2025", time: "1 day ago"   },
  { id: "#1039", customer: "Dev Kumar",    product: "Signature Course", amount: 2499, status: "Refunded",   date: "Jan 13, 2025", time: "1 day ago"   },
  { id: "#1038", customer: "Sneha Patil",  product: "Notion Kit",       amount: 799,  status: "Completed",  date: "Jan 12, 2025", time: "2 days ago"  },
  { id: "#1037", customer: "Arjun Nair",   product: "Design Bundle",    amount: 1299, status: "Processing", date: "Jan 12, 2025", time: "2 days ago"  },
  { id: "#1036", customer: "Kavya Rao",    product: "Signature Course", amount: 2499, status: "Completed",  date: "Jan 11, 2025", time: "3 days ago"  },
  { id: "#1035", customer: "Rahul Joshi",  product: "Productivity OS",  amount: 499,  status: "Completed",  date: "Jan 11, 2025", time: "3 days ago"  },
  { id: "#1034", customer: "Meera Bhat",   product: "Notion Kit",       amount: 799,  status: "Refunded",   date: "Jan 10, 2025", time: "4 days ago"  },
  { id: "#1033", customer: "Karan Singh",  product: "Design Bundle",    amount: 1299, status: "Completed",  date: "Jan 10, 2025", time: "4 days ago"  },
];

export const creatorProducts = [
  { id:"prod-1", name:"Signature Course",  type:"Digital Course",    price:2499, originalPrice:3499, sales:284, revenue:709716, status:"Active",   rating:4.9, reviews:87, image:"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=80&q=80", created:"Dec 2024", lastSale:"2 hours ago", views:4210, conversion:"6.7%" },
  { id:"prod-2", name:"Notion Kit",        type:"Template Pack",     price:799,  originalPrice:1199, sales:156, revenue:124644, status:"Sold Out", rating:4.7, reviews:42, image:"https://images.unsplash.com/photo-1555421689-d68471e189f2?w=80&q=80", created:"Nov 2024", lastSale:"3 days ago", views:2890, conversion:"5.4%" },
  { id:"prod-3", name:"Design Bundle",     type:"Asset Pack",        price:1299, originalPrice:null, sales:92,  revenue:119508, status:"Active",   rating:4.6, reviews:29, image:"https://images.unsplash.com/photo-1561070791-2526d30994b5?w=80&q=80", created:"Jan 2025", lastSale:"5 hours ago", views:1540, conversion:"5.9%" },
  { id:"prod-4", name:"Productivity OS",   type:"Notion Template",   price:499,  originalPrice:799,  sales:210, revenue:104790, status:"Active",   rating:4.8, reviews:63, image:"https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=80&q=80", created:"Oct 2024", lastSale:"1 hour ago",  views:3360, conversion:"6.2%" },
  { id:"prod-5", name:"Brand Starter Kit", type:"Template Pack",     price:1099, originalPrice:1499, sales:44,  revenue:48356,  status:"Draft",    rating:null,reviews:0,  image:"https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=80&q=80", created:"Jan 2025", lastSale:null,         views:210,  conversion:"—" },
];

export const revenueByMonth = [
  { month:"Aug", revenue:18400, orders:38 },
  { month:"Sep", revenue:22100, orders:47 },
  { month:"Oct", revenue:31500, orders:68 },
  { month:"Nov", revenue:28900, orders:61 },
  { month:"Dec", revenue:49200, orders:104 },
  { month:"Jan", revenue:57300, orders:118 },
];

export const revenueByProduct = [
  { name:"Signature Course", revenue:709716, pct:66 },
  { name:"Notion Kit",       revenue:124644, pct:12 },
  { name:"Design Bundle",    revenue:119508, pct:11 },
  { name:"Productivity OS",  revenue:104790, pct:10 },
  { name:"Brand Starter",    revenue:48356,  pct:4  },
];

export const topCountries = [
  { country:"India",     orders:412, pct:67 },
  { country:"USA",       orders:89,  pct:15 },
  { country:"UK",        orders:55,  pct:9  },
  { country:"Canada",    orders:34,  pct:6  },
  { country:"Australia", orders:22,  pct:4  },
];

export const creatorSettings = {
  profile:  { name:"Piyush Kumar", email:"piyush@studio.com", handle:"@piyushkumar", bio:"Educator & digital product creator. Teaching 5000+ students worldwide.", avatar:"NS" },
  store:    { storeName:"Piyush's Studio", currency:"INR", taxEnabled:true, instantDelivery:true, allowReviews:true },
  notifications: { orderAlerts:true, reviewAlerts:true, marketingEmails:false, weeklyReport:true, disputeAlerts:true },
  payout:   { method:"Bank Transfer", account:"••••3289", ifsc:"HDFC0001234", nextPayout:"Jan 20, 2025", pending:18420, totalPaid:323580 },
};
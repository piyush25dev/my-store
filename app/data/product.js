export const products = [
  {
    id: "notion-kit",
    name: "Notion Creator Kit",
    tagline: "A focused system for serious creators.",
    description:
      "A complete set of Notion templates and workflows designed to help creators plan, publish, and grow consistently.",
    price: 799,
    originalPrice: 999,
    currency: "INR",
    type: "Digital",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    inStock: true,

    variants: [
      { id: "personal", label: "Personal License" },
      { id: "commercial", label: "Commercial License" },
    ],

    highlights: [
      "Content planning dashboard",
      "Weekly & monthly publishing systems",
      "Creator growth tracker",
      "Lifetime updates",
    ],

    forWho: [
      "Content creators",
      "Freelancers",
      "Indie builders",
      "Personal brands",
    ],

    details: {
      format: "Notion templates",
      delivery: "Instant access after purchase",
      license: "Single user license",
      updates: "Lifetime updates included",
    },

    faqs: [
      {
        q: "Do I need Notion paid plan?",
        a: "No, this works with Notion free plan.",
      },
      {
        q: "Can I duplicate the templates?",
        a: "Yes, you can duplicate and customize everything.",
      },
    ],
    featured: true,
  },

  {
    id: "instagram-hooks-pack",
    name: "Instagram Hooks Pack",
    tagline: "Write scroll-stopping openings.",
    description:
      "A curated collection of high-converting hooks to increase engagement on Instagram and Reels.",
    price: 399,
    originalPrice: 599,
    currency: "INR",
    type: "Digital",
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113",
    inStock: true,

    variants: [{ id: "standard", label: "Standard Access" }],

    highlights: [
      "200+ proven hooks",
      "Categorized by niche",
      "Optimized for Reels & carousels",
      "Lifetime access",
    ],

    forWho: [
      "Instagram creators",
      "Social media managers",
      "Coaches",
    ],

    details: {
      format: "PDF + Notion database",
      delivery: "Instant download",
      license: "Single user license",
      updates: "Free future updates",
    },

    faqs: [
      {
        q: "Will this work for any niche?",
        a: "Yes, hooks are categorized across multiple niches.",
      },
    ],
  },

  {
    id: "creator-website-starter",
    name: "Creator Website Starter",
    tagline: "Launch your personal site in days.",
    description:
      "A minimal website starter designed for creators to showcase work, sell products, and collect leads.",
    price: 1299,
    originalPrice: 1799,
    currency: "INR",
    type: "Digital",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
    inStock: true,

    variants: [
      { id: "basic", label: "Basic" },
      { id: "pro", label: "Pro" },
    ],

    highlights: [
      "Minimal design system",
      "Responsive layouts",
      "SEO-ready structure",
      "Easy customization",
    ],

    forWho: [
      "Creators",
      "Freelancers",
      "Indie hackers",
    ],

    details: {
      format: "Next.js template",
      delivery: "GitHub access",
      license: "Single project license",
      updates: "1 year of updates",
    },

    faqs: [
      {
        q: "Do I need coding experience?",
        a: "Basic React knowledge is recommended.",
      },
    ],
  },

  {
    id: "creator-hoodie",
    name: "Creator Hoodie",
    tagline: "Built for long creative sessions.",
    description:
      "A premium, minimal hoodie designed for comfort during long creative hours.",
    price: 1499,
    originalPrice: null,
    currency: "INR",
    type: "Physical",
   image:
  "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=80",

    inStock: false,

    variants: [
      { id: "s", label: "Small" },
      { id: "m", label: "Medium" },
      { id: "l", label: "Large" },
    ],

    highlights: [
      "Premium cotton fabric",
      "Relaxed unisex fit",
      "Minimal branding",
      "All-season wear",
    ],

    forWho: [
      "Creators",
      "Designers",
      "Remote workers",
    ],

    details: {
      format: "Physical product",
      delivery: "Ships in 5–7 business days",
      license: "Personal use",
      updates: "Not applicable",
    },

    faqs: [
      {
        q: "Is this unisex?",
        a: "Yes, the hoodie has a relaxed unisex fit.",
      },
    ],
  },
];

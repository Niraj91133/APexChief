import { Category } from '@/types';

export const CATEGORIES: Category[] = [
  {
    name: "Interview",
    slug: "interview",
    description: "Exclusive executive dialogues, CEO strategies, founder retrospectives, and industry leadership Q&A.",
    layout: "world-layout",
    order: 1,
    isVisible: true,
    subcategories: [
      {
        name: "Executive Dialogues",
        slug: "executive-dialogues",
        description: "C-suite leaders, global founders, and boardroom conversations."
      },
      {
        name: "Founder Stories",
        slug: "founder-stories",
        description: "Early-stage building retrospectives, founder mindset, and execution."
      },
      {
        name: "Industry Q&A",
        slug: "industry-qa",
        description: "Specialized strategic analysis with sector pioneers."
      },
      {
        name: "Leadership Fireside",
        slug: "leadership-fireside",
        description: "Visionary perspectives and strategic business teardowns."
      }
    ]
  },
  {
    name: "Top - List",
    slug: "top-list",
    description: "Editorial rankings, power indexes, market leaderboards, and top 10 investigative selections.",
    layout: "world-layout",
    order: 2,
    isVisible: true,
    subcategories: [
      {
        name: "Top 10 Index",
        slug: "top-10-index",
        description: "Weekly ranked editorial stories, investigations, and deep-dives."
      },
      {
        name: "Power 100",
        slug: "power-100",
        description: "Most influential executives, founders, and policy leaders."
      },
      {
        name: "Industry Leaders",
        slug: "industry-leaders",
        description: "High-growth enterprise rankings across global sectors."
      },
      {
        name: "Best in Business",
        slug: "best-in-business",
        description: "Benchmark solutions, sovereign funds, and market winners."
      }
    ]
  },
  {
    name: "Leadership",
    slug: "leadership",
    description: "Executive strategy, C-suite decision frameworks, corporate governance, and leadership excellence.",
    layout: "culture-layout",
    order: 3,
    isVisible: true,
    subcategories: [
      {
        name: "CEOs & Founders",
        slug: "ceos-founders",
        description: "C-suite decision frameworks, corporate crisis management, and culture."
      },
      {
        name: "Executive Strategy",
        slug: "executive-strategy",
        description: "Fractional leadership models, CTO technical roadmaps, and COO playbooks."
      },
      {
        name: "Boardroom Insights",
        slug: "boardroom-insights",
        description: "Corporate governance, board transitions, and institutional stewardship."
      },
      {
        name: "Executive Profiles",
        slug: "profiles",
        description: "In-depth historical and contemporary biographies of industry pioneers."
      }
    ]
  },
  {
    name: "Technology",
    slug: "technology",
    description: "Frontier artificial intelligence, deep-tech hardware, quantum cryptography, cloud computing, and semiconductor engineering.",
    layout: "tech-layout",
    order: 4,
    isVisible: true,
    subcategories: [
      {
        name: "Artificial Intelligence",
        slug: "ai",
        description: "Frontier reasoning models, autonomous multi-agent networks, and neural chips."
      },
      {
        name: "Cloud & Infrastructure",
        slug: "cloud-infra",
        description: "Enterprise SaaS, cloud computing grids, and distributed edge infrastructure."
      },
      {
        name: "Cybersecurity",
        slug: "cybersecurity",
        description: "Zero-trust architectures, post-quantum encryption, and critical infra defense."
      },
      {
        name: "Innovation & DeepTech",
        slug: "innovation",
        description: "Quantum sensors, solid-state batteries, and photonics breakthroughs."
      }
    ]
  },
  {
    name: "Business",
    slug: "business",
    description: "Corporate strategy, global trade logistics, macroeconomic policies, enterprise deals, and M&A.",
    layout: "business-layout",
    order: 5,
    isVisible: true,
    subcategories: [
      {
        name: "Corporate Strategy",
        slug: "companies",
        description: "Enterprise earnings, corporate restructuring, and multinational strategy."
      },
      {
        name: "Global Economy",
        slug: "economy",
        description: "Central bank policies, inflation dynamics, global trade flows, and GDP metrics."
      },
      {
        name: "Supply Chain & Trade",
        slug: "trade",
        description: "Manufacturing supply chains, maritime shipping, and industrial logistics."
      },
      {
        name: "Finance & Banking",
        slug: "finance",
        description: "Corporate finance, private credit, capital deployment, and banking networks."
      }
    ]
  },
  {
    name: "News",
    slug: "news",
    description: "Breaking investigative reporting, real-time market wires, geopolitical developments, and policy regulation.",
    layout: "world-layout",
    order: 6,
    isVisible: true,
    subcategories: [
      {
        name: "Breaking Wire",
        slug: "breaking-wire",
        description: "Live developing stories and continuous news coverage across world markets."
      },
      {
        name: "Investigations",
        slug: "investigations",
        description: "In-depth investigative reports and investigative journalism."
      },
      {
        name: "Policy & Regulation",
        slug: "policy-law",
        description: "Antitrust enforcement, legal rulings, and international trade accords."
      },
      {
        name: "Global Affairs",
        slug: "global-affairs",
        description: "Diplomatic summits, sovereign treaties, and macroeconomic events."
      }
    ]
  },
  {
    name: "Real Estate",
    slug: "real-estate",
    description: "Commercial property, prime residential towers, sovereign infrastructure, REITs, and urban architecture.",
    layout: "business-layout",
    order: 7,
    isVisible: true,
    subcategories: [
      {
        name: "Commercial Property",
        slug: "commercial",
        description: "Grade-A office parks, logistics hubs, and institutional real estate."
      },
      {
        name: "Luxury Residential",
        slug: "luxury-living",
        description: "Prime architectural estates, luxury penthouses, and prime living."
      },
      {
        name: "Urban Architecture",
        slug: "urban-architecture",
        description: "Biophilic planning, timber skyscrapers, and sustainable smart cities."
      },
      {
        name: "REITs & Capital",
        slug: "reits-capital",
        description: "Real estate investment trusts, debt syndication, and sovereign assets."
      }
    ]
  },
  {
    name: "Startup",
    slug: "startup",
    description: "Venture capital deals, seed-to-scale playbooks, bootstrapped SaaS models, and disruptive tech founders.",
    layout: "tech-layout",
    order: 8,
    isVisible: true,
    subcategories: [
      {
        name: "Seed & Series A",
        slug: "seed-funding",
        description: "Pitch deck teardowns, early-stage capital, and term sheet mechanics."
      },
      {
        name: "Venture Capital",
        slug: "venture-capital",
        description: "Fund economics, LP allocations, and deep-tech sovereign venture funds."
      },
      {
        name: "Bootstrapping",
        slug: "bootstrapping",
        description: "Bootstrapped scaling to $10M ARR, lean micro-teams, and unit profitability."
      },
      {
        name: "Unicorns & Scaleups",
        slug: "scaleups",
        description: "Hypergrowth scaling, international expansion, and talent retention."
      }
    ]
  },
  {
    name: "Opinion",
    slug: "opinion",
    description: "Thought leadership, guest columnists, editorial perspectives, and strategic market critiques.",
    layout: "culture-layout",
    order: 9,
    isVisible: true,
    subcategories: [
      {
        name: "Guest Columns",
        slug: "guest-columns",
        description: "Perspectives from prominent founders, economists, and CEOs."
      },
      {
        name: "Editorial Board",
        slug: "editorial-board",
        description: "Institutional perspectives and critical commentary from ApexChief."
      },
      {
        name: "Market Perspectives",
        slug: "market-perspectives",
        description: "Analytical viewpoints on macroeconomic and geopolitical trends."
      },
      {
        name: "Policy Commentary",
        slug: "policy-commentary",
        description: "In-depth critiques of global regulatory policies and economic shifts."
      }
    ]
  },
  {
    name: "Health",
    slug: "health",
    description: "HealthTech, metabolic longevity, clinical biotechnology, wellness innovation, and pharmaceuticals.",
    layout: "health-layout",
    order: 10,
    isVisible: true,
    subcategories: [
      {
        name: "HealthTech & Bio",
        slug: "healthtech",
        description: "Metabolic longevity protocols, surgical robotics, and personalized mRNA."
      },
      {
        name: "Biotech & Pharma",
        slug: "biotech",
        description: "Clinical drug pipelines, gene therapies, and pharmaceutical innovation."
      },
      {
        name: "Wellness & Longevity",
        slug: "wellness",
        description: "Preventative healthcare, neurotech devices, and biological age testing."
      },
      {
        name: "Healthcare Systems",
        slug: "healthcare-systems",
        description: "Hospital networks, insurtech, and global medical supply chains."
      }
    ]
  },
  {
    name: "More",
    slug: "more",
    description: "Extended coverage across Retail & E-commerce, Luxury Hospitality, and Groceries & Food Supply.",
    layout: "lifestyle-layout",
    order: 11,
    isVisible: true,
    subcategories: [
      {
        name: "Retail",
        slug: "retail",
        description: "Omni-channel retail, direct-to-consumer luxury brands, and e-commerce technology."
      },
      {
        name: "Hospitality",
        slug: "hospitality",
        description: "Ultra-luxury resorts, hotel management, aviation, and global tourism."
      },
      {
        name: "Groceries",
        slug: "groceries",
        description: "Supermarket logistics, food supply chains, agri-tech, and sustainable distribution."
      }
    ]
  }
];

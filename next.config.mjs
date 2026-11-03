/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/market-analysis',
        destination: '/',
        permanent: true,
      },
      {
        source: '/market-analysis/:path*',
        destination: '/',
        permanent: true,
      },
      // 301 Redirection for category parameter queries to clean category paths
      {
        source: '/news',
        has: [
          {
            type: 'query',
            key: 'category',
            value: '(?<category>[^&]+)',
          },
        ],
        destination: '/category/:category',
        permanent: true,
      },
      {
        source: '/news',
        has: [
          {
            type: 'query',
            key: 'category',
          },
        ],
        destination: '/category',
        permanent: true,
      },
      // 301 Canonical Category Redirections (/news/[slug] -> /[category]/[slug])
      {
        source: '/news/automated-cold-chain-micro-fulfillment-groceries',
        destination: '/lifestyle/automated-cold-chain-micro-fulfillment-groceries',
        permanent: true,
      },
      {
        source: '/news/ultra-luxury-eco-resorts-sustainable-hospitality',
        destination: '/hospitality/ultra-luxury-eco-resorts-sustainable-hospitality',
        permanent: true,
      },
      {
        source: '/news/omnichannel-luxury-retail-spatial-computing',
        destination: '/retail/omnichannel-luxury-retail-spatial-computing',
        permanent: true,
      },
      {
        source: '/news/the-2026-clean-energy-breakthrough-changing-global-power',
        destination: '/business/the-2026-clean-energy-breakthrough-changing-global-power',
        permanent: true,
      },
      {
        source: '/news/enterprise-ai-reshapes-global-supply-chain-logistics',
        destination: '/business/enterprise-ai-reshapes-global-supply-chain-logistics',
        permanent: true,
      },
      {
        source: '/news/corporate-treasuries-diversify-into-green-infrastructure-bonds',
        destination: '/business/corporate-treasuries-diversify-into-green-infrastructure-bonds',
        permanent: true,
      },
      {
        source: '/news/uae-solidifies-global-leadership-in-ai-innovation-and-financial-technology',
        destination: '/business/uae-solidifies-global-leadership-in-ai-innovation-and-financial-technology',
        permanent: true,
      },
      {
        source: '/news/sovereign-wealth-funds-pivot-toward-deep-tech-and-semiconductor-fabrication',
        destination: '/real-estate/sovereign-wealth-funds-pivot-toward-deep-tech-and-semiconductor-fabrication',
        permanent: true,
      },
      {
        source: '/news/smart-city-urban-planning-and-the-rise-of-carbon-neutral-mixed-use-districts',
        destination: '/real-estate/smart-city-urban-planning-and-the-rise-of-carbon-neutral-mixed-use-districts',
        permanent: true,
      },
      {
        source: '/news/the-exponential-expansion-of-private-credit-in-mid-market-ma',
        destination: '/real-estate/the-exponential-expansion-of-private-credit-in-mid-market-ma',
        permanent: true,
      },
      {
        source: '/news/global-prime-residential-markets-thrive-on-cross-border-capital-mobility',
        destination: '/real-estate/global-prime-residential-markets-thrive-on-cross-border-capital-mobility',
        permanent: true,
      },
      {
        source: '/news/frontier-reasoning-models-and-autonomous-enterprise-agents',
        destination: '/technology/frontier-reasoning-models-and-autonomous-enterprise-agents',
        permanent: true,
      },
      {
        source: '/news/quantum-resistant-cryptography-and-the-race-to-protect-global-banking',
        destination: '/technology/quantum-resistant-cryptography-and-the-race-to-protect-global-banking',
        permanent: true,
      },
      {
        source: '/news/how-to-start-a-business-in-dubai-mainland-vs-free-zone',
        destination: '/business/how-to-start-a-business-in-dubai-mainland-vs-free-zone',
        permanent: true,
      },
      {
        source: '/news/the-cross-border-expansion-of-mena-fintech-and-logistics-scaleups',
        destination: '/startups/the-cross-border-expansion-of-mena-fintech-and-logistics-scaleups',
        permanent: true,
      },
      {
        source: '/news/the-rise-of-fractional-executives-in-modern-workforce',
        destination: '/leadership/the-rise-of-fractional-executives-in-modern-workforce',
        permanent: true,
      },
      {
        source: '/news/space-agencies-plan-joint-lunar-exploration-mission',
        destination: '/health/space-agencies-plan-joint-lunar-exploration-mission',
        permanent: true,
      },
      {
        source: '/news/cellular-rejuvenation-and-the-clinical-frontier-of-metabolic-longevity',
        destination: '/health/cellular-rejuvenation-and-the-clinical-frontier-of-metabolic-longevity',
        permanent: true,
      },
      {
        source: '/news/dubai-and-abu-dhabi-pioneer-sustainable-urban-mobility-and-aerial-taxis',
        destination: '/health/dubai-and-abu-dhabi-pioneer-sustainable-urban-mobility-and-aerial-taxis',
        permanent: true,
      },
      {
        source: '/news/private-aviation-sky-lounges-ultra-luxury-travel',
        destination: '/hospitality/private-aviation-sky-lounges-ultra-luxury-travel',
        permanent: true,
      },
      {
        source: '/news/top-10-sovereign-ai-compute-grids-powering-national-infrastructure',
        destination: '/top-list/top-10-sovereign-ai-compute-grids-powering-national-infrastructure',
        permanent: true,
      },
      {
        source: '/news/top-10-industrial-decarbonization-systems-securing-multi-billion-capital',
        destination: '/top-list/top-10-industrial-decarbonization-systems-securing-multi-billion-capital',
        permanent: true,
      },
      {
        source: '/news/top-10-cybersecurity-mesh-architectures-defending-enterprise-cloud-grids',
        destination: '/top-list/top-10-cybersecurity-mesh-architectures-defending-enterprise-cloud-grids',
        permanent: true,
      },
      {
        source: '/news/top-10-executive-leadership-frameworks-guiding-scaleup-founders-2026',
        destination: '/top-list/top-10-executive-leadership-frameworks-guiding-scaleup-founders-2026',
        permanent: true,
      },

      // 301 Redirections for deleted / updated blog posts
      {
        source: '/news/how-bootstrapped-b2b-saas-startups-are-reaching-10m-arr-with-lean-teams',
        destination: '/business/how-to-start-a-business-in-dubai-mainland-vs-free-zone',
        permanent: true,
      },
      {
        source: '/news/ai-business-trends-2026-the-growth-playbook',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/top-10-solid-state-high-density-battery-paradigms-commercial-scale',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/top-10-spatial-computing-autonomous-robotics-advanced-manufacturing',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/top-10-biophilic-mass-timber-commercial-skyscrapers-reshaping-skylines',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/why-ai-business-trends-2026-matters-more-than-ever-in-2026',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/why-modern-business-leadership-is-reimagining-the-playbook',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/programmatic-brand-storytelling-in-the-age-of-algorithmic-feeds',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/solid-state-electrolytes-and-the-next-generation-of-energy-density',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/bard-powerport-lawsuit-mdl-court-proceedings-and-patient-advocacy',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/interview-sarah-chen-on-building-ai-native-operating-systems',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/interview-tariq-al-mansoori-on-sovereign-ai-infrastructure',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/next-gen-semiconductor-clusters-powering-photonic-ai-training',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/biography-maya-lin-and-the-sculptural-geometry-of-memory',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/renewable-energy-generation-sets-global-milestone',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/neuromorphic-edge-computing-chips-bring-real-time-intelligence-to-robotics',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/marcus-graham-on-the-100-year-horizon-of-deep-tech-capital',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/interview-marcus-graham-on-the-100-year-horizon-of-deep-tech-capital',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/navigating-cross-border-compensation-in-global-remote-engineering',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/interview-venture-capitalist-marcus-graham-on-seed-stage-investing',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/interview-maya-lin-on-the-renaissance-of-sustainable-urban-design',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/why-indias-job-crisis-is-defying-its-economic-boom',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/top-10-autonomous-logistics-networks-operating-in-high-velocity-hubs',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/fallacy-of-pure-efficiency-strategic-resilience',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/boardroom-blindspot-geopolitical-cloud-opinion',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/computer-vision-autonomous-checkouts-urban-retail',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/biophilic-hideaways-regenerative-wellness-resorts',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/top-10-cross-border-b2b-liquidity-networks-disseminating-trade-capital',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/multimodal-ai-agents-corporate-hierarchy-opinion',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/dtc-pivot-heritage-luxury-brands-retail',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/top-10-frontier-innovations-2026',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/next-gen-quantum-processors-enter-commercial-production',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/the-anatomy-of-a-winning-seed-pitch-deck-in-the-modern-vc-climate',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/the-death-of-the-influencer-and-the-triumph-of-micro-community-evangelism',
        destination: '/',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'framerusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;

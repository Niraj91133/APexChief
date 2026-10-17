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
      // 301 Redirections for deleted blog posts
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

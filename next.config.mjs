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
      // 301 Canonical Blog Redirections (Old URLs -> New Clean Category URLs)
      {
        source: '/news/ultra-luxury-eco-resorts-sustainable-hospitality',
        destination: '/hospitality/ultra-luxury-eco-resorts-sustainable-hospitality',
        permanent: true,
      },
      {
        source: '/health/ultra-luxury-eco-resorts-sustainable-hospitality',
        destination: '/hospitality/ultra-luxury-eco-resorts-sustainable-hospitality',
        permanent: true,
      },
      {
        source: '/real-estate/ultra-luxury-eco-resorts-sustainable-hospitality',
        destination: '/hospitality/ultra-luxury-eco-resorts-sustainable-hospitality',
        permanent: true,
      },
      {
        source: '/lifestyle/ultra-luxury-eco-resorts-sustainable-hospitality',
        destination: '/hospitality/ultra-luxury-eco-resorts-sustainable-hospitality',
        permanent: true,
      },
      {
        source: '/retail/ultra-luxury-eco-resorts-sustainable-hospitality',
        destination: '/hospitality/ultra-luxury-eco-resorts-sustainable-hospitality',
        permanent: true,
      },
      {
        source: '/business/ultra-luxury-eco-resorts-sustainable-hospitality',
        destination: '/hospitality/ultra-luxury-eco-resorts-sustainable-hospitality',
        permanent: true,
      },
      {
        source: '/technology/ultra-luxury-eco-resorts-sustainable-hospitality',
        destination: '/hospitality/ultra-luxury-eco-resorts-sustainable-hospitality',
        permanent: true,
      },
      {
        source: '/leadership/ultra-luxury-eco-resorts-sustainable-hospitality',
        destination: '/hospitality/ultra-luxury-eco-resorts-sustainable-hospitality',
        permanent: true,
      },
      {
        source: '/top-list/ultra-luxury-eco-resorts-sustainable-hospitality',
        destination: '/hospitality/ultra-luxury-eco-resorts-sustainable-hospitality',
        permanent: true,
      },
      {
        source: '/startups/ultra-luxury-eco-resorts-sustainable-hospitality',
        destination: '/hospitality/ultra-luxury-eco-resorts-sustainable-hospitality',
        permanent: true,
      },
      {
        source: '/news/uae-solidifies-global-leadership-in-ai-innovation-and-financial-technology',
        destination: '/business/uae-ai-innovation-fintech-leadership',
        permanent: true,
      },
      {
        source: '/health/uae-solidifies-global-leadership-in-ai-innovation-and-financial-technology',
        destination: '/business/uae-ai-innovation-fintech-leadership',
        permanent: true,
      },
      {
        source: '/real-estate/uae-solidifies-global-leadership-in-ai-innovation-and-financial-technology',
        destination: '/business/uae-ai-innovation-fintech-leadership',
        permanent: true,
      },
      {
        source: '/lifestyle/uae-solidifies-global-leadership-in-ai-innovation-and-financial-technology',
        destination: '/business/uae-ai-innovation-fintech-leadership',
        permanent: true,
      },
      {
        source: '/hospitality/uae-solidifies-global-leadership-in-ai-innovation-and-financial-technology',
        destination: '/business/uae-ai-innovation-fintech-leadership',
        permanent: true,
      },
      {
        source: '/retail/uae-solidifies-global-leadership-in-ai-innovation-and-financial-technology',
        destination: '/business/uae-ai-innovation-fintech-leadership',
        permanent: true,
      },
      {
        source: '/business/uae-solidifies-global-leadership-in-ai-innovation-and-financial-technology',
        destination: '/business/uae-ai-innovation-fintech-leadership',
        permanent: true,
      },
      {
        source: '/technology/uae-solidifies-global-leadership-in-ai-innovation-and-financial-technology',
        destination: '/business/uae-ai-innovation-fintech-leadership',
        permanent: true,
      },
      {
        source: '/leadership/uae-solidifies-global-leadership-in-ai-innovation-and-financial-technology',
        destination: '/business/uae-ai-innovation-fintech-leadership',
        permanent: true,
      },
      {
        source: '/top-list/uae-solidifies-global-leadership-in-ai-innovation-and-financial-technology',
        destination: '/business/uae-ai-innovation-fintech-leadership',
        permanent: true,
      },
      {
        source: '/startups/uae-solidifies-global-leadership-in-ai-innovation-and-financial-technology',
        destination: '/business/uae-ai-innovation-fintech-leadership',
        permanent: true,
      },
      {
        source: '/news/sovereign-wealth-funds-pivot-toward-deep-tech-and-semiconductor-fabrication',
        destination: '/business/sovereign-wealth-funds-deep-tech-semiconductors',
        permanent: true,
      },
      {
        source: '/health/sovereign-wealth-funds-pivot-toward-deep-tech-and-semiconductor-fabrication',
        destination: '/business/sovereign-wealth-funds-deep-tech-semiconductors',
        permanent: true,
      },
      {
        source: '/real-estate/sovereign-wealth-funds-pivot-toward-deep-tech-and-semiconductor-fabrication',
        destination: '/business/sovereign-wealth-funds-deep-tech-semiconductors',
        permanent: true,
      },
      {
        source: '/lifestyle/sovereign-wealth-funds-pivot-toward-deep-tech-and-semiconductor-fabrication',
        destination: '/business/sovereign-wealth-funds-deep-tech-semiconductors',
        permanent: true,
      },
      {
        source: '/hospitality/sovereign-wealth-funds-pivot-toward-deep-tech-and-semiconductor-fabrication',
        destination: '/business/sovereign-wealth-funds-deep-tech-semiconductors',
        permanent: true,
      },
      {
        source: '/retail/sovereign-wealth-funds-pivot-toward-deep-tech-and-semiconductor-fabrication',
        destination: '/business/sovereign-wealth-funds-deep-tech-semiconductors',
        permanent: true,
      },
      {
        source: '/business/sovereign-wealth-funds-pivot-toward-deep-tech-and-semiconductor-fabrication',
        destination: '/business/sovereign-wealth-funds-deep-tech-semiconductors',
        permanent: true,
      },
      {
        source: '/technology/sovereign-wealth-funds-pivot-toward-deep-tech-and-semiconductor-fabrication',
        destination: '/business/sovereign-wealth-funds-deep-tech-semiconductors',
        permanent: true,
      },
      {
        source: '/leadership/sovereign-wealth-funds-pivot-toward-deep-tech-and-semiconductor-fabrication',
        destination: '/business/sovereign-wealth-funds-deep-tech-semiconductors',
        permanent: true,
      },
      {
        source: '/top-list/sovereign-wealth-funds-pivot-toward-deep-tech-and-semiconductor-fabrication',
        destination: '/business/sovereign-wealth-funds-deep-tech-semiconductors',
        permanent: true,
      },
      {
        source: '/startups/sovereign-wealth-funds-pivot-toward-deep-tech-and-semiconductor-fabrication',
        destination: '/business/sovereign-wealth-funds-deep-tech-semiconductors',
        permanent: true,
      },
      {
        source: '/news/dubai-and-abu-dhabi-pioneer-sustainable-urban-mobility-and-aerial-taxis',
        destination: '/technology/dubai-abu-dhabi-sustainable-urban-mobility-aerial-taxis',
        permanent: true,
      },
      {
        source: '/health/dubai-and-abu-dhabi-pioneer-sustainable-urban-mobility-and-aerial-taxis',
        destination: '/technology/dubai-abu-dhabi-sustainable-urban-mobility-aerial-taxis',
        permanent: true,
      },
      {
        source: '/real-estate/dubai-and-abu-dhabi-pioneer-sustainable-urban-mobility-and-aerial-taxis',
        destination: '/technology/dubai-abu-dhabi-sustainable-urban-mobility-aerial-taxis',
        permanent: true,
      },
      {
        source: '/lifestyle/dubai-and-abu-dhabi-pioneer-sustainable-urban-mobility-and-aerial-taxis',
        destination: '/technology/dubai-abu-dhabi-sustainable-urban-mobility-aerial-taxis',
        permanent: true,
      },
      {
        source: '/hospitality/dubai-and-abu-dhabi-pioneer-sustainable-urban-mobility-and-aerial-taxis',
        destination: '/technology/dubai-abu-dhabi-sustainable-urban-mobility-aerial-taxis',
        permanent: true,
      },
      {
        source: '/retail/dubai-and-abu-dhabi-pioneer-sustainable-urban-mobility-and-aerial-taxis',
        destination: '/technology/dubai-abu-dhabi-sustainable-urban-mobility-aerial-taxis',
        permanent: true,
      },
      {
        source: '/business/dubai-and-abu-dhabi-pioneer-sustainable-urban-mobility-and-aerial-taxis',
        destination: '/technology/dubai-abu-dhabi-sustainable-urban-mobility-aerial-taxis',
        permanent: true,
      },
      {
        source: '/technology/dubai-and-abu-dhabi-pioneer-sustainable-urban-mobility-and-aerial-taxis',
        destination: '/technology/dubai-abu-dhabi-sustainable-urban-mobility-aerial-taxis',
        permanent: true,
      },
      {
        source: '/leadership/dubai-and-abu-dhabi-pioneer-sustainable-urban-mobility-and-aerial-taxis',
        destination: '/technology/dubai-abu-dhabi-sustainable-urban-mobility-aerial-taxis',
        permanent: true,
      },
      {
        source: '/top-list/dubai-and-abu-dhabi-pioneer-sustainable-urban-mobility-and-aerial-taxis',
        destination: '/technology/dubai-abu-dhabi-sustainable-urban-mobility-aerial-taxis',
        permanent: true,
      },
      {
        source: '/startups/dubai-and-abu-dhabi-pioneer-sustainable-urban-mobility-and-aerial-taxis',
        destination: '/technology/dubai-abu-dhabi-sustainable-urban-mobility-aerial-taxis',
        permanent: true,
      },
      {
        source: '/news/the-cross-border-expansion-of-mena-fintech-and-logistics-scaleups',
        destination: '/startups/mena-fintech-logistics-scaleups-expansion',
        permanent: true,
      },
      {
        source: '/health/the-cross-border-expansion-of-mena-fintech-and-logistics-scaleups',
        destination: '/startups/mena-fintech-logistics-scaleups-expansion',
        permanent: true,
      },
      {
        source: '/real-estate/the-cross-border-expansion-of-mena-fintech-and-logistics-scaleups',
        destination: '/startups/mena-fintech-logistics-scaleups-expansion',
        permanent: true,
      },
      {
        source: '/lifestyle/the-cross-border-expansion-of-mena-fintech-and-logistics-scaleups',
        destination: '/startups/mena-fintech-logistics-scaleups-expansion',
        permanent: true,
      },
      {
        source: '/hospitality/the-cross-border-expansion-of-mena-fintech-and-logistics-scaleups',
        destination: '/startups/mena-fintech-logistics-scaleups-expansion',
        permanent: true,
      },
      {
        source: '/retail/the-cross-border-expansion-of-mena-fintech-and-logistics-scaleups',
        destination: '/startups/mena-fintech-logistics-scaleups-expansion',
        permanent: true,
      },
      {
        source: '/business/the-cross-border-expansion-of-mena-fintech-and-logistics-scaleups',
        destination: '/startups/mena-fintech-logistics-scaleups-expansion',
        permanent: true,
      },
      {
        source: '/technology/the-cross-border-expansion-of-mena-fintech-and-logistics-scaleups',
        destination: '/startups/mena-fintech-logistics-scaleups-expansion',
        permanent: true,
      },
      {
        source: '/leadership/the-cross-border-expansion-of-mena-fintech-and-logistics-scaleups',
        destination: '/startups/mena-fintech-logistics-scaleups-expansion',
        permanent: true,
      },
      {
        source: '/top-list/the-cross-border-expansion-of-mena-fintech-and-logistics-scaleups',
        destination: '/startups/mena-fintech-logistics-scaleups-expansion',
        permanent: true,
      },
      {
        source: '/startups/the-cross-border-expansion-of-mena-fintech-and-logistics-scaleups',
        destination: '/startups/mena-fintech-logistics-scaleups-expansion',
        permanent: true,
      },
      {
        source: '/news/top-10-sovereign-ai-compute-grids-powering-national-infrastructure',
        destination: '/top-list/top-ai-companies-in-the-uae',
        permanent: true,
      },
      {
        source: '/health/top-10-sovereign-ai-compute-grids-powering-national-infrastructure',
        destination: '/top-list/top-ai-companies-in-the-uae',
        permanent: true,
      },
      {
        source: '/real-estate/top-10-sovereign-ai-compute-grids-powering-national-infrastructure',
        destination: '/top-list/top-ai-companies-in-the-uae',
        permanent: true,
      },
      {
        source: '/lifestyle/top-10-sovereign-ai-compute-grids-powering-national-infrastructure',
        destination: '/top-list/top-ai-companies-in-the-uae',
        permanent: true,
      },
      {
        source: '/hospitality/top-10-sovereign-ai-compute-grids-powering-national-infrastructure',
        destination: '/top-list/top-ai-companies-in-the-uae',
        permanent: true,
      },
      {
        source: '/retail/top-10-sovereign-ai-compute-grids-powering-national-infrastructure',
        destination: '/top-list/top-ai-companies-in-the-uae',
        permanent: true,
      },
      {
        source: '/business/top-10-sovereign-ai-compute-grids-powering-national-infrastructure',
        destination: '/top-list/top-ai-companies-in-the-uae',
        permanent: true,
      },
      {
        source: '/technology/top-10-sovereign-ai-compute-grids-powering-national-infrastructure',
        destination: '/top-list/top-ai-companies-in-the-uae',
        permanent: true,
      },
      {
        source: '/leadership/top-10-sovereign-ai-compute-grids-powering-national-infrastructure',
        destination: '/top-list/top-ai-companies-in-the-uae',
        permanent: true,
      },
      {
        source: '/top-list/top-10-sovereign-ai-compute-grids-powering-national-infrastructure',
        destination: '/top-list/top-ai-companies-in-the-uae',
        permanent: true,
      },
      {
        source: '/startups/top-10-sovereign-ai-compute-grids-powering-national-infrastructure',
        destination: '/top-list/top-ai-companies-in-the-uae',
        permanent: true,
      },
      {
        source: '/news/top-10-executive-leadership-frameworks-guiding-scaleup-founders-2026',
        destination: '/leadership/leadership-in-the-uae-multicultural-teams',
        permanent: true,
      },
      {
        source: '/health/top-10-executive-leadership-frameworks-guiding-scaleup-founders-2026',
        destination: '/leadership/leadership-in-the-uae-multicultural-teams',
        permanent: true,
      },
      {
        source: '/real-estate/top-10-executive-leadership-frameworks-guiding-scaleup-founders-2026',
        destination: '/leadership/leadership-in-the-uae-multicultural-teams',
        permanent: true,
      },
      {
        source: '/lifestyle/top-10-executive-leadership-frameworks-guiding-scaleup-founders-2026',
        destination: '/leadership/leadership-in-the-uae-multicultural-teams',
        permanent: true,
      },
      {
        source: '/hospitality/top-10-executive-leadership-frameworks-guiding-scaleup-founders-2026',
        destination: '/leadership/leadership-in-the-uae-multicultural-teams',
        permanent: true,
      },
      {
        source: '/retail/top-10-executive-leadership-frameworks-guiding-scaleup-founders-2026',
        destination: '/leadership/leadership-in-the-uae-multicultural-teams',
        permanent: true,
      },
      {
        source: '/business/top-10-executive-leadership-frameworks-guiding-scaleup-founders-2026',
        destination: '/leadership/leadership-in-the-uae-multicultural-teams',
        permanent: true,
      },
      {
        source: '/technology/top-10-executive-leadership-frameworks-guiding-scaleup-founders-2026',
        destination: '/leadership/leadership-in-the-uae-multicultural-teams',
        permanent: true,
      },
      {
        source: '/leadership/top-10-executive-leadership-frameworks-guiding-scaleup-founders-2026',
        destination: '/leadership/leadership-in-the-uae-multicultural-teams',
        permanent: true,
      },
      {
        source: '/top-list/top-10-executive-leadership-frameworks-guiding-scaleup-founders-2026',
        destination: '/leadership/leadership-in-the-uae-multicultural-teams',
        permanent: true,
      },
      {
        source: '/startups/top-10-executive-leadership-frameworks-guiding-scaleup-founders-2026',
        destination: '/leadership/leadership-in-the-uae-multicultural-teams',
        permanent: true,
      },
      {
        source: '/news/frontier-reasoning-models-and-autonomous-enterprise-agents',
        destination: '/technology/uae-national-ai-strategy-explained',
        permanent: true,
      },
      {
        source: '/health/frontier-reasoning-models-and-autonomous-enterprise-agents',
        destination: '/technology/uae-national-ai-strategy-explained',
        permanent: true,
      },
      {
        source: '/real-estate/frontier-reasoning-models-and-autonomous-enterprise-agents',
        destination: '/technology/uae-national-ai-strategy-explained',
        permanent: true,
      },
      {
        source: '/lifestyle/frontier-reasoning-models-and-autonomous-enterprise-agents',
        destination: '/technology/uae-national-ai-strategy-explained',
        permanent: true,
      },
      {
        source: '/hospitality/frontier-reasoning-models-and-autonomous-enterprise-agents',
        destination: '/technology/uae-national-ai-strategy-explained',
        permanent: true,
      },
      {
        source: '/retail/frontier-reasoning-models-and-autonomous-enterprise-agents',
        destination: '/technology/uae-national-ai-strategy-explained',
        permanent: true,
      },
      {
        source: '/business/frontier-reasoning-models-and-autonomous-enterprise-agents',
        destination: '/technology/uae-national-ai-strategy-explained',
        permanent: true,
      },
      {
        source: '/technology/frontier-reasoning-models-and-autonomous-enterprise-agents',
        destination: '/technology/uae-national-ai-strategy-explained',
        permanent: true,
      },
      {
        source: '/leadership/frontier-reasoning-models-and-autonomous-enterprise-agents',
        destination: '/technology/uae-national-ai-strategy-explained',
        permanent: true,
      },
      {
        source: '/top-list/frontier-reasoning-models-and-autonomous-enterprise-agents',
        destination: '/technology/uae-national-ai-strategy-explained',
        permanent: true,
      },
      {
        source: '/startups/frontier-reasoning-models-and-autonomous-enterprise-agents',
        destination: '/technology/uae-national-ai-strategy-explained',
        permanent: true,
      },
      {
        source: '/news/how-bootstrapped-b2b-saas-startups-are-reaching-10m-arr-with-lean-teams',
        destination: '/startups/how-to-start-a-business-in-dubai-mainland-vs-free-zone',
        permanent: true,
      },
      {
        source: '/health/how-bootstrapped-b2b-saas-startups-are-reaching-10m-arr-with-lean-teams',
        destination: '/startups/how-to-start-a-business-in-dubai-mainland-vs-free-zone',
        permanent: true,
      },
      {
        source: '/real-estate/how-bootstrapped-b2b-saas-startups-are-reaching-10m-arr-with-lean-teams',
        destination: '/startups/how-to-start-a-business-in-dubai-mainland-vs-free-zone',
        permanent: true,
      },
      {
        source: '/lifestyle/how-bootstrapped-b2b-saas-startups-are-reaching-10m-arr-with-lean-teams',
        destination: '/startups/how-to-start-a-business-in-dubai-mainland-vs-free-zone',
        permanent: true,
      },
      {
        source: '/hospitality/how-bootstrapped-b2b-saas-startups-are-reaching-10m-arr-with-lean-teams',
        destination: '/startups/how-to-start-a-business-in-dubai-mainland-vs-free-zone',
        permanent: true,
      },
      {
        source: '/retail/how-bootstrapped-b2b-saas-startups-are-reaching-10m-arr-with-lean-teams',
        destination: '/startups/how-to-start-a-business-in-dubai-mainland-vs-free-zone',
        permanent: true,
      },
      {
        source: '/business/how-bootstrapped-b2b-saas-startups-are-reaching-10m-arr-with-lean-teams',
        destination: '/startups/how-to-start-a-business-in-dubai-mainland-vs-free-zone',
        permanent: true,
      },
      {
        source: '/technology/how-bootstrapped-b2b-saas-startups-are-reaching-10m-arr-with-lean-teams',
        destination: '/startups/how-to-start-a-business-in-dubai-mainland-vs-free-zone',
        permanent: true,
      },
      {
        source: '/leadership/how-bootstrapped-b2b-saas-startups-are-reaching-10m-arr-with-lean-teams',
        destination: '/startups/how-to-start-a-business-in-dubai-mainland-vs-free-zone',
        permanent: true,
      },
      {
        source: '/top-list/how-bootstrapped-b2b-saas-startups-are-reaching-10m-arr-with-lean-teams',
        destination: '/startups/how-to-start-a-business-in-dubai-mainland-vs-free-zone',
        permanent: true,
      },
      {
        source: '/startups/how-bootstrapped-b2b-saas-startups-are-reaching-10m-arr-with-lean-teams',
        destination: '/startups/how-to-start-a-business-in-dubai-mainland-vs-free-zone',
        permanent: true,
      },
      {
        source: '/news/global-prime-residential-markets-thrive-on-cross-border-capital-mobility',
        destination: '/business/family-offices-in-dubai-abu-dhabi-wealth-migration',
        permanent: true,
      },
      {
        source: '/health/global-prime-residential-markets-thrive-on-cross-border-capital-mobility',
        destination: '/business/family-offices-in-dubai-abu-dhabi-wealth-migration',
        permanent: true,
      },
      {
        source: '/real-estate/global-prime-residential-markets-thrive-on-cross-border-capital-mobility',
        destination: '/business/family-offices-in-dubai-abu-dhabi-wealth-migration',
        permanent: true,
      },
      {
        source: '/lifestyle/global-prime-residential-markets-thrive-on-cross-border-capital-mobility',
        destination: '/business/family-offices-in-dubai-abu-dhabi-wealth-migration',
        permanent: true,
      },
      {
        source: '/hospitality/global-prime-residential-markets-thrive-on-cross-border-capital-mobility',
        destination: '/business/family-offices-in-dubai-abu-dhabi-wealth-migration',
        permanent: true,
      },
      {
        source: '/retail/global-prime-residential-markets-thrive-on-cross-border-capital-mobility',
        destination: '/business/family-offices-in-dubai-abu-dhabi-wealth-migration',
        permanent: true,
      },
      {
        source: '/business/global-prime-residential-markets-thrive-on-cross-border-capital-mobility',
        destination: '/business/family-offices-in-dubai-abu-dhabi-wealth-migration',
        permanent: true,
      },
      {
        source: '/technology/global-prime-residential-markets-thrive-on-cross-border-capital-mobility',
        destination: '/business/family-offices-in-dubai-abu-dhabi-wealth-migration',
        permanent: true,
      },
      {
        source: '/leadership/global-prime-residential-markets-thrive-on-cross-border-capital-mobility',
        destination: '/business/family-offices-in-dubai-abu-dhabi-wealth-migration',
        permanent: true,
      },
      {
        source: '/top-list/global-prime-residential-markets-thrive-on-cross-border-capital-mobility',
        destination: '/business/family-offices-in-dubai-abu-dhabi-wealth-migration',
        permanent: true,
      },
      {
        source: '/startups/global-prime-residential-markets-thrive-on-cross-border-capital-mobility',
        destination: '/business/family-offices-in-dubai-abu-dhabi-wealth-migration',
        permanent: true,
      },
      {
        source: '/news/the-exponential-expansion-of-private-credit-in-mid-market-ma',
        destination: '/business/difc-vs-adgm-financial-centre-comparison',
        permanent: true,
      },
      {
        source: '/health/the-exponential-expansion-of-private-credit-in-mid-market-ma',
        destination: '/business/difc-vs-adgm-financial-centre-comparison',
        permanent: true,
      },
      {
        source: '/real-estate/the-exponential-expansion-of-private-credit-in-mid-market-ma',
        destination: '/business/difc-vs-adgm-financial-centre-comparison',
        permanent: true,
      },
      {
        source: '/lifestyle/the-exponential-expansion-of-private-credit-in-mid-market-ma',
        destination: '/business/difc-vs-adgm-financial-centre-comparison',
        permanent: true,
      },
      {
        source: '/hospitality/the-exponential-expansion-of-private-credit-in-mid-market-ma',
        destination: '/business/difc-vs-adgm-financial-centre-comparison',
        permanent: true,
      },
      {
        source: '/retail/the-exponential-expansion-of-private-credit-in-mid-market-ma',
        destination: '/business/difc-vs-adgm-financial-centre-comparison',
        permanent: true,
      },
      {
        source: '/business/the-exponential-expansion-of-private-credit-in-mid-market-ma',
        destination: '/business/difc-vs-adgm-financial-centre-comparison',
        permanent: true,
      },
      {
        source: '/technology/the-exponential-expansion-of-private-credit-in-mid-market-ma',
        destination: '/business/difc-vs-adgm-financial-centre-comparison',
        permanent: true,
      },
      {
        source: '/leadership/the-exponential-expansion-of-private-credit-in-mid-market-ma',
        destination: '/business/difc-vs-adgm-financial-centre-comparison',
        permanent: true,
      },
      {
        source: '/top-list/the-exponential-expansion-of-private-credit-in-mid-market-ma',
        destination: '/business/difc-vs-adgm-financial-centre-comparison',
        permanent: true,
      },
      {
        source: '/startups/the-exponential-expansion-of-private-credit-in-mid-market-ma',
        destination: '/business/difc-vs-adgm-financial-centre-comparison',
        permanent: true,
      },
      {
        source: '/news/the-rise-of-fractional-executives-in-modern-workforce',
        destination: '/leadership/emiratisation-rules-private-companies-guide',
        permanent: true,
      },
      {
        source: '/health/the-rise-of-fractional-executives-in-modern-workforce',
        destination: '/leadership/emiratisation-rules-private-companies-guide',
        permanent: true,
      },
      {
        source: '/real-estate/the-rise-of-fractional-executives-in-modern-workforce',
        destination: '/leadership/emiratisation-rules-private-companies-guide',
        permanent: true,
      },
      {
        source: '/lifestyle/the-rise-of-fractional-executives-in-modern-workforce',
        destination: '/leadership/emiratisation-rules-private-companies-guide',
        permanent: true,
      },
      {
        source: '/hospitality/the-rise-of-fractional-executives-in-modern-workforce',
        destination: '/leadership/emiratisation-rules-private-companies-guide',
        permanent: true,
      },
      {
        source: '/retail/the-rise-of-fractional-executives-in-modern-workforce',
        destination: '/leadership/emiratisation-rules-private-companies-guide',
        permanent: true,
      },
      {
        source: '/business/the-rise-of-fractional-executives-in-modern-workforce',
        destination: '/leadership/emiratisation-rules-private-companies-guide',
        permanent: true,
      },
      {
        source: '/technology/the-rise-of-fractional-executives-in-modern-workforce',
        destination: '/leadership/emiratisation-rules-private-companies-guide',
        permanent: true,
      },
      {
        source: '/leadership/the-rise-of-fractional-executives-in-modern-workforce',
        destination: '/leadership/emiratisation-rules-private-companies-guide',
        permanent: true,
      },
      {
        source: '/top-list/the-rise-of-fractional-executives-in-modern-workforce',
        destination: '/leadership/emiratisation-rules-private-companies-guide',
        permanent: true,
      },
      {
        source: '/startups/the-rise-of-fractional-executives-in-modern-workforce',
        destination: '/leadership/emiratisation-rules-private-companies-guide',
        permanent: true,
      },
      {
        source: '/news/quantum-resistant-cryptography-and-the-race-to-protect-global-banking',
        destination: '/technology/cybersecurity-in-the-uae-threats-and-regulations',
        permanent: true,
      },
      {
        source: '/health/quantum-resistant-cryptography-and-the-race-to-protect-global-banking',
        destination: '/technology/cybersecurity-in-the-uae-threats-and-regulations',
        permanent: true,
      },
      {
        source: '/real-estate/quantum-resistant-cryptography-and-the-race-to-protect-global-banking',
        destination: '/technology/cybersecurity-in-the-uae-threats-and-regulations',
        permanent: true,
      },
      {
        source: '/lifestyle/quantum-resistant-cryptography-and-the-race-to-protect-global-banking',
        destination: '/technology/cybersecurity-in-the-uae-threats-and-regulations',
        permanent: true,
      },
      {
        source: '/hospitality/quantum-resistant-cryptography-and-the-race-to-protect-global-banking',
        destination: '/technology/cybersecurity-in-the-uae-threats-and-regulations',
        permanent: true,
      },
      {
        source: '/retail/quantum-resistant-cryptography-and-the-race-to-protect-global-banking',
        destination: '/technology/cybersecurity-in-the-uae-threats-and-regulations',
        permanent: true,
      },
      {
        source: '/business/quantum-resistant-cryptography-and-the-race-to-protect-global-banking',
        destination: '/technology/cybersecurity-in-the-uae-threats-and-regulations',
        permanent: true,
      },
      {
        source: '/technology/quantum-resistant-cryptography-and-the-race-to-protect-global-banking',
        destination: '/technology/cybersecurity-in-the-uae-threats-and-regulations',
        permanent: true,
      },
      {
        source: '/leadership/quantum-resistant-cryptography-and-the-race-to-protect-global-banking',
        destination: '/technology/cybersecurity-in-the-uae-threats-and-regulations',
        permanent: true,
      },
      {
        source: '/top-list/quantum-resistant-cryptography-and-the-race-to-protect-global-banking',
        destination: '/technology/cybersecurity-in-the-uae-threats-and-regulations',
        permanent: true,
      },
      {
        source: '/startups/quantum-resistant-cryptography-and-the-race-to-protect-global-banking',
        destination: '/technology/cybersecurity-in-the-uae-threats-and-regulations',
        permanent: true,
      },
      {
        source: '/news/smart-city-urban-planning-and-the-rise-of-carbon-neutral-mixed-use-districts',
        destination: '/real-estate/dubai-vs-abu-dhabi-property-investment-guide',
        permanent: true,
      },
      {
        source: '/health/smart-city-urban-planning-and-the-rise-of-carbon-neutral-mixed-use-districts',
        destination: '/real-estate/dubai-vs-abu-dhabi-property-investment-guide',
        permanent: true,
      },
      {
        source: '/real-estate/smart-city-urban-planning-and-the-rise-of-carbon-neutral-mixed-use-districts',
        destination: '/real-estate/dubai-vs-abu-dhabi-property-investment-guide',
        permanent: true,
      },
      {
        source: '/lifestyle/smart-city-urban-planning-and-the-rise-of-carbon-neutral-mixed-use-districts',
        destination: '/real-estate/dubai-vs-abu-dhabi-property-investment-guide',
        permanent: true,
      },
      {
        source: '/hospitality/smart-city-urban-planning-and-the-rise-of-carbon-neutral-mixed-use-districts',
        destination: '/real-estate/dubai-vs-abu-dhabi-property-investment-guide',
        permanent: true,
      },
      {
        source: '/retail/smart-city-urban-planning-and-the-rise-of-carbon-neutral-mixed-use-districts',
        destination: '/real-estate/dubai-vs-abu-dhabi-property-investment-guide',
        permanent: true,
      },
      {
        source: '/business/smart-city-urban-planning-and-the-rise-of-carbon-neutral-mixed-use-districts',
        destination: '/real-estate/dubai-vs-abu-dhabi-property-investment-guide',
        permanent: true,
      },
      {
        source: '/technology/smart-city-urban-planning-and-the-rise-of-carbon-neutral-mixed-use-districts',
        destination: '/real-estate/dubai-vs-abu-dhabi-property-investment-guide',
        permanent: true,
      },
      {
        source: '/leadership/smart-city-urban-planning-and-the-rise-of-carbon-neutral-mixed-use-districts',
        destination: '/real-estate/dubai-vs-abu-dhabi-property-investment-guide',
        permanent: true,
      },
      {
        source: '/top-list/smart-city-urban-planning-and-the-rise-of-carbon-neutral-mixed-use-districts',
        destination: '/real-estate/dubai-vs-abu-dhabi-property-investment-guide',
        permanent: true,
      },
      {
        source: '/startups/smart-city-urban-planning-and-the-rise-of-carbon-neutral-mixed-use-districts',
        destination: '/real-estate/dubai-vs-abu-dhabi-property-investment-guide',
        permanent: true,
      },
      {
        source: '/hospitality/ultra-luxury-eco-resorts-sustainable-hospitality',
        destination: '/hospitality/best-eco-luxury-resorts-uae',
        permanent: true,
      },
      {
        source: '/news/omnichannel-luxury-retail-spatial-computing',
        destination: '/retail/dubai-shopping-festival-luxury-retail-strategy',
        permanent: true,
      },
      {
        source: '/health/omnichannel-luxury-retail-spatial-computing',
        destination: '/retail/dubai-shopping-festival-luxury-retail-strategy',
        permanent: true,
      },
      {
        source: '/real-estate/omnichannel-luxury-retail-spatial-computing',
        destination: '/retail/dubai-shopping-festival-luxury-retail-strategy',
        permanent: true,
      },
      {
        source: '/lifestyle/omnichannel-luxury-retail-spatial-computing',
        destination: '/retail/dubai-shopping-festival-luxury-retail-strategy',
        permanent: true,
      },
      {
        source: '/hospitality/omnichannel-luxury-retail-spatial-computing',
        destination: '/retail/dubai-shopping-festival-luxury-retail-strategy',
        permanent: true,
      },
      {
        source: '/retail/omnichannel-luxury-retail-spatial-computing',
        destination: '/retail/dubai-shopping-festival-luxury-retail-strategy',
        permanent: true,
      },
      {
        source: '/business/omnichannel-luxury-retail-spatial-computing',
        destination: '/retail/dubai-shopping-festival-luxury-retail-strategy',
        permanent: true,
      },
      {
        source: '/technology/omnichannel-luxury-retail-spatial-computing',
        destination: '/retail/dubai-shopping-festival-luxury-retail-strategy',
        permanent: true,
      },
      {
        source: '/leadership/omnichannel-luxury-retail-spatial-computing',
        destination: '/retail/dubai-shopping-festival-luxury-retail-strategy',
        permanent: true,
      },
      {
        source: '/top-list/omnichannel-luxury-retail-spatial-computing',
        destination: '/retail/dubai-shopping-festival-luxury-retail-strategy',
        permanent: true,
      },
      {
        source: '/startups/omnichannel-luxury-retail-spatial-computing',
        destination: '/retail/dubai-shopping-festival-luxury-retail-strategy',
        permanent: true,
      },
      {
        source: '/news/automated-cold-chain-micro-fulfillment-groceries',
        destination: '/lifestyle/quick-commerce-uae-grocery-delivery-trends',
        permanent: true,
      },
      {
        source: '/health/automated-cold-chain-micro-fulfillment-groceries',
        destination: '/lifestyle/quick-commerce-uae-grocery-delivery-trends',
        permanent: true,
      },
      {
        source: '/real-estate/automated-cold-chain-micro-fulfillment-groceries',
        destination: '/lifestyle/quick-commerce-uae-grocery-delivery-trends',
        permanent: true,
      },
      {
        source: '/lifestyle/automated-cold-chain-micro-fulfillment-groceries',
        destination: '/lifestyle/quick-commerce-uae-grocery-delivery-trends',
        permanent: true,
      },
      {
        source: '/hospitality/automated-cold-chain-micro-fulfillment-groceries',
        destination: '/lifestyle/quick-commerce-uae-grocery-delivery-trends',
        permanent: true,
      },
      {
        source: '/retail/automated-cold-chain-micro-fulfillment-groceries',
        destination: '/lifestyle/quick-commerce-uae-grocery-delivery-trends',
        permanent: true,
      },
      {
        source: '/business/automated-cold-chain-micro-fulfillment-groceries',
        destination: '/lifestyle/quick-commerce-uae-grocery-delivery-trends',
        permanent: true,
      },
      {
        source: '/technology/automated-cold-chain-micro-fulfillment-groceries',
        destination: '/lifestyle/quick-commerce-uae-grocery-delivery-trends',
        permanent: true,
      },
      {
        source: '/leadership/automated-cold-chain-micro-fulfillment-groceries',
        destination: '/lifestyle/quick-commerce-uae-grocery-delivery-trends',
        permanent: true,
      },
      {
        source: '/top-list/automated-cold-chain-micro-fulfillment-groceries',
        destination: '/lifestyle/quick-commerce-uae-grocery-delivery-trends',
        permanent: true,
      },
      {
        source: '/startups/automated-cold-chain-micro-fulfillment-groceries',
        destination: '/lifestyle/quick-commerce-uae-grocery-delivery-trends',
        permanent: true,
      },
      {
        source: '/news/cellular-rejuvenation-and-the-clinical-frontier-of-metabolic-longevity',
        destination: '/health/longevity-medicine-abu-dhabi-dubai',
        permanent: true,
      },
      {
        source: '/health/cellular-rejuvenation-and-the-clinical-frontier-of-metabolic-longevity',
        destination: '/health/longevity-medicine-abu-dhabi-dubai',
        permanent: true,
      },
      {
        source: '/real-estate/cellular-rejuvenation-and-the-clinical-frontier-of-metabolic-longevity',
        destination: '/health/longevity-medicine-abu-dhabi-dubai',
        permanent: true,
      },
      {
        source: '/lifestyle/cellular-rejuvenation-and-the-clinical-frontier-of-metabolic-longevity',
        destination: '/health/longevity-medicine-abu-dhabi-dubai',
        permanent: true,
      },
      {
        source: '/hospitality/cellular-rejuvenation-and-the-clinical-frontier-of-metabolic-longevity',
        destination: '/health/longevity-medicine-abu-dhabi-dubai',
        permanent: true,
      },
      {
        source: '/retail/cellular-rejuvenation-and-the-clinical-frontier-of-metabolic-longevity',
        destination: '/health/longevity-medicine-abu-dhabi-dubai',
        permanent: true,
      },
      {
        source: '/business/cellular-rejuvenation-and-the-clinical-frontier-of-metabolic-longevity',
        destination: '/health/longevity-medicine-abu-dhabi-dubai',
        permanent: true,
      },
      {
        source: '/technology/cellular-rejuvenation-and-the-clinical-frontier-of-metabolic-longevity',
        destination: '/health/longevity-medicine-abu-dhabi-dubai',
        permanent: true,
      },
      {
        source: '/leadership/cellular-rejuvenation-and-the-clinical-frontier-of-metabolic-longevity',
        destination: '/health/longevity-medicine-abu-dhabi-dubai',
        permanent: true,
      },
      {
        source: '/top-list/cellular-rejuvenation-and-the-clinical-frontier-of-metabolic-longevity',
        destination: '/health/longevity-medicine-abu-dhabi-dubai',
        permanent: true,
      },
      {
        source: '/startups/cellular-rejuvenation-and-the-clinical-frontier-of-metabolic-longevity',
        destination: '/health/longevity-medicine-abu-dhabi-dubai',
        permanent: true,
      },
      {
        source: '/news/private-aviation-sky-lounges-ultra-luxury-travel',
        destination: '/lifestyle/private-jet-charter-uae-costs-guide',
        permanent: true,
      },
      {
        source: '/health/private-aviation-sky-lounges-ultra-luxury-travel',
        destination: '/lifestyle/private-jet-charter-uae-costs-guide',
        permanent: true,
      },
      {
        source: '/real-estate/private-aviation-sky-lounges-ultra-luxury-travel',
        destination: '/lifestyle/private-jet-charter-uae-costs-guide',
        permanent: true,
      },
      {
        source: '/lifestyle/private-aviation-sky-lounges-ultra-luxury-travel',
        destination: '/lifestyle/private-jet-charter-uae-costs-guide',
        permanent: true,
      },
      {
        source: '/hospitality/private-aviation-sky-lounges-ultra-luxury-travel',
        destination: '/lifestyle/private-jet-charter-uae-costs-guide',
        permanent: true,
      },
      {
        source: '/retail/private-aviation-sky-lounges-ultra-luxury-travel',
        destination: '/lifestyle/private-jet-charter-uae-costs-guide',
        permanent: true,
      },
      {
        source: '/business/private-aviation-sky-lounges-ultra-luxury-travel',
        destination: '/lifestyle/private-jet-charter-uae-costs-guide',
        permanent: true,
      },
      {
        source: '/technology/private-aviation-sky-lounges-ultra-luxury-travel',
        destination: '/lifestyle/private-jet-charter-uae-costs-guide',
        permanent: true,
      },
      {
        source: '/leadership/private-aviation-sky-lounges-ultra-luxury-travel',
        destination: '/lifestyle/private-jet-charter-uae-costs-guide',
        permanent: true,
      },
      {
        source: '/top-list/private-aviation-sky-lounges-ultra-luxury-travel',
        destination: '/lifestyle/private-jet-charter-uae-costs-guide',
        permanent: true,
      },
      {
        source: '/startups/private-aviation-sky-lounges-ultra-luxury-travel',
        destination: '/lifestyle/private-jet-charter-uae-costs-guide',
        permanent: true,
      },
      {
        source: '/news/the-2026-clean-energy-breakthrough-changing-global-power',
        destination: '/business/uae-clean-energy-2050-solar-nuclear',
        permanent: true,
      },
      {
        source: '/health/the-2026-clean-energy-breakthrough-changing-global-power',
        destination: '/business/uae-clean-energy-2050-solar-nuclear',
        permanent: true,
      },
      {
        source: '/real-estate/the-2026-clean-energy-breakthrough-changing-global-power',
        destination: '/business/uae-clean-energy-2050-solar-nuclear',
        permanent: true,
      },
      {
        source: '/lifestyle/the-2026-clean-energy-breakthrough-changing-global-power',
        destination: '/business/uae-clean-energy-2050-solar-nuclear',
        permanent: true,
      },
      {
        source: '/hospitality/the-2026-clean-energy-breakthrough-changing-global-power',
        destination: '/business/uae-clean-energy-2050-solar-nuclear',
        permanent: true,
      },
      {
        source: '/retail/the-2026-clean-energy-breakthrough-changing-global-power',
        destination: '/business/uae-clean-energy-2050-solar-nuclear',
        permanent: true,
      },
      {
        source: '/business/the-2026-clean-energy-breakthrough-changing-global-power',
        destination: '/business/uae-clean-energy-2050-solar-nuclear',
        permanent: true,
      },
      {
        source: '/technology/the-2026-clean-energy-breakthrough-changing-global-power',
        destination: '/business/uae-clean-energy-2050-solar-nuclear',
        permanent: true,
      },
      {
        source: '/leadership/the-2026-clean-energy-breakthrough-changing-global-power',
        destination: '/business/uae-clean-energy-2050-solar-nuclear',
        permanent: true,
      },
      {
        source: '/top-list/the-2026-clean-energy-breakthrough-changing-global-power',
        destination: '/business/uae-clean-energy-2050-solar-nuclear',
        permanent: true,
      },
      {
        source: '/startups/the-2026-clean-energy-breakthrough-changing-global-power',
        destination: '/business/uae-clean-energy-2050-solar-nuclear',
        permanent: true,
      },
      {
        source: '/news/space-agencies-plan-joint-lunar-exploration-mission',
        destination: '/news/uae-space-programme-rashid-rover-hope-probe',
        permanent: true,
      },
      {
        source: '/health/space-agencies-plan-joint-lunar-exploration-mission',
        destination: '/news/uae-space-programme-rashid-rover-hope-probe',
        permanent: true,
      },
      {
        source: '/real-estate/space-agencies-plan-joint-lunar-exploration-mission',
        destination: '/news/uae-space-programme-rashid-rover-hope-probe',
        permanent: true,
      },
      {
        source: '/lifestyle/space-agencies-plan-joint-lunar-exploration-mission',
        destination: '/news/uae-space-programme-rashid-rover-hope-probe',
        permanent: true,
      },
      {
        source: '/hospitality/space-agencies-plan-joint-lunar-exploration-mission',
        destination: '/news/uae-space-programme-rashid-rover-hope-probe',
        permanent: true,
      },
      {
        source: '/retail/space-agencies-plan-joint-lunar-exploration-mission',
        destination: '/news/uae-space-programme-rashid-rover-hope-probe',
        permanent: true,
      },
      {
        source: '/business/space-agencies-plan-joint-lunar-exploration-mission',
        destination: '/news/uae-space-programme-rashid-rover-hope-probe',
        permanent: true,
      },
      {
        source: '/technology/space-agencies-plan-joint-lunar-exploration-mission',
        destination: '/news/uae-space-programme-rashid-rover-hope-probe',
        permanent: true,
      },
      {
        source: '/leadership/space-agencies-plan-joint-lunar-exploration-mission',
        destination: '/news/uae-space-programme-rashid-rover-hope-probe',
        permanent: true,
      },
      {
        source: '/top-list/space-agencies-plan-joint-lunar-exploration-mission',
        destination: '/news/uae-space-programme-rashid-rover-hope-probe',
        permanent: true,
      },
      {
        source: '/startups/space-agencies-plan-joint-lunar-exploration-mission',
        destination: '/news/uae-space-programme-rashid-rover-hope-probe',
        permanent: true,
      },
      {
        source: '/news/corporate-treasuries-diversify-into-green-infrastructure-bonds',
        destination: '/business/green-bonds-sustainable-finance-uae',
        permanent: true,
      },
      {
        source: '/health/corporate-treasuries-diversify-into-green-infrastructure-bonds',
        destination: '/business/green-bonds-sustainable-finance-uae',
        permanent: true,
      },
      {
        source: '/real-estate/corporate-treasuries-diversify-into-green-infrastructure-bonds',
        destination: '/business/green-bonds-sustainable-finance-uae',
        permanent: true,
      },
      {
        source: '/lifestyle/corporate-treasuries-diversify-into-green-infrastructure-bonds',
        destination: '/business/green-bonds-sustainable-finance-uae',
        permanent: true,
      },
      {
        source: '/hospitality/corporate-treasuries-diversify-into-green-infrastructure-bonds',
        destination: '/business/green-bonds-sustainable-finance-uae',
        permanent: true,
      },
      {
        source: '/retail/corporate-treasuries-diversify-into-green-infrastructure-bonds',
        destination: '/business/green-bonds-sustainable-finance-uae',
        permanent: true,
      },
      {
        source: '/business/corporate-treasuries-diversify-into-green-infrastructure-bonds',
        destination: '/business/green-bonds-sustainable-finance-uae',
        permanent: true,
      },
      {
        source: '/technology/corporate-treasuries-diversify-into-green-infrastructure-bonds',
        destination: '/business/green-bonds-sustainable-finance-uae',
        permanent: true,
      },
      {
        source: '/leadership/corporate-treasuries-diversify-into-green-infrastructure-bonds',
        destination: '/business/green-bonds-sustainable-finance-uae',
        permanent: true,
      },
      {
        source: '/top-list/corporate-treasuries-diversify-into-green-infrastructure-bonds',
        destination: '/business/green-bonds-sustainable-finance-uae',
        permanent: true,
      },
      {
        source: '/startups/corporate-treasuries-diversify-into-green-infrastructure-bonds',
        destination: '/business/green-bonds-sustainable-finance-uae',
        permanent: true,
      },
      {
        source: '/news/enterprise-ai-reshapes-global-supply-chain-logistics',
        destination: '/business/uae-logistics-free-zones-jebel-ali-future-trade',
        permanent: true,
      },
      {
        source: '/health/enterprise-ai-reshapes-global-supply-chain-logistics',
        destination: '/business/uae-logistics-free-zones-jebel-ali-future-trade',
        permanent: true,
      },
      {
        source: '/real-estate/enterprise-ai-reshapes-global-supply-chain-logistics',
        destination: '/business/uae-logistics-free-zones-jebel-ali-future-trade',
        permanent: true,
      },
      {
        source: '/lifestyle/enterprise-ai-reshapes-global-supply-chain-logistics',
        destination: '/business/uae-logistics-free-zones-jebel-ali-future-trade',
        permanent: true,
      },
      {
        source: '/hospitality/enterprise-ai-reshapes-global-supply-chain-logistics',
        destination: '/business/uae-logistics-free-zones-jebel-ali-future-trade',
        permanent: true,
      },
      {
        source: '/retail/enterprise-ai-reshapes-global-supply-chain-logistics',
        destination: '/business/uae-logistics-free-zones-jebel-ali-future-trade',
        permanent: true,
      },
      {
        source: '/business/enterprise-ai-reshapes-global-supply-chain-logistics',
        destination: '/business/uae-logistics-free-zones-jebel-ali-future-trade',
        permanent: true,
      },
      {
        source: '/technology/enterprise-ai-reshapes-global-supply-chain-logistics',
        destination: '/business/uae-logistics-free-zones-jebel-ali-future-trade',
        permanent: true,
      },
      {
        source: '/leadership/enterprise-ai-reshapes-global-supply-chain-logistics',
        destination: '/business/uae-logistics-free-zones-jebel-ali-future-trade',
        permanent: true,
      },
      {
        source: '/top-list/enterprise-ai-reshapes-global-supply-chain-logistics',
        destination: '/business/uae-logistics-free-zones-jebel-ali-future-trade',
        permanent: true,
      },
      {
        source: '/startups/enterprise-ai-reshapes-global-supply-chain-logistics',
        destination: '/business/uae-logistics-free-zones-jebel-ali-future-trade',
        permanent: true,
      },
      // 301 Redirections for deleted blog posts to relevant Category Pages (Avoiding Soft 404)
      {
        source: '/news/why-indias-job-crisis-is-defying-its-economic-boom',
        destination: '/category/business',
        permanent: true,
      },
      {
        source: '/news/top-10-autonomous-logistics-networks-operating-in-high-velocity-hubs',
        destination: '/category/technology',
        permanent: true,
      },
      {
        source: '/news/top-10-solid-state-high-density-battery-paradigms-commercial-scale',
        destination: '/category/technology',
        permanent: true,
      },
      {
        source: '/news/fallacy-of-pure-efficiency-strategic-resilience',
        destination: '/category/leadership',
        permanent: true,
      },
      {
        source: '/news/boardroom-blindspot-geopolitical-cloud-opinion',
        destination: '/category/opinion',
        permanent: true,
      },
      {
        source: '/news/computer-vision-autonomous-checkouts-urban-retail',
        destination: '/category/retail',
        permanent: true,
      },
      {
        source: '/news/biophilic-hideaways-regenerative-wellness-resorts',
        destination: '/category/hospitality',
        permanent: true,
      },
      {
        source: '/news/top-10-cross-border-b2b-liquidity-networks-disseminating-trade-capital',
        destination: '/category/business',
        permanent: true,
      },
      {
        source: '/news/multimodal-ai-agents-corporate-hierarchy-opinion',
        destination: '/category/opinion',
        permanent: true,
      },
      {
        source: '/news/dtc-pivot-heritage-luxury-brands-retail',
        destination: '/category/retail',
        permanent: true,
      },
      {
        source: '/news/top-10-frontier-innovations-2026',
        destination: '/category/technology',
        permanent: true,
      },
      {
        source: '/news/next-gen-quantum-processors-enter-commercial-production',
        destination: '/category/technology',
        permanent: true,
      },
      {
        source: '/news/the-anatomy-of-a-winning-seed-pitch-deck-in-the-modern-vc-climate',
        destination: '/category/startups',
        permanent: true,
      },
      {
        source: '/news/the-death-of-the-influencer-and-the-triumph-of-micro-community-evangelism',
        destination: '/category/lifestyle',
        permanent: true,
      },
      {
        source: '/news/top-10-spatial-computing-autonomous-robotics-advanced-manufacturing',
        destination: '/category/technology',
        permanent: true,
      },
      {
        source: '/news/top-10-biophilic-mass-timber-commercial-skyscrapers-reshaping-skylines',
        destination: '/category/real-estate',
        permanent: true,
      },
      {
        source: '/news/why-ai-business-trends-2026-matters-more-than-ever-in-2026',
        destination: '/category/technology',
        permanent: true,
      },
      {
        source: '/news/why-modern-business-leadership-is-reimagining-the-playbook',
        destination: '/category/leadership',
        permanent: true,
      },
      {
        source: '/news/programmatic-brand-storytelling-in-the-age-of-algorithmic-feeds',
        destination: '/category/lifestyle',
        permanent: true,
      },
      {
        source: '/news/solid-state-electrolytes-and-the-next-generation-of-energy-density',
        destination: '/category/technology',
        permanent: true,
      },
      {
        source: '/news/bard-powerport-lawsuit-mdl-court-proceedings-and-patient-advocacy',
        destination: '/category/health',
        permanent: true,
      },
      {
        source: '/news/interview-sarah-chen-on-building-ai-native-operating-systems',
        destination: '/category/interview',
        permanent: true,
      },
      {
        source: '/news/interview-tariq-al-mansoori-on-sovereign-ai-infrastructure',
        destination: '/category/interview',
        permanent: true,
      },
      {
        source: '/news/next-gen-semiconductor-clusters-powering-photonic-ai-training',
        destination: '/category/technology',
        permanent: true,
      },
      {
        source: '/news/biography-maya-lin-and-the-sculptural-geometry-of-memory',
        destination: '/category/lifestyle',
        permanent: true,
      },
      {
        source: '/news/renewable-energy-generation-sets-global-milestone',
        destination: '/category/business',
        permanent: true,
      },
      {
        source: '/news/neuromorphic-edge-computing-chips-bring-real-time-intelligence-to-robotics',
        destination: '/category/technology',
        permanent: true,
      },
      {
        source: '/news/marcus-graham-on-the-100-year-horizon-of-deep-tech-capital',
        destination: '/category/interview',
        permanent: true,
      },
      {
        source: '/news/navigating-cross-border-compensation-in-global-remote-engineering',
        destination: '/category/leadership',
        permanent: true,
      },
      {
        source: '/news/interview-venture-capitalist-marcus-graham-on-seed-stage-investing',
        destination: '/category/interview',
        permanent: true,
      },
      {
        source: '/news/interview-maya-lin-on-the-renaissance-of-sustainable-urban-design',
        destination: '/category/interview',
        permanent: true,
      },
      {
        source: '/news/ai-business-trends-2026-the-growth-playbook',
        destination: '/category/technology',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

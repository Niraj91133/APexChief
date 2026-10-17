const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/app/page.tsx');
let code = fs.readFileSync(filePath, 'utf-8');

// 1. Fix LATEST NEWS header and remove stray closing divs
const latestNewsOld = `<section id="latest-news" className="w-full border-b border-[#211d1d]/20 pb-8">
        <h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-black dark:text-white pb-2 border-b border-gray-200 dark:border-white/20 mb-6">
          LATEST NEWS
        </h2>
              </div>
            </div>
          </div>`;

const latestNewsNew = `<section id="latest-news" className="w-full border-b border-[#211d1d]/20 pb-8">
        <div className="flex items-end justify-between pb-2 border-b border-gray-200 dark:border-white/20 mb-6">
          <h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-black dark:text-white leading-none">
            LATEST NEWS
          </h2>
          <Link
            href="/news"
            className="inline-flex items-center space-x-1 text-xs sm:text-sm font-oswald uppercase text-[#f7413e] hover:underline font-bold tracking-wider"
          >
            <span>Full Editorial Archive</span>
            <span className="text-base leading-none">→</span>
          </Link>
        </div>`;

if (code.includes(latestNewsOld)) {
  code = code.replace(latestNewsOld, latestNewsNew);
} else {
  // Regex fallback
  code = code.replace(
    /<section id="latest-news"[^>]*>[\s\S]*?<div className="grid grid-cols-1 lg:grid-cols-12/i,
    `<section id="latest-news" className="w-full border-b border-[#211d1d]/20 pb-8">
        <div className="flex items-end justify-between pb-2 border-b border-gray-200 dark:border-white/20 mb-6">
          <h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-black dark:text-white leading-none">
            LATEST NEWS
          </h2>
          <Link
            href="/news"
            className="inline-flex items-center space-x-1 text-xs sm:text-sm font-oswald uppercase text-[#f7413e] hover:underline font-bold tracking-wider"
          >
            <span>Full Editorial Archive</span>
            <span className="text-base leading-none">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12`
  );
}

// 2. Fix Best This Month header
code = code.replace(
  /<section id="best-this-month"[^>]*>[\s\S]*?<div className="grid grid-cols-1 lg:grid-cols-12/i,
  `<section id="best-this-month" className="w-full pt-4 border-b border-[#211d1d]/20 pb-8">
        <div className="flex items-end justify-between pb-2 border-b border-gray-200 dark:border-white/20 mb-6">
          <h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-black dark:text-white leading-none">
            Best This Month
          </h2>
          <Link
            href="/news"
            className="inline-flex items-center space-x-1 text-xs sm:text-sm font-oswald uppercase text-[#f7413e] hover:underline font-bold tracking-wider"
          >
            <span>Editorial Archive</span>
            <span className="text-base leading-none">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12`
);

// 3. Replace all category section headers with single red archive link
const standardCatHeader = `<div className="flex items-end justify-between pb-2 border-b border-gray-200 dark:border-white/20 mb-6">
        <h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-black dark:text-white leading-none">
          {cat.name}
        </h2>
        <Link
          href={\`/news?category=\${cat.slug}\`}
          className="inline-flex items-center space-x-1 text-xs sm:text-sm font-oswald uppercase text-[#f7413e] hover:underline font-bold tracking-wider"
        >
          <span>Explore {cat.name} Archive</span>
          <span className="text-base leading-none">→</span>
        </Link>
      </div>`;

// Replace <h2 ...>{cat.name}</h2> or any previous div header for categories
code = code.replace(
  /<h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-\[#0a0a0a\] pb-2 border-b border-\[#211d1d\]\/30 mb-6">\s*\{cat\.name\}\s*<\/h2>/g,
  standardCatHeader
);

code = code.replace(
  /<h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-black dark:text-white pb-2 border-b border-gray-200 dark:border-white\/20 mb-6">\s*\{cat\.name\}\s*<\/h2>/g,
  standardCatHeader
);

fs.writeFileSync(filePath, code, 'utf-8');
console.log('Successfully updated section headers: removed View All and kept the red direct archive links!');

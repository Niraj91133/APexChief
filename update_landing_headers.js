const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/app/page.tsx');
let code = fs.readFileSync(filePath, 'utf-8');

// 1. Replace LATEST NEWS section header
const latestNewsHeaderPattern = /<h2[^>]*>\s*LATEST NEWS\s*<\/h2>/i;
const newLatestNewsHeader = `<div className="flex items-end justify-between pb-2 border-b border-gray-200 dark:border-white/20 mb-6">
          <div className="flex items-baseline space-x-3 sm:space-x-4">
            <h2 className="font-bebas text-4xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-black dark:text-white leading-none">
              LATEST NEWS
            </h2>
            <Link
              href="/news"
              className="inline-flex items-center space-x-1 text-xs sm:text-sm font-oswald uppercase tracking-wider text-gray-500 hover:text-[#f7413e] dark:text-gray-400 dark:hover:text-[#f7413e] font-bold transition-colors"
            >
              <span>View All</span>
              <span className="text-sm sm:text-base leading-none">→</span>
            </Link>
          </div>
          <Link
            href="/news"
            className="hidden sm:inline-flex items-center space-x-1 text-xs font-mono uppercase text-[#f7413e] hover:underline font-bold"
          >
            <span>Full Editorial Archive</span>
            <span>→</span>
          </Link>
        </div>`;

code = code.replace(latestNewsHeaderPattern, newLatestNewsHeader);

// 2. Replace Best This Month header
const bestThisMonthPattern = /<h2[^>]*>\s*Best This Month\s*<\/h2>/i;
const newBestThisMonthHeader = `<div className="flex items-end justify-between pb-2 border-b border-gray-200 dark:border-white/20 mb-6">
          <div className="flex items-baseline space-x-3 sm:space-x-4">
            <h2 className="font-bebas text-4xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-black dark:text-white leading-none">
              Best This Month
            </h2>
            <Link
              href="/news"
              className="inline-flex items-center space-x-1 text-xs sm:text-sm font-oswald uppercase tracking-wider text-gray-500 hover:text-[#f7413e] dark:text-gray-400 dark:hover:text-[#f7413e] font-bold transition-colors"
            >
              <span>View All</span>
              <span className="text-sm sm:text-base leading-none">→</span>
            </Link>
          </div>
        </div>`;

code = code.replace(bestThisMonthPattern, newBestThisMonthHeader);

// 3. Replace all CategorySection {cat.name} headers
const categoryHeaderPattern = /<h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-\[#0a0a0a\] pb-2 border-b border-\[#211d1d\]\/30 mb-6">\s*\{cat\.name\}\s*<\/h2>/g;
const newCategoryHeader = `<div className="flex items-end justify-between pb-2 border-b border-gray-200 dark:border-white/20 mb-6">
        <div className="flex items-baseline space-x-3 sm:space-x-4">
          <h2 className="font-bebas text-4xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-black dark:text-white leading-none">
            {cat.name}
          </h2>
          <Link
            href={\`/news?category=\${cat.slug}\`}
            className="inline-flex items-center space-x-1 text-xs sm:text-sm font-oswald uppercase tracking-wider text-gray-500 hover:text-[#f7413e] dark:text-gray-400 dark:hover:text-[#f7413e] font-bold transition-colors"
          >
            <span>View All</span>
            <span className="text-sm sm:text-base leading-none">→</span>
          </Link>
        </div>
        <Link
          href={\`/news?category=\${cat.slug}\`}
          className="hidden sm:inline-flex items-center space-x-1 text-xs font-mono uppercase text-[#f7413e] hover:underline font-bold"
        >
          <span>Explore {cat.name} Archive</span>
          <span>→</span>
        </Link>
      </div>`;

code = code.replace(categoryHeaderPattern, newCategoryHeader);

fs.writeFileSync(filePath, code, 'utf-8');
console.log('Successfully updated landing page headers with View All arrows!');

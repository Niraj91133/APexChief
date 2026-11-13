const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const ARTICLES_FILE = path.join(__dirname, '..', 'src', 'data', 'articles.json');
const CATEGORIES_FILE = path.join(__dirname, '..', 'src', 'data', 'categories.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function readArticlesJson() {
  try {
    if (fs.existsSync(ARTICLES_FILE)) {
      const data = fs.readFileSync(ARTICLES_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading articles.json:', e);
  }
  return [];
}

function writeArticlesJson(articles) {
  try {
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Error writing articles.json:', e);
    return false;
  }
}

function readCategoriesJson() {
  try {
    if (fs.existsSync(CATEGORIES_FILE)) {
      const data = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading categories.json:', e);
  }
  return [];
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // CORS headers for seamless communication
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Route: /api/categories
  if (pathname === '/api/categories') {
    if (req.method === 'GET') {
      const categories = readCategoriesJson();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(categories));
      return;
    }
  }

  // API Route: /api/articles
  if (pathname === '/api/articles') {
    if (req.method === 'GET') {
      const articles = readArticlesJson();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(articles));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const newArticle = JSON.parse(body);
          if (!newArticle.title) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing title' }));
            return;
          }

          if (!newArticle.slug) {
            newArticle.slug = newArticle.title
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .trim() || `story-${Date.now()}`;
          }
          if (!newArticle.id) newArticle.id = newArticle.slug;

          const articles = readArticlesJson();
          const existingIdx = articles.findIndex(a => a.slug === newArticle.slug || (newArticle.id && a.id === newArticle.id));

          if (existingIdx >= 0) {
            articles[existingIdx] = { ...articles[existingIdx], ...newArticle };
          } else {
            articles.unshift(newArticle);
          }

          writeArticlesJson(articles);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newArticle));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
        }
      });
      return;
    }

    if (req.method === 'PUT') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const updatedArt = JSON.parse(body);
          const articles = readArticlesJson();
          const idx = articles.findIndex(a => a.slug === updatedArt.slug || (updatedArt.id && a.id === updatedArt.id));
          if (idx >= 0) {
            articles[idx] = { ...articles[idx], ...updatedArt };
            writeArticlesJson(articles);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(articles[idx]));
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Article not found' }));
          }
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
        }
      });
      return;
    }

    if (req.method === 'DELETE') {
      const slug = parsedUrl.searchParams.get('slug') || parsedUrl.searchParams.get('id');
      if (!slug) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing slug or id' }));
        return;
      }

      const articles = readArticlesJson();
      const filtered = articles.filter(a => a.slug !== slug && a.id !== slug);
      writeArticlesJson(filtered);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Deleted successfully' }));
      return;
    }
  }

  // Static File Serving
  let reqUrl = pathname;
  if (reqUrl === '/' || reqUrl === '/wp-admin' || reqUrl === '/wp-admin/') {
    reqUrl = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, reqUrl);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const indexFile = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(indexFile, (err2, content) => {
        if (err2) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err3, content) => {
      if (err3) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 WordPress + Rank Math SEO Replica is running!`);
  console.log(`👉 Open in browser: http://localhost:${PORT}`);
  console.log(`====================================================`);
});

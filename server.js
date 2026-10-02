'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = Number(process.env.PORT) || 3000;
const htmlPath = path.join(__dirname, 'Wanderer.html');

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url || '/', 'http://localhost').pathname;

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, {
      'Content-Type': 'text/plain; charset=utf-8',
      Allow: 'GET, HEAD'
    });
    res.end('Method not allowed');
    return;
  }

  if (pathname !== '/' && pathname !== '/Wanderer.html') {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }

  fs.readFile(htmlPath, (error, html) => {
    if (error) {
      console.error('Could not read Wanderer.html:', error.message);
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Wanderer page could not be loaded');
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': html.length,
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cache-Control': 'no-cache'
    });

    res.end(req.method === 'HEAD' ? undefined : html);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Wanderer server running on port ${PORT}`);
});

// netlify/functions/fetch-handler.js
const fetch = require('node-fetch'); // Ensure you have node-fetch installed

exports.handler = async function(event, context) {
  const url = new URL(event.rawUrl);

  // Serve robots.txt file when requested
  if (url.pathname === '/robots.txt') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: robotsTxt()
    };
  }

  // Serve sitemap.xml file when requested
  if (url.pathname === '/sitemap.xml') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: sitemapXml()
    };
  }

  // Fetch the original HTML content from Framer
  const fetchUrl = `https://silkfleurs.framer.ai${url.pathname}${url.search}`;
  const response = await fetch(fetchUrl);
  let text = await response.text();

  // Remove the <div id="__framer-badge-container"> from the HTML
  text = text.replace('<div id="__framer-badge-container"></div>', '');

  // Return the modified HTML content with CORS headers
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: text
  };
};

// robots.txt content
function robotsTxt() {
  return `
    User-agent: *
    Disallow:

    User-agent: Googlebot
    Allow: /

    Sitemap: https://silkfleurs.com/sitemap.xml
  `;
}

// sitemap.xml content
function sitemapXml() {
  return `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://silkfleurs.com/</loc>
        <lastmod>2024-09-18</lastmod>
        <priority>1.00</priority>
      </url>
      <url>
        <loc>https://silkfleurs.com/contact</loc>
        <lastmod>2024-09-18</lastmod>
        <priority>0.80</priority>
      </url>
      <url>
        <loc>https://silkfleurs.com/category/flowers</loc>
        <lastmod>2024-09-18</lastmod>
        <priority>0.80</priority>
      </url>
      <url>
        <loc>https://silkfleurs.com/category/specials</loc>
        <lastmod>2024-09-18</lastmod>
        <priority>0.80</priority>
      </url>
      <url>
        <loc>https://silkfleurs.com/category/potted</loc>
        <lastmod>2024-09-18</lastmod>
        <priority>0.80</priority>
      </url>
      <!-- Add more URLs as needed -->
    </urlset>
  `;
}

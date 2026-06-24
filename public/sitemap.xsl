<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>Renew Healthcare Sitemap</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          :root {
            color-scheme: light;
            font-family: Inter, Arial, sans-serif;
            color: #17212b;
            background: #f5f8f7;
          }
          body {
            margin: 0;
            padding: 40px 5vw;
          }
          main {
            max-width: 1120px;
            margin: 0 auto;
          }
          h1 {
            margin: 0;
            color: #075387;
            font-size: clamp(2rem, 5vw, 3.5rem);
            line-height: 1.05;
          }
          p {
            max-width: 680px;
            color: #59636e;
            line-height: 1.7;
          }
          table {
            width: 100%;
            margin-top: 28px;
            border-collapse: collapse;
            overflow: hidden;
            border-radius: 18px;
            background: #fff;
            box-shadow: 0 16px 40px rgba(23, 33, 43, 0.08);
          }
          th,
          td {
            padding: 16px 18px;
            border-bottom: 1px solid #e7eef0;
            text-align: left;
            font-size: 0.94rem;
          }
          th {
            color: #315342;
            background: #eef6f2;
            font-size: 0.78rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          tr:last-child td {
            border-bottom: 0;
          }
          a {
            color: #075387;
            font-weight: 700;
            text-decoration: none;
            overflow-wrap: anywhere;
          }
          a:hover {
            text-decoration: underline;
          }
          @media (max-width: 720px) {
            body {
              padding: 28px 16px;
            }
            th:nth-child(3),
            td:nth-child(3),
            th:nth-child(4),
            td:nth-child(4) {
              display: none;
            }
            th,
            td {
              padding: 14px 12px;
              font-size: 0.86rem;
            }
          }
        </style>
      </head>
      <body>
        <main>
          <h1>Renew Healthcare Sitemap</h1>
          <p>This XML sitemap lists the public pages available for search engines and visitors.</p>
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Last Updated</th>
                <th>Frequency</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                  <td><xsl:value-of select="sitemap:lastmod"/></td>
                  <td><xsl:value-of select="sitemap:changefreq"/></td>
                  <td><xsl:value-of select="sitemap:priority"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>

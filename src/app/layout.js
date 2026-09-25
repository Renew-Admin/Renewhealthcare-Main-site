// Root layout — replaces the Vite index.html shell. Everything a page renders
// is inside <div id="root"> in the server HTML; there is no empty mount point.
//
// Per-page <title>, description, canonical, robots, Open Graph and JSON-LD are
// NOT set here: each page exports its own metadata (src/lib/nextSeo.js), so
// there is exactly one source for every head tag.
import Script from 'next/script'
import { SITE } from '../lib/seoUtils.js'

const GA_MEASUREMENT_ID = 'G-VL7SJC7ENL'
// Local offline runs (RENEW_OFFLINE=1) must not report page views to the
// production Google Analytics property.
const analyticsEnabled = process.env.RENEW_OFFLINE !== '1'

export const metadata = {
  metadataBase: new URL(SITE),
  applicationName: 'Renew Healthcare',
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png', sizes: '64x64' }],
    apple: '/favicon.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#075a91',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap_index.xml" />
        {/* Google Fonts — Lora (serif headings) + Manrope (sans subheadings/body) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div id="root">{children}</div>
        {/* Google tag (gtag.js). Page views are sent by usePageTracking on every route change,
            so gtag() must exist before hydration — the init snippet runs beforeInteractive
            and queues into dataLayer until the library loads. */}
        {analyticsEnabled && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
            <Script id="gtag-init" strategy="beforeInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });`}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}

/* eslint-disable */
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Meta tags */}
        <meta name="description" content="Ekzameen.com is your go-to platform for buying, selling, or renting real estate properties. Discover your dream home or perfect investment today!" />
        <meta property="og:title" content="ekZameen.com - Buy, Sell or Rent" />
        <meta property="og:site_name" content="ekZameen.com" />
        <meta property="og:url" content="https://ekzameen.com" />
        <meta property="og:description" content="Ekzameen.com is your go-to platform for buying, selling, or renting real estate properties. Discover your dream home or perfect investment today!" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ekzameen.com/images/1024.png" />

        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-K47389KZ5X"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-K47389KZ5X');
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// pages/_app.js
import React from 'react';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics';
import { ConfigProvider } from '../lib/ConfigContext';
import '../styles/globals.css';

/**
 * Custom App component that wraps all pages with ConfigProvider
 */
function HVACReportApp({ Component, pageProps }) {
  return (
    <ConfigProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </ConfigProvider>
  );
}

export default HVACReportApp;
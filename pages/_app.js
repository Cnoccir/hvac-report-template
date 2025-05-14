// pages/_app.js
import React from 'react';
import Head from 'next/head';
import { ConfigProvider } from '../lib/ConfigContext';
import '../styles/globals.css';

function HVACReportApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <ConfigProvider>
        <Component {...pageProps} />
      </ConfigProvider>
    </>
  );
}

export default HVACReportApp;
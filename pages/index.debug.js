// pages/index.js
import React from 'react';
import Head from 'next/head';
import { useConfig } from '../lib/ConfigContext';

export default function Home() {
  return (
    <div className="p-8">
      <Head>
        <title>HVAC Report Template</title>
        <meta name="description" content="HVAC Report Template" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-2xl font-bold mb-4">HVAC Report Template - Debug</h1>
        <ConfigDebugger />
      </main>
    </div>
  );
}

function ConfigDebugger() {
  try {
    // Try to access the config context but with a safety wrapper
    const configValue = useConfig();
    
    return (
      <div className="bg-green-50 p-4 rounded-md border border-green-200 mb-4">
        <h2 className="text-lg font-semibold text-green-700 mb-2">Configuration Loaded Successfully</h2>
        <p className="mb-2">Configuration data is available.</p>
        <pre className="bg-white p-4 rounded overflow-auto max-h-96 text-xs">
          {JSON.stringify(configValue, null, 2)}
        </pre>
      </div>
    );
  } catch (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md border border-red-200">
        <h2 className="text-lg font-semibold text-red-700 mb-2">Configuration Error</h2>
        <p className="mb-2">Error accessing configuration: {error.message}</p>
        <p>Stack trace:</p>
        <pre className="bg-white p-4 rounded overflow-auto max-h-96 text-xs">
          {error.stack}
        </pre>
      </div>
    );
  }
}
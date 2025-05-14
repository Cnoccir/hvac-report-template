// pages/index.js
import React from 'react';
import Head from 'next/head';
import { useConfig } from '../lib/ConfigContext';

export default function HVACServiceReport() {
  const { config, loading, error } = useConfig();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Loading configuration...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 p-6 rounded-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Configuration Error</h2>
          <p className="text-red-600 mb-4">{error.message}</p>
          <p className="text-gray-700">Please check your configuration file and try again.</p>
        </div>
      </div>
    );
  }
  
  // Safe access to config properties
  const title = config?.reportInfo?.title || 'HVAC Report';
  const clientName = config?.reportInfo?.client?.name || 'Client';
  const companyName = config?.reportInfo?.client?.companyName || 'Company';
  const dateRange = config?.reportInfo?.dateRange?.display || 'Date Range';
  
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={`${title} for ${clientName}`} />
      </Head>
      
      <div className="min-h-screen bg-white p-8">
        <header className="mb-8 pb-4 border-b">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-gray-500">{dateRange} | {clientName}</p>
        </header>
        
        <main>
          <section className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Basic Information</h2>
            <p><strong>Client:</strong> {clientName}</p>
            <p><strong>Company:</strong> {companyName}</p>
            <p><strong>Period:</strong> {dateRange}</p>
          </section>
          
          <section className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Configuration Data</h2>
            <pre className="bg-white p-4 rounded overflow-auto max-h-96 text-xs">
              {JSON.stringify(config, null, 2)}
            </pre>
          </section>
        </main>
      </div>
    </>
  );
}
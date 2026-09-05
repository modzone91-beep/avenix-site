'use client';

import { useState } from 'react';

// Product list (Replace packageId with your actual ID from Tebex Control Panel)
const PRODUCTS = [
  {
    id: 1,
    packageId: 1234567, // REPLACE THIS WITH YOUR TEBEX PACKAGE ID
    name: 'avenixDumpster',
    price: '€10.00',
    description:
      'avenixDumpster is an advanced dumpster and trash bin diving script. Players can search through containers to find materials, custom items, and extra loot.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
  },
];

export default function Home() {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleBuy = async (productId: number, packageId: number) => {
    setLoadingId(productId);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to process checkout. Please check server logs and configuration.');
      }
    } catch (err) {
      console.error(err);
      alert('A server error occurred while creating the checkout session.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-wide text-indigo-500 uppercase">
          Avenix Store
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Exclusive FiveM scripts and resources for your server.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between hover:border-zinc-700 transition-all"
          >
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {product.name}
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <span className="text-xl font-semibold text-white block mb-4">
                {product.price}
              </span>
              <button
                onClick={() => handleBuy(product.id, product.packageId)}
                disabled={loadingId === product.id}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold py-3 rounded-lg transition-all text-center cursor-pointer disabled:cursor-not-allowed"
              >
                {loadingId === product.id ? 'Processing...' : 'Buy Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
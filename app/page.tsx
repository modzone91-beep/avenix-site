'use client';

import { useEffect, useState } from 'react';

interface Package {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string | null;
}

export default function Home() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const publicToken = process.env.NEXT_PUBLIC_TEBEX_PUBLIC_TOKEN;
        const res = await fetch(`https://headless.tebex.io/api/accounts/${publicToken}/packages`);
        const data = await res.json();
        setPackages(data.data || []);
      } catch (err) {
        console.error('Greška pri učitavanju paketa:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  const handleBuy = async (packageId: number) => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert('Došlo je do greške pri pokretanju kupovine.');
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white px-8 py-16">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-indigo-500 mb-4">
          AVENIX STORE
        </h1>
        <p className="text-neutral-400 text-lg">
          Ekskluzivne FiveM skripte i resursi za tvoj server.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading ? (
          <p className="text-center col-span-3 text-neutral-500">Učitavanje skripti...</p>
        ) : packages.length === 0 ? (
          <p className="text-center col-span-3 text-neutral-500">Trenutno nema dostupnih paketa u Tebex panelu.</p>
        ) : (
          packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500 transition duration-300"
            >
              <div>
                {pkg.image && (
                  <img src={pkg.image} alt={pkg.name} className="w-full h-48 object-cover rounded-xl mb-4" />
                )}
                <h2 className="text-2xl font-bold mb-2">{pkg.name}</h2>
                <div 
                  className="text-neutral-400 text-sm mb-6 line-clamp-3" 
                  dangerouslySetInnerHTML={{ __html: pkg.description }} 
                />
              </div>

              <div>
                <div className="text-3xl font-extrabold text-white mb-4">
                  €{pkg.price}
                </div>
                <button
                  onClick={() => handleBuy(pkg.id)}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition duration-200"
                >
                  Kupi Odmah
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
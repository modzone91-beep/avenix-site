import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { packageId } = await req.json();
    const publicToken = process.env.NEXT_PUBLIC_TEBEX_PUBLIC_TOKEN;

    const basketResponse = await fetch(`https://headless.tebex.io/api/accounts/${publicToken}/baskets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        complete_url: 'http://localhost:3000',
        cancel_url: 'http://localhost:3000',
      }),
    });

    const basketData = await basketResponse.json();
    const basketIdent = basketData.data.ident;

    await fetch(`https://headless.tebex.io/api/accounts/${publicToken}/baskets/${basketIdent}/packages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        package_id: packageId,
        quantity: 1,
      }),
    });

    return NextResponse.json({ url: basketData.data.links.checkout });
  } catch (error) {
    return NextResponse.json({ error: 'Greška pri kreiranju korpe' }, { status: 500 });
  }
}
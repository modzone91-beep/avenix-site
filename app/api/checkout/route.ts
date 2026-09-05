import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { packageId } = await req.json();
    const publicToken = process.env.NEXT_PUBLIC_TEBEX_PUBLIC_TOKEN;

    if (!publicToken) {
      return NextResponse.json({ error: 'Tebex public token is missing' }, { status: 500 });
    }

    // 1. Create a new basket with your live Vercel domain URLs
    const basketResponse = await fetch(`https://headless.tebex.io/api/accounts/${publicToken}/baskets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        complete_url: 'https://avenix-official-site.vercel.app',
        cancel_url: 'https://avenix-official-site.vercel.app',
      }),
    });

    const basketData = await basketResponse.json();
    const basketIdent = basketData?.data?.ident;

    if (!basketIdent) {
      return NextResponse.json({ error: 'Failed to create Tebex basket' }, { status: 500 });
    }

    // 2. Add selected package to basket
    await fetch(`https://headless.tebex.io/api/baskets/${basketIdent}/packages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        package_id: packageId,
        quantity: 1,
      }),
    });

    // 3. Return direct Tebex checkout URL
    return NextResponse.json({ url: basketData.data.links.checkout });
  } catch (error) {
    return NextResponse.json({ error: 'Error processing basket creation' }, { status: 500 });
  }
}
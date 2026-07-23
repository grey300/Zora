// app/api/bhutan/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { question } = await request.json();
  if (!question) {
    return NextResponse.json({ error: 'Missing question' }, { status: 400 });
  }

  try {
    const flaskRes = await fetch('http://127.0.0.1:5000/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    if (!flaskRes.ok) {
      const txt = await flaskRes.text();
      console.error('Flask /generate error:', flaskRes.status, txt);
      return NextResponse.json({ error: 'Upstream error' }, { status: 502 });
    }

    const data = await flaskRes.json(); // { question, answer }
    return NextResponse.json(data);
  } catch (err) {
    console.error('Next.js proxy error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

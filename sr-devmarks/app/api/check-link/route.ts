import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL required' }, { status: 400 });
    }

    // Make a HEAD request to check if the URL is accessible
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'DevMarks Link Checker/1.0',
        },
      });
      
      clearTimeout(timeout);
      
      // Consider 2xx and 3xx as OK
      const isOk = response.status >= 200 && response.status < 400;
      
      return NextResponse.json({
        status: isOk ? 'ok' : 'broken',
        statusCode: response.status,
      });
    } catch (fetchError) {
      clearTimeout(timeout);
      return NextResponse.json({
        status: 'broken',
        statusCode: 0,
        error: 'Network error or timeout',
      });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

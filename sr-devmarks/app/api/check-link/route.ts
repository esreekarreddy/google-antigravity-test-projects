import { NextResponse } from 'next/server';

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  
  // Cleanup old entries occasionally
  if (rateLimit.size > 1000) {
    for (const [key, val] of rateLimit.entries()) {
      if (val.resetTime < now) rateLimit.delete(key);
    }
  }
  
  if (!entry || entry.resetTime < now) {
    rateLimit.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 });
    return true;
  }
  
  if (entry.count >= 100) return false; // 100 requests per 15 minutes
  entry.count++;
  return true;
}

function getClientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         request.headers.get('x-real-ip')?.trim() ||
         'unknown';
}

import dns from 'node:dns/promises';

// SSRF Protection: Block internal/private network URLs
async function isPrivateOrBlockedUrl(urlString: string): Promise<boolean> {
  try {
    const url = new URL(urlString);
    
    // Only allow http and https protocols
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return true;
    }

    const hostname = url.hostname.toLowerCase();
    
    // 1. Literal IP check (if hostname is an IP)
    // We rely on DNS lookup to handle all formats (Hex, Octal, etc) since dns.lookup handles them.
    
    // 2. DNS Resolution
    try {
      const { address } = await dns.lookup(hostname);
      
      // Check if resolved IP is private/internal using 'address' library or manual range checks
      // Since we can't easily import 'address' without checking package.json, we'll use manual checks on the resolved IP.
      // dns.lookup returns IPv4 or IPv6.
      
      if (address === '127.0.0.1' || address === '::1' || address === '0.0.0.0') return true;
      
      // IPv4 private ranges
      // 10.0.0.0/8     -> 10.x.x.x
      // 172.16.0.0/12  -> 172.16.x.x - 172.31.x.x
      // 192.168.0.0/16 -> 192.168.x.x
      // 169.254.0.0/16 -> 169.254.x.x (Link-local)
      
      const parts = address.split('.').map(Number);
      if (parts.length === 4) {
        if (parts[0] === 10) return true;
        if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
        if (parts[0] === 192 && parts[1] === 168) return true;
        if (parts[0] === 169 && parts[1] === 254) return true;
      }

      // Cloud Metadata Services
      if (address === '169.254.169.254') return true;
      
      return false;
    } catch (e) {
       // Loopback/Private DNS names might fail lookup or resolve to local.
       // Treat resolution failure as safe? No, treat as UNSAFE if we want to be strict, 
       // OR safe if we assume public DNS would resolve. 
       // Ideally, if it doesn't resolve, fetch will fail anyway. 
       // But 'localhost' might resolve on some systems.
       
       // Fallback string checks for common local names just in case DNS was skipped or failed weirdly
       // Fallback string checks for common local names just in case DNS was skipped or failed weirdly
       if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.internal')) {
         return true;
       }
       return false;
    }

  } catch {
    return true; // Block invalid URLs
  }
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    
    const { url } = await request.json();
    
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL required' }, { status: 400 });
    }
    
    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }
    
    // SSRF Protection: Block internal/private URLs
    if (await isPrivateOrBlockedUrl(url)) {
      return NextResponse.json({ error: 'URL not allowed' }, { status: 403 });
    }

    // Make a HEAD request to check if the URL is accessible
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(parsedUrl.toString(), {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'DevMarks Link Checker/1.0',
        },
        // Prevent following redirects to internal URLs
        redirect: 'manual',
      });
      
      clearTimeout(timeout);
      
      // If redirect, check if target is safe
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        if (location && await isPrivateOrBlockedUrl(location)) {
          return NextResponse.json({ error: 'Redirect target not allowed' }, { status: 403 });
        }
      }
      
      // Consider 2xx and 3xx as OK
      const isOk = response.status >= 200 && response.status < 400;
      
      return NextResponse.json({
        status: isOk ? 'ok' : 'broken',
        statusCode: response.status,
      });
    } catch {
      clearTimeout(timeout);
      return NextResponse.json({
        status: 'broken',
        statusCode: 0,
        error: 'Network error or timeout',
      });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}



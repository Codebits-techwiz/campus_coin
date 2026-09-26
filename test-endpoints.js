const http = require('http');

async function run() {
  // 1. Login to get cookie
  const loginRes = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'student@campuscoin.com', password: 'password123' })
  });
  
  const setCookieHeader = loginRes.headers.get('set-cookie');
  console.log('Login Set-Cookie:', setCookieHeader);
  
  const headers = { 'Cookie': setCookieHeader, 'Content-Type': 'application/json' };
  
  // 1. GET /api/reports/daily-weekly?month=2026-09
  const r1 = await fetch('http://localhost:3001/api/reports/daily-weekly?month=2026-09', { headers });
  console.log('\n--- 1. GET /api/reports/daily-weekly ---');
  console.log(await r1.text());

  // 2. GET /api/reports/category-breakdown?month=2026-09
  const r2 = await fetch('http://localhost:3001/api/reports/category-breakdown?month=2026-09', { headers });
  console.log('\n--- 2. GET /api/reports/category-breakdown ---');
  console.log(await r2.text());

  // 3. GET /api/reports/trend-6months
  const r3 = await fetch('http://localhost:3001/api/reports/trend-6months', { headers });
  console.log('\n--- 3. GET /api/reports/trend-6months ---');
  console.log(await r3.text());

  // 4. POST /api/categories
  const r4 = await fetch('http://localhost:3001/api/categories', {
    method: 'POST',
    headers,
    body: JSON.stringify({"name":"Test Cat","type":"expense","icon":"🧪","color":"#000"})
  });
  console.log('\n--- 4. POST /api/categories ---');
  console.log(await r4.text());
}

run().catch(console.error);

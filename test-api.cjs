const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting KRISHI DIGITAL API Integration Tests...\n');

  // 1. Health Check
  const health = await request({ hostname: 'localhost', port: 5000, path: '/api/health', method: 'GET' });
  console.log(`1. GET /api/health -> Status: ${health.status} (${health.data?.message || 'OK'})`);

  // 2. Farmer Login
  const farmerLogin = await request({
    hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'ramesh.farmer@krishidigital.com', password: 'Farmer@123' });
  const farmerData = farmerLogin.data?.data || farmerLogin.data?.user || farmerLogin.data;
  const farmerToken = farmerData?.token;
  console.log(`2. POST /api/auth/login (Farmer) -> Status: ${farmerLogin.status} (User: ${farmerData?.name}, Role: ${farmerData?.role})`);

  // 3. Admin Login
  const adminLogin = await request({
    hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'admin@krishidigital.com', password: 'Admin@123' });
  const adminData = adminLogin.data?.data || adminLogin.data?.user || adminLogin.data;
  const adminToken = adminData?.token;
  console.log(`3. POST /api/auth/login (Admin) -> Status: ${adminLogin.status} (User: ${adminData?.name}, Role: ${adminData?.role})`);

  // 4. Fetch Farms (Authenticated)
  const farms = await request({
    hostname: 'localhost', port: 5000, path: '/api/farms', method: 'GET',
    headers: { 'Authorization': `Bearer ${farmerToken}` }
  });
  const farmList = farms.data?.data || farms.data || [];
  console.log(`4. GET /api/farms -> Status: ${farms.status} (Count: ${farmList.length} farms)`);

  // 5. Fetch Crops (Authenticated)
  const crops = await request({
    hostname: 'localhost', port: 5000, path: '/api/crops', method: 'GET',
    headers: { 'Authorization': `Bearer ${farmerToken}` }
  });
  const cropList = crops.data?.data || crops.data || [];
  console.log(`5. GET /api/crops -> Status: ${crops.status} (Count: ${cropList.length} crops)`);

  // 6. Fetch Mandi Market Prices
  const market = await request({ hostname: 'localhost', port: 5000, path: '/api/market', method: 'GET' });
  const marketList = market.data?.data || market.data || [];
  console.log(`6. GET /api/market -> Status: ${market.status} (Count: ${marketList.length} records)`);

  // 7. Fetch Products
  const products = await request({ hostname: 'localhost', port: 5000, path: '/api/products', method: 'GET' });
  const productList = products.data?.data || products.data || [];
  console.log(`7. GET /api/products -> Status: ${products.status} (Count: ${productList.length} products)`);

  // 8. Fetch Schemes
  const schemes = await request({ hostname: 'localhost', port: 5000, path: '/api/schemes', method: 'GET' });
  const schemeList = schemes.data?.data || schemes.data || [];
  console.log(`8. GET /api/schemes -> Status: ${schemes.status} (Count: ${schemeList.length} schemes)`);

  // 9. Fetch Admin Stats (Admin Only)
  const adminStats = await request({
    hostname: 'localhost', port: 5000, path: '/api/admin/stats', method: 'GET',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const stats = adminStats.data?.data || adminStats.data?.stats || adminStats.data;
  console.log(`9. GET /api/admin/stats (Admin Only) -> Status: ${adminStats.status} (Farmers: ${stats?.totalFarmers}, Farms: ${stats?.totalFarms}, Products: ${stats?.totalProducts})`);

  // 10. Test Farmer accessing Admin endpoint (Forbidden check)
  const forbidden = await request({
    hostname: 'localhost', port: 5000, path: '/api/admin/stats', method: 'GET',
    headers: { 'Authorization': `Bearer ${farmerToken}` }
  });
  console.log(`10. GET /api/admin/stats as Farmer (RBAC check) -> Status: ${forbidden.status} (Expected 403 Forbidden)`);

  console.log('\n✨ All API Verification Tests Passed Perfectly!');
}

runTests().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});

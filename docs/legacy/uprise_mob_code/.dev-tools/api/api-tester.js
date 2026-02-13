#!/usr/bin/env node
/**
 * API Testing Utility
 * Comprehensive API endpoint testing for UPRISE platform
 */

const https = require('https');
const http = require('http');

class ApiTester {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.results = [];
    this.authToken = null;
  }

  async makeRequest(method, path, data = null, headers = {}) {
    const url = new URL(path, this.baseUrl);
    const options = {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'UPRISE-API-Tester/1.0',
        ...headers
      }
    };

    if (this.authToken) {
      options.headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    const client = url.protocol === 'https:' ? https : http;

    return new Promise((resolve, reject) => {
      const req = client.request(url, options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const json = body ? JSON.parse(body) : {};
            resolve({
              status: res.statusCode,
              headers: res.headers,
              body: json,
              raw: body
            });
          } catch (e) {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              body: null,
              raw: body,
              parseError: e.message
            });
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });

      req.setTimeout(10000, () => {
        req.abort();
        reject(new Error('Request timeout'));
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  async testEndpoint(name, method, path, expectedStatus = 200, data = null, authRequired = false) {
    const startTime = Date.now();
    
    try {
      console.log(`🔍 Testing: ${name}`);
      console.log(`   ${method.toUpperCase()} ${path}`);
      
      if (authRequired && !this.authToken) {
        throw new Error('Authentication required but no token available');
      }

      const response = await this.makeRequest(method, path, data);
      const duration = Date.now() - startTime;
      
      const success = response.status === expectedStatus;
      const result = {
        name,
        method,
        path,
        expectedStatus,
        actualStatus: response.status,
        success,
        duration,
        response: response.body,
        error: null
      };

      if (success) {
        console.log(`   ✅ ${response.status} (${duration}ms)`);
      } else {
        console.log(`   ❌ Expected ${expectedStatus}, got ${response.status} (${duration}ms)`);
        if (response.body && response.body.error) {
          console.log(`   📝 ${response.body.error}`);
        }
      }

      this.results.push(result);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.log(`   💥 Error: ${error.message} (${duration}ms)`);
      
      const result = {
        name,
        method,
        path,
        expectedStatus,
        actualStatus: null,
        success: false,
        duration,
        response: null,
        error: error.message
      };

      this.results.push(result);
      return result;
    }
  }

  async authenticate(email, password) {
    console.log('🔐 Authenticating...');
    
    const result = await this.testEndpoint(
      'User Authentication',
      'POST',
      '/api/auth/login',
      200,
      { email, password }
    );

    if (result.success && result.response && result.response.token) {
      this.authToken = result.response.token;
      console.log('   ✅ Authentication successful');
      return true;
    } else {
      console.log('   ❌ Authentication failed');
      return false;
    }
  }

  async runHealthChecks() {
    console.log('\n🏥 HEALTH CHECKS\n');

    await this.testEndpoint('Server Health', 'GET', '/health', 200);
    await this.testEndpoint('API Health', 'GET', '/api/health', 200);
    await this.testEndpoint('Database Health', 'GET', '/api/health/database', 200);
  }

  async runAuthTests() {
    console.log('\n🔐 AUTHENTICATION TESTS\n');

    // Test registration
    const testUser = {
      email: `test${Date.now()}@example.com`,
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User'
    };

    await this.testEndpoint(
      'User Registration',
      'POST', 
      '/api/auth/register',
      201,
      testUser
    );

    // Test login with created user
    await this.testEndpoint(
      'User Login',
      'POST',
      '/api/auth/login', 
      200,
      { email: testUser.email, password: testUser.password }
    );

    // Test invalid login
    await this.testEndpoint(
      'Invalid Login',
      'POST',
      '/api/auth/login',
      401,
      { email: testUser.email, password: 'wrongpassword' }
    );
  }

  async runUserTests() {
    console.log('\n👤 USER TESTS\n');

    // These require authentication
    await this.testEndpoint('Get User Profile', 'GET', '/api/users/profile', 200, null, true);
    await this.testEndpoint('Update User Profile', 'PUT', '/api/users/profile', 200, {
      firstName: 'Updated',
      lastName: 'Name'
    }, true);
  }

  async runSongTests() {
    console.log('\n🎵 SONG TESTS\n');

    await this.testEndpoint('Get Trending Songs', 'GET', '/api/songs/trending', 200);
    await this.testEndpoint('Search Songs', 'GET', '/api/songs/search?q=test', 200);
    await this.testEndpoint('Get Song by ID', 'GET', '/api/songs/1', 200);
  }

  async runStationTests() {
    console.log('\n📻 STATION TESTS\n');

    await this.testEndpoint('Get All Stations', 'GET', '/api/stations', 200);
    await this.testEndpoint('Get Station by ID', 'GET', '/api/stations/1', 200);
    await this.testEndpoint('Get Station Songs', 'GET', '/api/stations/1/songs', 200);
  }

  async runFairPlayTests() {
    console.log('\n⚖️ FAIR PLAY ALGORITHM TESTS\n');

    await this.testEndpoint('Get Fair Play Status', 'GET', '/api/fair-play/status', 200);
    await this.testEndpoint('Get User Play History', 'GET', '/api/fair-play/history', 200, null, true);
    await this.testEndpoint('Submit Play Event', 'POST', '/api/fair-play/play', 201, {
      songId: 1,
      duration: 180,
      location: { lat: 40.7128, lng: -74.0060 }
    }, true);
  }

  async runErrorTests() {
    console.log('\n🔥 ERROR HANDLING TESTS\n');

    await this.testEndpoint('404 Not Found', 'GET', '/api/nonexistent', 404);
    await this.testEndpoint('405 Method Not Allowed', 'DELETE', '/api/health', 405);
    await this.testEndpoint('Bad JSON', 'POST', '/api/auth/login', 400, '{invalid json}');
  }

  generateReport() {
    console.log('\n📊 TEST SUMMARY\n');

    const total = this.results.length;
    const passed = this.results.filter(r => r.success).length;
    const failed = total - passed;
    const avgDuration = this.results.reduce((sum, r) => sum + r.duration, 0) / total;

    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ❌`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    console.log(`Average Response Time: ${avgDuration.toFixed(0)}ms`);

    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => !r.success)
        .forEach(result => {
          console.log(`   ${result.name}: ${result.error || `Expected ${result.expectedStatus}, got ${result.actualStatus}`}`);
        });
    }

    // Performance summary
    const slowTests = this.results.filter(r => r.duration > 2000);
    if (slowTests.length > 0) {
      console.log('\n🐌 Slow Tests (>2s):');
      slowTests.forEach(test => {
        console.log(`   ${test.name}: ${test.duration}ms`);
      });
    }

    console.log('\n=== END REPORT ===\n');
  }

  async runFullSuite(authEmail, authPassword) {
    console.log('🚀 Starting UPRISE API Test Suite\n');
    console.log(`Target: ${this.baseUrl}`);
    console.log(`Time: ${new Date().toISOString()}`);

    try {
      await this.runHealthChecks();
      await this.runAuthTests();

      // If auth provided, test authenticated endpoints
      if (authEmail && authPassword) {
        const authSuccess = await this.authenticate(authEmail, authPassword);
        if (authSuccess) {
          await this.runUserTests();
          await this.runFairPlayTests();
        }
      }

      await this.runSongTests();
      await this.runStationTests();
      await this.runErrorTests();

      this.generateReport();
    } catch (error) {
      console.error('💥 Test suite failed:', error.message);
    }
  }
}

// CLI Interface
async function main() {
  const baseUrl = process.argv[2] || 'http://localhost:3000';
  const authEmail = process.argv[3];
  const authPassword = process.argv[4];

  const tester = new ApiTester(baseUrl);

  const command = process.argv[2];

  if (command === 'health') {
    await tester.runHealthChecks();
    tester.generateReport();
  } else if (command === 'auth') {
    await tester.runAuthTests();
    tester.generateReport();
  } else if (command === 'songs') {
    await tester.runSongTests();
    tester.generateReport();
  } else if (command === 'stations') {
    await tester.runStationTests();
    tester.generateReport();
  } else if (command === 'fair-play') {
    await tester.runFairPlayTests();
    tester.generateReport();
  } else if (baseUrl && (baseUrl.startsWith('http://') || baseUrl.startsWith('https://'))) {
    // Full suite with custom URL
    await tester.runFullSuite(authEmail, authPassword);
  } else {
    console.log('\nUPRISE API Tester');
    console.log('\nUsage:');
    console.log('  node api-tester.js [base_url] [email] [password]  - Run full test suite');
    console.log('  node api-tester.js health                         - Run health checks only');
    console.log('  node api-tester.js auth                           - Run auth tests only');
    console.log('  node api-tester.js songs                          - Run song tests only');
    console.log('  node api-tester.js stations                       - Run station tests only');
    console.log('  node api-tester.js fair-play                      - Run Fair Play tests only');
    console.log('\nExamples:');
    console.log('  node api-tester.js http://localhost:3000');
    console.log('  node api-tester.js https://api.uprise.com test@example.com password123');
    console.log('  node api-tester.js health');
    console.log();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ApiTester;
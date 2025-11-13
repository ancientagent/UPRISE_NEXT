
// generated-by: DeepAgent on 2025-11-13
/**
 * Socket.IO Smoke Test Client
 * 
 * Comprehensive smoke test for the Socket.IO server with JWT authentication.
 * Tests both main namespace (/) and community namespaces (/community/:id).
 * 
 * Usage:
 *   pnpm socket:smoke-test
 *   pnpm socket:smoke-test --url http://localhost:4001
 *   pnpm socket:smoke-test --community my-community
 * 
 * Exit codes:
 *   0 - All tests passed
 *   1 - One or more tests failed
 */

import { io, Socket } from 'socket.io-client';
import { generateTestToken, generateMultipleTestTokens } from './utils/generate-test-token';

// Configuration
const SOCKET_URL = process.env.SOCKET_URL || process.argv.find(arg => arg.startsWith('--url='))?.split('=')[1] || 'http://localhost:4001';
const TEST_COMMUNITY = process.env.TEST_COMMUNITY || process.argv.find(arg => arg.startsWith('--community='))?.split('=')[1] || 'test-community';
const TIMEOUT_MS = 10000; // 10 seconds per test
const VERBOSE = process.argv.includes('--verbose') || process.argv.includes('-v');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

// Test results tracking
interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

const results: TestResult[] = [];

// Utility functions
function log(message: string, color: keyof typeof colors = 'reset'): void {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logVerbose(message: string): void {
  if (VERBOSE) {
    log(`  ${message}`, 'gray');
  }
}

function logTest(name: string): void {
  log(`\n🧪 ${name}`, 'cyan');
}

function logSuccess(message: string): void {
  log(`  ✅ ${message}`, 'green');
}

function logError(message: string): void {
  log(`  ❌ ${message}`, 'red');
}

function logWarning(message: string): void {
  log(`  ⚠️  ${message}`, 'yellow');
}

function recordResult(name: string, passed: boolean, duration: number, error?: string): void {
  results.push({ name, passed, duration, error });
}

function createTimeout(ms: number, testName: string): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Test timeout after ${ms}ms: ${testName}`));
    }, ms);
  });
}

// Test functions
async function testMainNamespaceConnection(): Promise<boolean> {
  const testName = 'Main Namespace Connection';
  logTest(testName);
  const startTime = Date.now();

  return new Promise<boolean>((resolve) => {
    const token = generateTestToken({
      userId: 'smoke-test-user',
      email: 'smoke@test.local',
      username: 'smoketester',
    });

    logVerbose(`Generated test token for user: smoketester`);
    logVerbose(`Connecting to: ${SOCKET_URL}`);

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: false,
    });

    const timeout = setTimeout(() => {
      socket.disconnect();
      const duration = Date.now() - startTime;
      logError('Connection timeout');
      recordResult(testName, false, duration, 'Connection timeout');
      resolve(false);
    }, TIMEOUT_MS);

    socket.on('connect', () => {
      clearTimeout(timeout);
      const duration = Date.now() - startTime;
      logSuccess(`Connected successfully (${duration}ms)`);
      logVerbose(`Socket ID: ${socket.id}`);
      
      socket.disconnect();
      recordResult(testName, true, duration);
      resolve(true);
    });

    socket.on('connect_error', (error) => {
      clearTimeout(timeout);
      const duration = Date.now() - startTime;
      logError(`Connection failed: ${error.message}`);
      recordResult(testName, false, duration, error.message);
      resolve(false);
    });
  });
}

async function testAuthenticationRejection(): Promise<boolean> {
  const testName = 'Authentication Rejection (No Token)';
  logTest(testName);
  const startTime = Date.now();

  return new Promise<boolean>((resolve) => {
    logVerbose(`Attempting connection without token`);

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: false,
    });

    const timeout = setTimeout(() => {
      socket.disconnect();
      const duration = Date.now() - startTime;
      logError('Expected rejection but got timeout');
      recordResult(testName, false, duration, 'Expected auth rejection');
      resolve(false);
    }, TIMEOUT_MS);

    socket.on('connect', () => {
      clearTimeout(timeout);
      const duration = Date.now() - startTime;
      logError('Connection succeeded when it should have been rejected');
      socket.disconnect();
      recordResult(testName, false, duration, 'Authentication should have been rejected');
      resolve(false);
    });

    socket.on('connect_error', (error) => {
      clearTimeout(timeout);
      const duration = Date.now() - startTime;
      
      if (error.message.includes('Authentication token required') || error.message.includes('authentication')) {
        logSuccess(`Correctly rejected: ${error.message}`);
        recordResult(testName, true, duration);
        resolve(true);
      } else {
        logError(`Wrong error: ${error.message}`);
        recordResult(testName, false, duration, `Unexpected error: ${error.message}`);
        resolve(false);
      }
    });
  });
}

async function testPingPong(): Promise<boolean> {
  const testName = 'Ping/Pong Health Check';
  logTest(testName);
  const startTime = Date.now();

  return new Promise<boolean>((resolve) => {
    const token = generateTestToken();
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: false,
    });

    const timeout = setTimeout(() => {
      socket.disconnect();
      const duration = Date.now() - startTime;
      logError('Ping/pong timeout');
      recordResult(testName, false, duration, 'Ping/pong timeout');
      resolve(false);
    }, TIMEOUT_MS);

    socket.on('connect', () => {
      logVerbose(`Connected, sending ping...`);
      socket.emit('ping');
    });

    socket.on('pong', (data) => {
      clearTimeout(timeout);
      const duration = Date.now() - startTime;
      logSuccess(`Pong received (${duration}ms)`);
      logVerbose(`Pong data: ${JSON.stringify(data)}`);
      
      socket.disconnect();
      recordResult(testName, true, duration);
      resolve(true);
    });

    socket.on('connect_error', (error) => {
      clearTimeout(timeout);
      const duration = Date.now() - startTime;
      logError(`Connection failed: ${error.message}`);
      recordResult(testName, false, duration, error.message);
      resolve(false);
    });
  });
}

async function testPresenceUpdate(): Promise<boolean> {
  const testName = 'Presence Update Event';
  logTest(testName);
  const startTime = Date.now();

  return new Promise<boolean>((resolve) => {
    const token = generateTestToken();
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: false,
    });

    const timeout = setTimeout(() => {
      socket.disconnect();
      const duration = Date.now() - startTime;
      logError('Presence update timeout');
      recordResult(testName, false, duration, 'Presence update timeout');
      resolve(false);
    }, TIMEOUT_MS);

    socket.on('connect', () => {
      logVerbose(`Connected, updating presence to 'online'...`);
      socket.emit('presence:update', { status: 'online' });
    });

    socket.on('presence:changed', (data) => {
      clearTimeout(timeout);
      const duration = Date.now() - startTime;
      logSuccess(`Presence updated (${duration}ms)`);
      logVerbose(`Presence data: ${JSON.stringify(data)}`);
      
      socket.disconnect();
      recordResult(testName, true, duration);
      resolve(true);
    });

    socket.on('connect_error', (error) => {
      clearTimeout(timeout);
      const duration = Date.now() - startTime;
      logError(`Connection failed: ${error.message}`);
      recordResult(testName, false, duration, error.message);
      resolve(false);
    });
  });
}

async function testCommunityNamespaceConnection(): Promise<boolean> {
  const testName = `Community Namespace Connection (${TEST_COMMUNITY})`;
  logTest(testName);
  const startTime = Date.now();

  return new Promise<boolean>((resolve) => {
    const token = generateTestToken({
      userId: 'community-test-user',
      email: 'community@test.local',
      username: 'communitytester',
    });

    const communityUrl = `${SOCKET_URL}/community/${TEST_COMMUNITY}`;
    logVerbose(`Connecting to: ${communityUrl}`);

    const socket = io(communityUrl, {
      auth: { token },
      transports: ['websocket'],
      reconnection: false,
    });

    const timeout = setTimeout(() => {
      socket.disconnect();
      const duration = Date.now() - startTime;
      logError('Community connection timeout');
      recordResult(testName, false, duration, 'Connection timeout');
      resolve(false);
    }, TIMEOUT_MS);

    socket.on('connect', () => {
      clearTimeout(timeout);
      const duration = Date.now() - startTime;
      logSuccess(`Connected to community namespace (${duration}ms)`);
      logVerbose(`Socket ID: ${socket.id}`);
      
      socket.disconnect();
      recordResult(testName, true, duration);
      resolve(true);
    });

    socket.on('connect_error', (error) => {
      clearTimeout(timeout);
      const duration = Date.now() - startTime;
      logError(`Connection failed: ${error.message}`);
      recordResult(testName, false, duration, error.message);
      resolve(false);
    });
  });
}

async function testCommunityJoinEvent(): Promise<boolean> {
  const testName = 'Community Join Event';
  logTest(testName);
  const startTime = Date.now();

  return new Promise<boolean>((resolve) => {
    const token = generateTestToken();
    const communityUrl = `${SOCKET_URL}/community/${TEST_COMMUNITY}`;

    const socket = io(communityUrl, {
      auth: { token },
      transports: ['websocket'],
      reconnection: false,
    });

    const timeout = setTimeout(() => {
      socket.disconnect();
      const duration = Date.now() - startTime;
      logError('Join event timeout');
      recordResult(testName, false, duration, 'Join event timeout');
      resolve(false);
    }, TIMEOUT_MS);

    socket.on('connect', () => {
      logVerbose(`Connected, sending join-community event...`);
      socket.emit('join-community', {
        communityId: TEST_COMMUNITY,
        location: { lat: 37.7749, lng: -122.4194 },
      });
    });

    socket.on('join-community:success', (data) => {
      clearTimeout(timeout);
      const duration = Date.now() - startTime;
      logSuccess(`Joined community successfully (${duration}ms)`);
      logVerbose(`Join data: ${JSON.stringify(data)}`);
      
      socket.disconnect();
      recordResult(testName, true, duration);
      resolve(true);
    });

    socket.on('connect_error', (error) => {
      clearTimeout(timeout);
      const duration = Date.now() - startTime;
      logError(`Connection failed: ${error.message}`);
      recordResult(testName, false, duration, error.message);
      resolve(false);
    });
  });
}

async function testCommunityMessage(): Promise<boolean> {
  const testName = 'Community Message Event';
  logTest(testName);
  const startTime = Date.now();

  return new Promise<boolean>((resolve) => {
    const token = generateTestToken({
      userId: 'message-test-user',
      username: 'messagetester',
    });
    const communityUrl = `${SOCKET_URL}/community/${TEST_COMMUNITY}`;

    const socket = io(communityUrl, {
      auth: { token },
      transports: ['websocket'],
      reconnection: false,
    });

    const timeout = setTimeout(() => {
      socket.disconnect();
      const duration = Date.now() - startTime;
      logError('Message event timeout');
      recordResult(testName, false, duration, 'Message event timeout');
      resolve(false);
    }, TIMEOUT_MS);

    socket.on('connect', () => {
      logVerbose(`Connected, sending community message...`);
      socket.emit('community-message', {
        content: 'Hello from smoke test!',
        type: 'text',
      });
    });

    socket.on('community-message:new', (data) => {
      clearTimeout(timeout);
      const duration = Date.now() - startTime;
      
      if (data.content === 'Hello from smoke test!' && data.userId === 'message-test-user') {
        logSuccess(`Message sent and received (${duration}ms)`);
        logVerbose(`Message data: ${JSON.stringify(data)}`);
        
        socket.disconnect();
        recordResult(testName, true, duration);
        resolve(true);
      } else {
        logError('Message content or userId mismatch');
        socket.disconnect();
        recordResult(testName, false, duration, 'Message validation failed');
        resolve(false);
      }
    });

    socket.on('connect_error', (error) => {
      clearTimeout(timeout);
      const duration = Date.now() - startTime;
      logError(`Connection failed: ${error.message}`);
      recordResult(testName, false, duration, error.message);
      resolve(false);
    });
  });
}

async function testTypingIndicators(): Promise<boolean> {
  const testName = 'Typing Indicators';
  logTest(testName);
  const startTime = Date.now();

  return new Promise<boolean>((resolve) => {
    const tokens = generateMultipleTestTokens(2);
    const communityUrl = `${SOCKET_URL}/community/${TEST_COMMUNITY}`;

    const socket1 = io(communityUrl, {
      auth: { token: tokens[0].token },
      transports: ['websocket'],
      reconnection: false,
    });

    const socket2 = io(communityUrl, {
      auth: { token: tokens[1].token },
      transports: ['websocket'],
      reconnection: false,
    });

    let receivedTyping = false;

    const timeout = setTimeout(() => {
      socket1.disconnect();
      socket2.disconnect();
      const duration = Date.now() - startTime;
      
      if (receivedTyping) {
        logSuccess(`Typing indicator worked (${duration}ms)`);
        recordResult(testName, true, duration);
        resolve(true);
      } else {
        logError('Typing indicator not received');
        recordResult(testName, false, duration, 'Typing indicator timeout');
        resolve(false);
      }
    }, TIMEOUT_MS);

    let connectedCount = 0;

    const checkBothConnected = () => {
      connectedCount++;
      if (connectedCount === 2) {
        logVerbose('Both sockets connected, starting typing...');
        socket1.emit('typing:start');
      }
    };

    socket1.on('connect', checkBothConnected);
    socket2.on('connect', checkBothConnected);

    socket2.on('typing:user', (data) => {
      if (data.username === tokens[0].user.username && data.typing === true) {
        clearTimeout(timeout);
        const duration = Date.now() - startTime;
        receivedTyping = true;
        
        logSuccess(`Typing indicator received (${duration}ms)`);
        logVerbose(`Typing data: ${JSON.stringify(data)}`);
        
        socket1.disconnect();
        socket2.disconnect();
        recordResult(testName, true, duration);
        resolve(true);
      }
    });

    socket1.on('connect_error', (error) => {
      clearTimeout(timeout);
      const duration = Date.now() - startTime;
      logError(`Socket 1 connection failed: ${error.message}`);
      socket2.disconnect();
      recordResult(testName, false, duration, error.message);
      resolve(false);
    });

    socket2.on('connect_error', (error) => {
      clearTimeout(timeout);
      const duration = Date.now() - startTime;
      logError(`Socket 2 connection failed: ${error.message}`);
      socket1.disconnect();
      recordResult(testName, false, duration, error.message);
      resolve(false);
    });
  });
}

// Main execution
async function runAllTests(): Promise<void> {
  log('\n╔════════════════════════════════════════════╗', 'blue');
  log('║  Socket.IO Smoke Test Suite               ║', 'blue');
  log('╚════════════════════════════════════════════╝', 'blue');
  log(`\n📍 Server URL: ${SOCKET_URL}`, 'cyan');
  log(`📍 Test Community: ${TEST_COMMUNITY}`, 'cyan');
  log(`📍 Timeout: ${TIMEOUT_MS}ms per test\n`, 'cyan');

  const tests = [
    testMainNamespaceConnection,
    testAuthenticationRejection,
    testPingPong,
    testPresenceUpdate,
    testCommunityNamespaceConnection,
    testCommunityJoinEvent,
    testCommunityMessage,
    testTypingIndicators,
  ];

  for (const test of tests) {
    try {
      await test();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logError(`Test crashed: ${errorMessage}`);
      recordResult(test.name, false, 0, errorMessage);
    }
  }

  // Print summary
  log('\n╔════════════════════════════════════════════╗', 'blue');
  log('║  Test Summary                              ║', 'blue');
  log('╚════════════════════════════════════════════╝', 'blue');

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;
  const avgDuration = Math.round(results.reduce((sum, r) => sum + r.duration, 0) / results.length);

  log(`\n📊 Results: ${passed}/${total} passed`, passed === total ? 'green' : 'yellow');
  log(`⏱️  Average duration: ${avgDuration}ms`, 'cyan');

  if (failed > 0) {
    log(`\n❌ Failed tests (${failed}):`, 'red');
    results.filter(r => !r.passed).forEach(r => {
      log(`   • ${r.name}`, 'red');
      if (r.error) {
        log(`     Error: ${r.error}`, 'gray');
      }
    });
  }

  if (passed === total) {
    log('\n✅ All tests passed!', 'green');
    process.exit(0);
  } else {
    log(`\n❌ ${failed} test(s) failed`, 'red');
    process.exit(1);
  }
}

// Handle script execution
if (require.main === module) {
  runAllTests().catch((error) => {
    logError(`Fatal error: ${error.message}`);
    console.error(error);
    process.exit(1);
  });
}

export { runAllTests };

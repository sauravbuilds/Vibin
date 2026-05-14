const { spawn } = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';
const baseEnv = makeEnv({});
const serverEnv = { ...baseEnv, PORT: process.env.API_PORT || '8787' };
const clientEnv = { ...baseEnv, PORT: process.env.CLIENT_PORT || '3000', BROWSER: process.env.BROWSER || 'none' };
const reactStartScript = path.join(__dirname, '..', 'node_modules', 'react-scripts', 'scripts', 'start.js');

function makeEnv(overrides) {
  const next = {};
  const seen = new Set();

  for (const [key, value] of Object.entries(process.env)) {
    const normalized = isWindows ? key.toLowerCase() : key;
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    next[key] = value;
  }

  return { ...next, ...overrides };
}

const children = [
  spawn(process.execPath, ['server.js'], {
    stdio: 'inherit',
    env: serverEnv,
  }),
  spawn(process.execPath, [reactStartScript], {
    stdio: 'inherit',
    env: clientEnv,
  }),
];

function shutdown(code = 0) {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  process.exit(code);
}

for (const child of children) {
  child.on('exit', code => {
    if (code && code !== 0) shutdown(code);
  });
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

const { spawn } = require('child_process');
const path = require('path');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

console.log('\n=========================================');
console.log('     Starting JPP Mart (Server + Client)');
console.log('=========================================');
console.log('➜ Frontend Store: http://localhost:5173');
console.log('➜ Backend API:    http://localhost:5000');
console.log('=========================================\n');

function runProcess(name, prefixColor, args, cwd) {
  const child = spawn(npmCmd, args, {
    cwd: path.resolve(__dirname, cwd),
    shell: true,
    stdio: ['inherit', 'pipe', 'pipe'],
    env: { ...process.env, FORCE_COLOR: '1' },
  });

  child.stdout.on('data', (data) => {
    const lines = data.toString().trimEnd().split('\n');
    lines.forEach((line) => {
      console.log(`${prefixColor}[${name}]\x1b[0m ${line}`);
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().trimEnd().split('\n');
    lines.forEach((line) => {
      console.error(`${prefixColor}[${name}]\x1b[0m ${line}`);
    });
  });

  child.on('exit', (code, signal) => {
    console.log(`${prefixColor}[${name}]\x1b[0m Process exited with code ${code ?? signal}`);
  });

  return child;
}

// Cyan for Server, Green for Client
const server = runProcess('SERVER', '\x1b[36m', ['run', 'dev'], 'server');
const client = runProcess('CLIENT', '\x1b[32m', ['run', 'dev'], 'client');

function cleanup() {
  console.log('\nStopping all services...');
  if (isWin) {
    if (server.pid) spawn('taskkill', ['/pid', server.pid.toString(), '/T', '/F']);
    if (client.pid) spawn('taskkill', ['/pid', client.pid.toString(), '/T', '/F']);
  } else {
    server.kill('SIGINT');
    client.kill('SIGINT');
  }
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

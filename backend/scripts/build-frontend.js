const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const backendRoot = path.resolve(__dirname, '..');
const frontendRoot = path.resolve(backendRoot, '..', 'frontend');
const frontendDist = path.join(frontendRoot, 'dist');
const backendDist = path.join(backendRoot, 'dist');
const entrypointFile = path.join(backendDist, 'index.js');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

if (!fs.existsSync(path.join(frontendRoot, 'node_modules'))) {
  const installResult = spawnSync(npmCommand, ['ci'], {
    cwd: frontendRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (installResult.status !== 0) {
    process.exit(installResult.status || 1);
  }
}

const buildResult = spawnSync(npmCommand, ['run', 'build'], {
  cwd: frontendRoot,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (buildResult.status !== 0) {
  process.exit(buildResult.status || 1);
}

fs.rmSync(backendDist, { recursive: true, force: true });
fs.cpSync(frontendDist, backendDist, { recursive: true });

fs.writeFileSync(
  entrypointFile,
  `const express = require('express');
const path = require('path');

const app = express();
const distDir = __dirname;

app.use(express.static(distDir));

app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

module.exports = app;
`
);
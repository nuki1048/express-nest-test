/**
 * Build Output API v3 - creates .vercel/output structure for Vercel deployment
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = path.join(__dirname, '..');
const OUTPUT = path.join(ROOT, '.vercel', 'output');
const SHARP_VERSION = '0.33.5';

const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#0ea5e9" rx="4"/><path fill="white" d="M16 8l-8 6v10h6v-6h4v6h6V14z"/></svg>`;

function rmrf(dir: string) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
}

function mkdirp(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function ensureSharpLinuxBinary(funcDir: string): void {
  if (process.platform === 'linux') return;
  const nm = path.join(funcDir, 'node_modules');
  mkdirp(path.join(nm, '@img'));
  const packDir = path.join(ROOT, '.vercel', 'sharp-pack');
  mkdirp(packDir);
  execSync(`npm pack @img/sharp-linux-x64@${SHARP_VERSION}`, {
    cwd: packDir,
    stdio: 'inherit',
  });
  const tarball = fs.readdirSync(packDir).find((f) => f.endsWith('.tgz'))!;
  execSync(`tar -xzf "${path.join(packDir, tarball)}" -C "${packDir}"`, {
    stdio: 'inherit',
  });
  fs.cpSync(
    path.join(packDir, 'package'),
    path.join(nm, '@img', 'sharp-linux-x64'),
    { recursive: true },
  );
  rmrf(packDir);
}

function main() {
  console.log('Building for Vercel Build Output API v3...');

  // Phase 1: Build admin SPA
  console.log('Building admin...');
  execSync('yarn workspace admin run build:skip-check', {
    cwd: ROOT,
    stdio: 'inherit',
  });

  // Phase 2: Build Nest API
  console.log('Building Nest...');
  execSync('prisma generate && nest build && cp -r src/generated dist/', {
    cwd: ROOT,
    stdio: 'inherit',
  });

  // Phase 3: Static output (admin + favicon)
  rmrf(OUTPUT);
  mkdirp(path.join(OUTPUT, 'static', 'admin'));

  const adminDist = path.join(ROOT, 'admin', 'dist');
  if (!fs.existsSync(path.join(adminDist, 'index.html'))) {
    throw new Error('Admin build not found at admin/dist');
  }
  fs.cpSync(adminDist, path.join(OUTPUT, 'static', 'admin'), {
    recursive: true,
  });

  fs.writeFileSync(path.join(OUTPUT, 'static', 'favicon.svg'), FAVICON_SVG);

  // Phase 4: API function (dist + node_modules + sharp)
  console.log('Creating API function...');
  const funcFinal = path.join(OUTPUT, 'functions', 'api.func');
  if (fs.existsSync(funcFinal)) rmrf(funcFinal);
  mkdirp(funcFinal);

  fs.cpSync(path.join(ROOT, 'dist'), path.join(funcFinal, 'dist'), {
    recursive: true,
  });
  fs.cpSync(
    path.join(ROOT, 'node_modules'),
    path.join(funcFinal, 'node_modules'),
    { recursive: true },
  );

  const pkg = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8'),
  ) as { name: string; dependencies: Record<string, string> };
  const apiDeps: Record<string, string> = { ...pkg.dependencies };
  ['react', 'react-dom', 'react-dropzone', 'prisma'].forEach(
    (k) => delete apiDeps[k],
  );
  if (process.platform === 'linux') {
    apiDeps['@img/sharp-linux-x64'] = SHARP_VERSION;
  }

  fs.writeFileSync(
    path.join(funcFinal, 'package.json'),
    JSON.stringify({ name: pkg.name, dependencies: apiDeps }, null, 2),
  );
  execSync('npm prune --production', { cwd: funcFinal, stdio: 'inherit' });

  ensureSharpLinuxBinary(funcFinal);

  // Phase 5: Function config (handler, vc-config, routes)
  fs.writeFileSync(
    path.join(funcFinal, 'index.js'),
    `const m = require('./dist/main.js');
module.exports = m.default || m;
`,
  );

  fs.writeFileSync(
    path.join(funcFinal, '.vc-config.json'),
    JSON.stringify(
      {
        runtime: 'nodejs22.x',
        handler: 'index.js',
        maxDuration: 300,
        launcherType: 'Nodejs',
      },
      null,
      2,
    ),
  );

  fs.writeFileSync(
    path.join(OUTPUT, 'config.json'),
    JSON.stringify(
      {
        version: 3,
        routes: [
          { handle: 'filesystem' },
          { src: '/', dest: '/admin/index.html' },
          { src: '/admin(.*)', dest: '/admin/index.html' },
          { src: '/favicon.ico', dest: '/favicon.svg' },
          { src: '/api/(.*)', dest: '/api' },
        ],
      },
      null,
      2,
    ),
  );

  console.log('Build complete. Output at .vercel/output');
}

main();

/**
 * Build Output API v3 - creates .vercel/output structure for Vercel deployment
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { FAVICON_SVG } from '../src/constants/favicon';

const ROOT = path.join(__dirname, '..');
const OUTPUT = path.join(ROOT, '.vercel', 'output');
const SHARP_VERSION = '0.33.5';

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

/** Keep only sharp-linux-x64; remove all other platform binaries to save ~150MB+ */
function pruneSharpPlatformBinaries(funcDir: string): void {
  const imgDir = path.join(funcDir, 'node_modules', '@img');
  if (!fs.existsSync(imgDir)) return;
  const keep = new Set(['sharp-linux-x64', 'sharp-libvips-linux-x64']);
  for (const name of fs.readdirSync(imgDir)) {
    if (!keep.has(name)) {
      rmrf(path.join(imgDir, name));
    }
  }
}

/** Remove unnecessary files from node_modules to reduce bundle size */
function pruneNodeModules(funcDir: string): void {
  const nm = path.join(funcDir, 'node_modules');
  if (!fs.existsSync(nm)) return;
  const dirsToDelete = ['docs', 'doc', 'test', 'tests', 'example', 'examples'];
  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          if (dirsToDelete.some((d) => name.toLowerCase() === d)) {
            rmrf(full);
          } else {
            walk(full);
          }
        } else if (stat.isFile() && name.endsWith('.map')) {
          fs.unlinkSync(full);
        }
      } catch {
        /* ignore */
      }
    }
  }
  walk(nm);
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
  pruneSharpPlatformBinaries(funcFinal);
  pruneNodeModules(funcFinal);

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

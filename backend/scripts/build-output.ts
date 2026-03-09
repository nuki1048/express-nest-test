/**
 * Build Output API v3 - creates .vercel/output structure for Vercel deployment
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = path.join(__dirname, '..');
const OUTPUT = path.join(ROOT, '.vercel', 'output');

const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#0ea5e9" rx="4"/><path fill="white" d="M16 8l-8 6v10h6v-6h4v6h6V14z"/></svg>`;

function rmrf(dir: string) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true });
  }
}

function mkdirp(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function main() {
  console.log('Building for Vercel Build Output API v3...');

  // 1. Build admin
  console.log('Building admin...');
  execSync('yarn workspace admin run build:skip-check', {
    cwd: ROOT,
    stdio: 'inherit',
  });

  // 2. Build Nest
  console.log('Building Nest...');
  execSync('prisma generate && nest build && cp -r src/generated dist/', {
    cwd: ROOT,
    stdio: 'inherit',
  });

  // 3. Clean and create output structure
  rmrf(OUTPUT);
  mkdirp(path.join(OUTPUT, 'static', 'admin'));

  // 4. Copy admin to static
  console.log('Copying admin to static...');
  const adminDist = path.join(ROOT, 'admin', 'dist');
  if (!fs.existsSync(path.join(adminDist, 'index.html'))) {
    throw new Error('Admin build not found at admin/dist');
  }
  const staticAdmin = path.join(OUTPUT, 'static', 'admin');
  for (const name of fs.readdirSync(adminDist)) {
    const src = path.join(adminDist, name);
    const dest = path.join(staticAdmin, name);
    if (fs.statSync(src).isDirectory()) {
      fs.cpSync(src, dest, { recursive: true });
    } else {
      fs.copyFileSync(src, dest);
    }
  }

  // 5. Create favicon
  fs.writeFileSync(path.join(OUTPUT, 'static', 'favicon.svg'), FAVICON_SVG);

  // 6. Create function: copy dist + node_modules (ncc breaks sharp native binaries)
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
  );
  const apiDeps = { ...pkg.dependencies };
  delete apiDeps.react;
  delete apiDeps['react-dom'];
  delete apiDeps['react-dropzone'];
  delete apiDeps.prisma; // CLI not needed at runtime, only @prisma/client
  const funcPkg = { name: pkg.name, dependencies: apiDeps };
  fs.writeFileSync(
    path.join(funcFinal, 'package.json'),
    JSON.stringify(funcPkg, null, 2),
  );
  execSync('npm prune --production', { cwd: funcFinal, stdio: 'inherit' });

  // 7. Create handler wrapper
  fs.writeFileSync(
    path.join(funcFinal, 'index.js'),
    `const m = require('./dist/main.js');
module.exports = m.default || m;
`,
  );

  // 8. Create .vc-config.json
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

  // 9. Create config.json
  const config = {
    version: 3,
    routes: [
      { handle: 'filesystem' },
      { src: '/', dest: '/admin/index.html' },
      { src: '/admin', dest: '/admin/index.html' },
      { src: '/admin/', dest: '/admin/index.html' },
      { src: '/admin/login', dest: '/admin/index.html' },
      { src: '/admin/apartments', dest: '/admin/index.html' },
      { src: '/admin/apartments/(.*)', dest: '/admin/index.html' },
      { src: '/admin/blog-posts', dest: '/admin/index.html' },
      { src: '/admin/blog-posts/(.*)', dest: '/admin/index.html' },
      { src: '/admin/contacts', dest: '/admin/index.html' },
      { src: '/admin/contact-form-submissions', dest: '/admin/index.html' },
      {
        src: '/admin/contact-form-submissions/(.*)',
        dest: '/admin/index.html',
      },
      { src: '/favicon.ico', dest: '/favicon.svg' },
      { src: '/api/(.*)', dest: '/api' },
    ],
  };

  fs.writeFileSync(
    path.join(OUTPUT, 'config.json'),
    JSON.stringify(config, null, 2),
  );

  console.log('Build complete. Output at .vercel/output');
}

main();

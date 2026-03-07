import { mkdir, copyFile } from 'fs/promises';
import { join } from 'path';

/**
 * Copies AdminJS bundle files to dist/public for serverless deployment.
 * Uses pre-built .adminjs/bundle.js (components) + AdminJS core assets.
 */
void (async () => {
  const projectRoot = join(__dirname, '..');
  const destDir = join(projectRoot, 'dist', 'public');
  await mkdir(destDir, { recursive: true });

  const copies = [
    [
      join(projectRoot, '.adminjs', 'bundle.js'),
      join(destDir, 'components.bundle.js'),
    ],
    [
      join(
        projectRoot,
        'node_modules',
        'adminjs',
        'lib',
        'frontend',
        'assets',
        'scripts',
        'app-bundle.production.js',
      ),
      join(destDir, 'app.bundle.js'),
    ],
    [
      join(
        projectRoot,
        'node_modules',
        'adminjs',
        'lib',
        'frontend',
        'assets',
        'scripts',
        'global-bundle.production.js',
      ),
      join(destDir, 'global.bundle.js'),
    ],
    [
      join(
        projectRoot,
        'node_modules',
        '@adminjs',
        'design-system',
        'bundle.production.js',
      ),
      join(destDir, 'design-system.bundle.js'),
    ],
  ];

  await Promise.all(copies.map(([src, dest]) => copyFile(src, dest)));
  console.log('✨ Successfully copied AdminJS bundle files to dist/public ✨');
})();

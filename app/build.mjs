import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = dirname(fileURLToPath(import.meta.url));
const output = join(root, 'dist');
const checks = ['server.mjs', 'assets/js/cms.js', 'assets/js/admin.js'];

for (const file of checks) {
  const checked = spawnSync(process.execPath, ['--check', file], { cwd: root, stdio: 'inherit' });
  if (checked.status !== 0) process.exit(checked.status || 1);
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const include = ['index.html', '404.html', 'robots.txt', 'sitemap.xml', '.htaccess', 'assets', 'about', 'blog', 'contact', 'portfolio', 'services', 'admin'];
for (const item of include) await cp(join(root, item), join(output, item), { recursive: true });
console.log(`Built static delivery files in ${output}`);

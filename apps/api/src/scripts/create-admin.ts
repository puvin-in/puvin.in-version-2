import { readFileSync } from 'node:fs';
import { loadEnv } from '../config/env.js';
import { connectDatabase } from '../core/db.js';
import { createLogger } from '../core/logger.js';
import { credentials, passwordHash, User } from '../modules/cms/auth.js';

const email = process.argv[2];
const name = process.argv[3]?.trim();
if (!email || !name || name.length > 120 || process.stdin.isTTY) {
  console.error('Usage: pass the password via stdin and supply email and display name as arguments.');
  process.exit(1);
}
const env = loadEnv();
const db = await connectDatabase(env, createLogger(env));
try {
  const input = credentials.parse({ email, password: readFileSync(0, 'utf8').replace(/\r?\n$/, '') });
  await User.init();
  const result = await User.updateOne(
    { email: input.email, owner: true },
    { $set: { name, active: true, passwordHash: await passwordHash(input.password) }, $inc: { version: 1 } },
    { upsert: true },
  );
  console.log(result.upsertedCount ? 'Owner created' : 'Owner password updated');
} catch {
  console.error('Owner setup failed. Use a valid email, at least 12 password characters, and an email not used by a staff account.');
  process.exitCode = 1;
} finally {
  await db.close();
}

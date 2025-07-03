// lib/db/db3.ts
import { createClient } from "@libsql/client"; // ✅ Correcto (NO uses "web")

import { drizzle } from 'drizzle-orm/libsql';

const client = createClient({
  url: process.env.TEST_DB_URL!,
  authToken: process.env.TEST_DB_TOKEN!,
});

const db = drizzle(client);

export default db;

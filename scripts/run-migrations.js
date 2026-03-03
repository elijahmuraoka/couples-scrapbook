#!/usr/bin/env node
/**
 * Run pending Supabase migrations directly against the database.
 * Uses SUPABASE_DB_URL from .env (or .env.local).
 * 
 * Usage: node scripts/run-migrations.js
 */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
// Load .env manually (no dotenv dependency needed)
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
        const match = line.match(/^([^#=]+)=["']?(.+?)["']?$/);
        if (match && !process.env[match[1].trim()]) {
            process.env[match[1].trim()] = match[2];
        }
    }
}

const DB_URL = process.env.SUPABASE_DB_URL;
if (!DB_URL) {
    console.error('ERROR: SUPABASE_DB_URL not set in .env');
    process.exit(1);
}

async function run() {
    const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
    await client.connect();
    console.log('Connected to Supabase database.');

    const migrationsDir = path.resolve(__dirname, '..', 'supabase', 'migrations');
    const files = fs.readdirSync(migrationsDir)
        .filter(f => f.endsWith('.sql'))
        .sort();

    for (const file of files) {
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8').trim();
        if (!sql) continue;

        console.log(`\nRunning: ${file}`);
        try {
            await client.query(sql);
            console.log(`  ✅ ${file} applied successfully`);
        } catch (err) {
            // "already exists" errors are fine — migration was already applied
            if (err.message.includes('already exists')) {
                console.log(`  ⏭️  ${file} already applied (skipping)`);
            } else {
                console.error(`  ❌ ${file} failed: ${err.message}`);
                // Don't exit — try remaining migrations
            }
        }
    }

    await client.end();
    console.log('\nDone.');
}

run().catch(err => {
    console.error('Migration runner failed:', err);
    process.exit(1);
});

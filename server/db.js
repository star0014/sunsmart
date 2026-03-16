import { randomUUID } from "node:crypto";

import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("DATABASE_URL is not set. Add it to .env before starting the server.");
}

const pool = new Pool({
  connectionString,
  ssl: process.env.PGSSLMODE === "require" ? { rejectUnauthorized: false } : false,
});

const seedUserId = "demo-user";

export async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_settings (
      settings_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
      location TEXT NOT NULL,
      skin_tone TEXT NOT NULL,
      start_time TEXT NOT NULL,
      reminder_interval TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reminder_log (
      reminder_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      reminder_type TEXT NOT NULL,
      scheduled_for TEXT NOT NULL,
      sent_at TEXT NOT NULL,
      delivery_status TEXT NOT NULL,
      provider_message TEXT
    );
  `);

  await pool.query(
    `
      INSERT INTO users (user_id, email, name)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id)
      DO NOTHING
    `,
    [seedUserId, "student@monash.edu", "SunSmart Demo User"],
  );

  await pool.query(
    `
      INSERT INTO user_settings (
        settings_id,
        user_id,
        location,
        skin_tone,
        start_time,
        reminder_interval
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id)
      DO NOTHING
    `,
    [`${seedUserId}-settings`, seedUserId, "Melbourne, VIC", "light", "09:00", "2 hours"],
  );
}

function mapSettingsRow(row) {
  if (!row) {
    return null;
  }

  return {
    userId: row.user_id,
    settingsId: row.settings_id,
    email: row.email,
    name: row.name,
    location: row.location,
    skinTone: row.skin_tone,
    startTime: row.start_time,
    interval: row.reminder_interval,
  };
}

export async function getUserSettings(userId) {
  const { rows } = await pool.query(
    `
      SELECT
        u.user_id,
        u.email,
        u.name,
        s.settings_id,
        s.location,
        s.skin_tone,
        s.start_time,
        s.reminder_interval
      FROM users u
      LEFT JOIN user_settings s ON s.user_id = u.user_id
      WHERE u.user_id = $1 OR u.email = $1
      LIMIT 1
    `,
    [userId],
  );

  return mapSettingsRow(rows[0]);
}

export async function saveUserSettings({
  userId,
  email,
  name,
  location,
  skinTone,
  startTime,
  interval,
}) {
  const existingByUserId = await getUserSettings(userId);
  const existingByEmail = await getUserSettings(email);
  const existing = existingByUserId || existingByEmail;
  const effectiveUserId = existing?.userId ?? userId;
  const settingsId = existing?.settingsId ?? `${effectiveUserId}-${randomUUID()}`;

  await pool.query(
    `
      INSERT INTO users (user_id, email, name)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id)
      DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name
    `,
    [effectiveUserId, email, name],
  );

  await pool.query(
    `
      INSERT INTO user_settings (
        settings_id,
        user_id,
        location,
        skin_tone,
        start_time,
        reminder_interval
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id)
      DO UPDATE SET
        location = EXCLUDED.location,
        skin_tone = EXCLUDED.skin_tone,
        start_time = EXCLUDED.start_time,
        reminder_interval = EXCLUDED.reminder_interval
    `,
    [settingsId, effectiveUserId, location, skinTone, startTime, interval],
  );

  return getUserSettings(effectiveUserId);
}

export function getDatabasePath() {
  return "postgresql";
}

export async function listAllSettings() {
  const { rows } = await pool.query(
    `
      SELECT
        u.user_id,
        u.email,
        u.name,
        s.settings_id,
        s.location,
        s.skin_tone,
        s.start_time,
        s.reminder_interval
      FROM users u
      INNER JOIN user_settings s ON s.user_id = u.user_id
      ORDER BY u.name ASC
    `,
  );

  return rows.map(mapSettingsRow);
}

export async function hasReminderBeenSent(userId, reminderType, scheduledFor) {
  const { rows } = await pool.query(
    `
      SELECT reminder_id
      FROM reminder_log
      WHERE user_id = $1
        AND reminder_type = $2
        AND scheduled_for = $3
      LIMIT 1
    `,
    [userId, reminderType, scheduledFor],
  );

  return Boolean(rows[0]);
}

export async function logReminder({
  userId,
  reminderType,
  scheduledFor,
  deliveryStatus,
  providerMessage = "",
}) {
  await pool.query(
    `
      INSERT INTO reminder_log (
        reminder_id,
        user_id,
        reminder_type,
        scheduled_for,
        sent_at,
        delivery_status,
        provider_message
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
    [
      randomUUID(),
      userId,
      reminderType,
      scheduledFor,
      new Date().toISOString(),
      deliveryStatus,
      providerMessage,
    ],
  );
}

export async function closeDatabase() {
  await pool.end();
}

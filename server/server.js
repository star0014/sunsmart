import dotenv from "dotenv";
import { createServer } from "node:http";

import {
  closeDatabase,
  getUserSettings,
  initDatabase,
  listAllSettings,
  saveUserSettings,
} from "./db.js";

dotenv.config();

const PORT = Number(process.env.PORT || 3001);

function json(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });
    req.on("error", reject);
  });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    if (req.method === "GET" && url.pathname === "/api/health") {
      json(res, 200, { ok: true, database: "postgres" });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/settings") {
      const settings = await listAllSettings();
      json(res, 200, { settings });
      return;
    }

    if (req.method === "GET" && url.pathname.startsWith("/api/settings/")) {
      const userId = decodeURIComponent(url.pathname.replace("/api/settings/", ""));
      const settings = await getUserSettings(userId);
      if (!settings) {
        json(res, 404, { error: "User settings not found." });
        return;
      }
      json(res, 200, { settings });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/settings") {
      const body = await readJsonBody(req);
      const requiredFields = ["userId", "email", "name", "location", "skinTone", "startTime", "interval"];
      const missing = requiredFields.filter((field) => !body[field]);

      if (missing.length > 0) {
        json(res, 400, { error: `Missing required fields: ${missing.join(", ")}` });
        return;
      }

      const settings = await saveUserSettings(body);
      json(res, 200, { settings });
      return;
    }

    json(res, 404, { error: "Not found." });
  } catch (error) {
    json(res, 500, { error: error.message || "Internal server error." });
  }
});

initDatabase()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`SunSmart server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });

process.on("SIGINT", async () => {
  await closeDatabase();
  process.exit(0);
});

import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed:", error);
      console.error("[OAuth] Request query:", req.query);
      console.error("[OAuth] Request headers:", req.headers);
      
      // Send HTML error page instead of JSON for better mobile experience
      res.status(500).send(`
        <!DOCTYPE html>
        <html lang="pl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Błąd logowania - BMCODEX</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #1A1A1A;
              color: #F5F5F5;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 500px;
              background-color: #212121;
              border: 2px solid #FF4500;
              border-radius: 8px;
              padding: 30px;
              text-align: center;
            }
            h1 {
              color: #FF4500;
              margin-top: 0;
            }
            p {
              line-height: 1.6;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              background-color: #FF4500;
              color: #1A1A1A;
              padding: 12px 24px;
              border-radius: 5px;
              text-decoration: none;
              font-weight: bold;
              margin-top: 20px;
            }
            .error-details {
              background-color: #2A2A2A;
              padding: 15px;
              border-radius: 5px;
              margin-top: 20px;
              font-size: 12px;
              color: #A0A0A0;
              text-align: left;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🔧 Błąd logowania</h1>
            <p>Przepraszamy, wystąpił problem podczas logowania do systemu BMCODEX Service Suite.</p>
            <p><strong>Co możesz zrobić:</strong></p>
            <ul style="text-align: left; margin: 20px 0;">
              <li>Spróbuj zalogować się ponownie</li>
              <li>Wyczyść cache i cookies przeglądarki</li>
              <li>Skontaktuj się z administratorem</li>
            </ul>
            <a href="/" class="button">Powrót do strony głównej</a>
            <div class="error-details">
              <strong>Szczegóły techniczne:</strong><br>
              ${error instanceof Error ? error.message : String(error)}
            </div>
          </div>
        </body>
        </html>
      `);
    }
  });
}

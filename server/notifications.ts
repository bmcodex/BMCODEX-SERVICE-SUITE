/**
 * Notification Service for BMCODEX Service Suite
 * Handles email and SMS notifications for bookings and service updates
 */

interface EmailNotificationParams {
  to: string;
  subject: string;
  html: string;
}

interface SMSNotificationParams {
  to: string;
  message: string;
}

interface BookingReminderParams {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  serviceType: string;
  scheduledDate: Date;
  vehicleInfo?: string;
}

/**
 * Send email notification using SendGrid
 * Note: Requires SENDGRID_API_KEY environment variable
 */
export async function sendEmail(params: EmailNotificationParams): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY;
  
  if (!apiKey) {
    console.warn("[Notifications] SendGrid API key not configured");
    return false;
  }

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: params.to }],
            subject: params.subject,
          },
        ],
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || "noreply@bmcodex.pl",
          name: "BMCODEX Service Suite",
        },
        content: [
          {
            type: "text/html",
            value: params.html,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("[Notifications] SendGrid error:", await response.text());
      return false;
    }

    console.log("[Notifications] Email sent successfully to:", params.to);
    return true;
  } catch (error) {
    console.error("[Notifications] Failed to send email:", error);
    return false;
  }
}

/**
 * Send SMS notification using Twilio
 * Note: Requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER environment variables
 */
export async function sendSMS(params: SMSNotificationParams): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromPhone) {
    console.warn("[Notifications] Twilio credentials not configured");
    return false;
  }

  try {
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: params.to,
          From: fromPhone,
          Body: params.message,
        }),
      }
    );

    if (!response.ok) {
      console.error("[Notifications] Twilio error:", await response.text());
      return false;
    }

    console.log("[Notifications] SMS sent successfully to:", params.to);
    return true;
  } catch (error) {
    console.error("[Notifications] Failed to send SMS:", error);
    return false;
  }
}

/**
 * Send 24-hour booking reminder
 */
export async function send24HourReminder(params: BookingReminderParams): Promise<boolean> {
  const dateStr = params.scheduledDate.toLocaleDateString("pl-PL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const timeStr = params.scheduledDate.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #1A1A1A;
          color: #F5F5F5;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #212121;
          border-radius: 8px;
          padding: 30px;
          border: 2px solid #FF4500;
        }
        .logo {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo h1 {
          color: #FF4500;
          margin: 0;
          font-size: 28px;
        }
        .content {
          line-height: 1.6;
        }
        .highlight {
          background-color: #FF4500;
          color: #1A1A1A;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #444;
          text-align: center;
          color: #A0A0A0;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <h1>🔧 BMCODEX Service Suite™</h1>
        </div>
        <div class="content">
          <p>Dzień dobry ${params.clientName},</p>
          
          <p>Przypominamy o Twojej wizycie w naszym serwisie BMW:</p>
          
          <div class="highlight">
            📅 Data: ${dateStr}<br>
            🕐 Godzina: ${timeStr}<br>
            🔧 Usługa: ${params.serviceType}
            ${params.vehicleInfo ? `<br>🚗 Pojazd: ${params.vehicleInfo}` : ""}
          </div>
          
          <p>Prosimy o punktualne przybycie. W razie pytań lub konieczności zmiany terminu, prosimy o kontakt.</p>
          
          <p>Do zobaczenia!</p>
          <p><strong>Zespół BMCODEX</strong></p>
        </div>
        <div class="footer">
          BMCODEX Service Suite™ - Profesjonalne zarządzanie serwisem BMW<br>
          kontakt@bmcodex.pl
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: params.clientEmail,
    subject: `Przypomnienie o wizycie - ${dateStr}`,
    html,
  });
}

/**
 * Send 2-hour booking reminder
 */
export async function send2HourReminder(params: BookingReminderParams): Promise<boolean> {
  const timeStr = params.scheduledDate.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #1A1A1A;
          color: #F5F5F5;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #212121;
          border-radius: 8px;
          padding: 30px;
          border: 2px solid #FF4500;
        }
        .logo {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo h1 {
          color: #FF4500;
          margin: 0;
          font-size: 28px;
        }
        .content {
          line-height: 1.6;
        }
        .urgent {
          background-color: #FF4500;
          color: #1A1A1A;
          padding: 20px;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
          text-align: center;
          font-size: 18px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #444;
          text-align: center;
          color: #A0A0A0;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <h1>🔧 BMCODEX Service Suite™</h1>
        </div>
        <div class="content">
          <p>Dzień dobry ${params.clientName},</p>
          
          <div class="urgent">
            ⏰ Twoja wizyta za 2 godziny!<br>
            Godzina: ${timeStr}
          </div>
          
          <p>Czekamy na Ciebie w naszym serwisie BMW.</p>
          
          <p><strong>Zespół BMCODEX</strong></p>
        </div>
        <div class="footer">
          BMCODEX Service Suite™ - Profesjonalne zarządzanie serwisem BMW<br>
          kontakt@bmcodex.pl
        </div>
      </div>
    </body>
    </html>
  `;

  // Send email
  const emailSent = await sendEmail({
    to: params.clientEmail,
    subject: `⏰ Wizyta za 2 godziny - ${timeStr}`,
    html,
  });

  // Send SMS if phone number provided
  if (params.clientPhone) {
    await sendSMS({
      to: params.clientPhone,
      message: `BMCODEX: Przypominamy o wizycie za 2 godziny (${timeStr}). Do zobaczenia!`,
    });
  }

  return emailSent;
}

/**
 * Send service completion notification
 */
export async function sendServiceCompletionNotification(params: BookingReminderParams): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #1A1A1A;
          color: #F5F5F5;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #212121;
          border-radius: 8px;
          padding: 30px;
          border: 2px solid #FF4500;
        }
        .logo {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo h1 {
          color: #FF4500;
          margin: 0;
          font-size: 28px;
        }
        .content {
          line-height: 1.6;
        }
        .success {
          background-color: #4CAF50;
          color: white;
          padding: 20px;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
          text-align: center;
          font-size: 18px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #444;
          text-align: center;
          color: #A0A0A0;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <h1>🔧 BMCODEX Service Suite™</h1>
        </div>
        <div class="content">
          <p>Dzień dobry ${params.clientName},</p>
          
          <div class="success">
            ✅ Prace zakończone!<br>
            Twój pojazd jest gotowy do odbioru
          </div>
          
          <p>Z przyjemnością informujemy, że prace serwisowe zostały zakończone:</p>
          
          <p><strong>Usługa:</strong> ${params.serviceType}</p>
          ${params.vehicleInfo ? `<p><strong>Pojazd:</strong> ${params.vehicleInfo}</p>` : ""}
          
          <p>Prosimy o kontakt w celu umówienia odbioru pojazdu.</p>
          
          <p>Dziękujemy za zaufanie!</p>
          <p><strong>Zespół BMCODEX</strong></p>
        </div>
        <div class="footer">
          BMCODEX Service Suite™ - Profesjonalne zarządzanie serwisem BMW<br>
          kontakt@bmcodex.pl
        </div>
      </div>
    </body>
    </html>
  `;

  // Send email
  const emailSent = await sendEmail({
    to: params.clientEmail,
    subject: `✅ Prace zakończone - ${params.serviceType}`,
    html,
  });

  // Send SMS if phone number provided
  if (params.clientPhone) {
    await sendSMS({
      to: params.clientPhone,
      message: `BMCODEX: Prace zakończone! Twój pojazd jest gotowy do odbioru. Prosimy o kontakt.`,
    });
  }

  return emailSent;
}

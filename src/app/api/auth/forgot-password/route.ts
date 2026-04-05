import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { createServiceClient } from "@/lib/supabase/server";
import sgMail from "@sendgrid/mail";

const schema = z.object({
  email: z.email("Invalid email address"),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const { email } = result.data;

  // Derive public origin from forwarded headers so this works correctly
  // behind Railway/Vercel proxies where request.url is an internal address.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto =
    request.headers.get("x-forwarded-proto")?.split(",")[0].trim() ?? "https";
  const requestOrigin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : new URL(request.url).origin;

  // Prefer explicit env var, but strip trailing slashes and ensure scheme
  const rawEnvUrl = (process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/+$/, "");
  const envUrl = rawEnvUrl
    ? rawEnvUrl.startsWith("http")
      ? rawEnvUrl
      : `https://${rawEnvUrl}`
    : null;

  const appUrl = envUrl || requestOrigin;

  try {
    const supabase = await createServiceClient();

    // Generate a recovery link via the admin API.
    // redirectTo is where Supabase embeds in the action link — we point it at
    // our own /auth/confirm endpoint which exchanges the token_hash for a session.
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: `${appUrl}/auth/confirm?next=/reset-password`,
      },
    });

    if (error) {
      // Don't expose whether the email exists — always return success to the client
      console.error("generateLink error:", error.message);
      return NextResponse.json({ ok: true });
    }

    // The action_link from generateLink is a Supabase-hosted URL.
    // We replace it with our own /auth/confirm?token_hash=...&type=recovery&next=/reset-password
    // so the entire flow stays on storyvenue.com.
    const tokenHash = data.properties?.hashed_token;
    if (!tokenHash) {
      console.error("generateLink returned no hashed_token");
      return NextResponse.json({ ok: true });
    }

    const resetUrl = `${appUrl}/auth/confirm?token_hash=${tokenHash}&type=recovery&next=/reset-password`;

    if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
      console.warn("SendGrid not configured — reset URL:", resetUrl);
      return NextResponse.json({ ok: true });
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    await sgMail.send({
      to: email,
      from: {
        email: "noreply@storyvenue.com",
        name: "StoryVenue",
      },
      replyTo: "support@storyvenue.com",
      subject: "Reset your StoryVenue password",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f8f7f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f7f4;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Logo / wordmark -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <span style="font-size:22px;font-weight:700;letter-spacing:-0.5px;color:#111111;">StoryVenue</span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:16px;border:1px solid #e5e2dc;padding:40px 40px 36px;">

              <p style="margin:0 0 8px;font-size:22px;font-weight:600;color:#111111;line-height:1.3;">Reset your password</p>
              <p style="margin:0 0 28px;font-size:15px;color:#6b6560;line-height:1.6;">
                We received a request to reset the password for your StoryVenue account
                associated with <strong style="color:#111111;">${email}</strong>.
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#6b6560;line-height:1.6;">
                Click the button below to choose a new password. This link expires in&nbsp;1&nbsp;hour.
              </p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="border-radius:10px;background-color:#111111;">
                    <a href="${resetUrl}"
                       style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.1px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;font-size:13px;color:#9b9591;line-height:1.6;">
                If the button above doesn't work, copy and paste this URL into your browser:
              </p>
              <p style="margin:0 0 28px;font-size:12px;color:#9b9591;word-break:break-all;line-height:1.5;">
                <a href="${resetUrl}" style="color:#6b6560;text-decoration:underline;">${resetUrl}</a>
              </p>

              <hr style="border:none;border-top:1px solid #f0ede8;margin:0 0 24px;" />

              <p style="margin:0;font-size:13px;color:#9b9591;line-height:1.6;">
                If you didn't request a password reset, you can safely ignore this email.
                Your password will not change.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#b0ada8;">
                &copy; ${new Date().getFullYear()} StoryVenue &middot; All rights reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim(),
      text: `Reset your StoryVenue password\n\nWe received a request to reset the password for your account (${email}).\n\nClick the link below to choose a new password (expires in 1 hour):\n${resetUrl}\n\nIf you didn't request this, you can safely ignore this email.`,
    });
  } catch (err) {
    console.error("forgot-password error:", err);
  }

  // Always return success — never reveal whether an email is registered
  return NextResponse.json({ ok: true });
}

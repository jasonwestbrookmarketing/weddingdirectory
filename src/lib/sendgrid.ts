import sgMail from "@sendgrid/mail";

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface LeadEmailData {
  venueName: string;
  recipientEmail: string;
  lead: {
    name: string;
    email: string;
    phone: string;
    wedding_date?: string | null;
    guest_count?: number | null;
    booking_timeline?: string | null;
    message?: string | null;
  };
}

export async function sendLeadNotification(data: LeadEmailData) {
  if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
    console.warn("SendGrid not configured, skipping email");
    return;
  }

  const { venueName, recipientEmail, lead } = data;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const msg = {
    to: recipientEmail,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: `New Wedding Inquiry for ${venueName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
        <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 24px; color: #111;">New Wedding Inquiry</h2>
        <div style="background: #fafafa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 8px 0;"><strong>Venue:</strong> ${venueName}</p>
          <p style="margin: 8px 0;"><strong>Name:</strong> ${lead.name}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> ${lead.email}</p>
          <p style="margin: 8px 0;"><strong>Phone:</strong> ${lead.phone}</p>
          <p style="margin: 8px 0;"><strong>Wedding Date:</strong> ${lead.wedding_date || "Not provided"}</p>
          <p style="margin: 8px 0;"><strong>Guest Count:</strong> ${lead.guest_count || "Not provided"}</p>
          <p style="margin: 8px 0;"><strong>Timeline:</strong> ${lead.booking_timeline || "Not provided"}</p>
          ${lead.message ? `<p style="margin: 8px 0;"><strong>Notes:</strong> ${lead.message}</p>` : ""}
        </div>
        <a href="${appUrl}/dashboard/leads"
           style="display: inline-block; background: #111; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">
          View Lead in Dashboard
        </a>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error("Failed to send lead notification email:", error);
  }
}

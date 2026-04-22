import { Resend } from "resend";

const FROM = "PropHive <noreply@prophive.in>";

function getResend(): Resend {
  return new Resend(process.env.RESEND_API_KEY ?? "");
}

export async function sendWelcomeEmail(name: string, email: string): Promise<void> {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Welcome to PropHive!",
    html: `<h2>Hi ${name},</h2><p>Welcome to PropHive — India's cleanest real estate platform.</p>`,
  }).catch(console.error);
}

export async function sendInquiryEmail(
  sellerName: string,
  sellerEmail: string,
  buyerName: string,
  propertyTitle: string,
  message: string
): Promise<void> {
  await getResend().emails.send({
    from: FROM,
    to: sellerEmail,
    subject: `New Inquiry for: ${propertyTitle}`,
    html: `<h2>Hi ${sellerName},</h2><p><strong>${buyerName}</strong> sent an inquiry about <strong>${propertyTitle}</strong>:</p><blockquote>${message}</blockquote>`,
  }).catch(console.error);
}

export async function sendSubscriptionConfirmationEmail(name: string, email: string, planName: string): Promise<void> {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Subscription Confirmed — PropHive",
    html: `<h2>Hi ${name},</h2><p>Your <strong>${planName}</strong> subscription is now active.</p>`,
  }).catch(console.error);
}

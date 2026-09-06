import { Resend } from 'resend';

export const runtime = 'nodejs';

const FROM_EMAIL = 'Anthony Rosenberger <hello@anthonyrosenberger.com>';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactRequest = {
  name?: unknown;
  email?: unknown;
  organization?: unknown;
  goals?: unknown;
};

function cleanField(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function cleanSingleLine(value: unknown) {
  return cleanField(value).replace(/\s+/g, ' ');
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export async function POST(request: Request) {
  let body: ContactRequest;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Please enter your contact details and message.' }, { status: 400 });
  }

  const name = cleanSingleLine(body.name);
  const email = cleanSingleLine(body.email).toLowerCase();
  const organization = cleanSingleLine(body.organization);
  const message = cleanField(body.goals);

  if (!name || !email || !message) {
    return Response.json(
      { error: 'Please complete your name, email, and message.' },
      { status: 400 },
    );
  }

  if (!EMAIL_PATTERN.test(email)) {
    return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  if (name.length > 100 || email.length > 254 || organization.length > 200 || message.length > 5000) {
    return Response.json(
      { error: 'One or more fields are too long. Please shorten your message and try again.' },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!apiKey || !contactEmail) {
    console.error('Contact form environment variables are not configured.');
    return Response.json(
      { error: 'The form is temporarily unavailable. Please email Anthony directly.' },
      { status: 500 },
    );
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeOrganization = escapeHtml(organization || 'Not provided');
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br />');
  const ownerText = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Organization: ${organization || 'Not provided'}`,
    '',
    'Message:',
    message,
  ].join('\n');
  const confirmationText = [
    `Hi ${name},`,
    '',
    'Thanks for reaching out. I received your message and will get back to you as soon as I can.',
    '',
    '— Anthony Rosenberger',
  ].join('\n');

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.batch.send(
      [
        {
          from: FROM_EMAIL,
          to: contactEmail,
          replyTo: email,
          subject: `New Website Message — ${name}`,
          text: ownerText,
          html: `
            <h1>New Website Message</h1>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Organization:</strong> ${safeOrganization}</p>
            <p><strong>Message:</strong></p>
            <p>${safeMessage}</p>
          `,
        },
        {
          from: FROM_EMAIL,
          to: email,
          subject: 'Thanks for reaching out',
          text: confirmationText,
          html: `
            <p>Hi ${safeName},</p>
            <p>Thanks for reaching out. I received your message and will get back to you as soon as I can.</p>
            <p>— Anthony Rosenberger</p>
          `,
        },
      ],
      { idempotencyKey: `portfolio-contact-${crypto.randomUUID()}` },
    );

    if (error) {
      console.error('Resend contact submission failed.', error);
      return Response.json(
        { error: 'Your message could not be sent. Please try again or email Anthony directly.' },
        { status: 502 },
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Contact form request failed.', error);
    return Response.json(
      { error: 'Your message could not be sent. Please try again or email Anthony directly.' },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  serviceInterest?: string;
  timeline?: string;
  message?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as ContactPayload;
  const { name, email, company, serviceInterest, timeline, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and project details are required." },
      { status: 400 },
    );
  }

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_RECEIVER_EMAIL;

  if (!host || !port || !user || !pass || !to) {
    return NextResponse.json(
      { error: "Email is not configured. Add SMTP and recipient env variables." },
      { status: 500 },
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || user,
      to,
      replyTo: email,
      subject: `New inquiry from ${name}`,
      text: `Name: ${name}
Email: ${email}
Company: ${company || "Not provided"}
Service interest: ${serviceInterest || "Not provided"}
Timeline: ${timeline || "Not provided"}

Message:
${message}`,
    });

    return NextResponse.json({ message: "Message sent successfully. I will follow up soon." });
  } catch {
    return NextResponse.json(
      { error: "Unable to send your message right now. Please try again shortly." },
      { status: 500 },
    );
  }
}

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = Number(process.env.EMAIL_PORT || 587);
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || "arwealthtaxco@gmail.com";
const EMAIL_TO = process.env.EMAIL_TO || "arwealthtaxco@gmail.com";

if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
  console.warn(
    "Email credentials are not fully configured. Please set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS in backend/.env",
  );
}

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendContactNotification = async (contact) => {
  const subject = `New contact request from ${contact.name}`;
  const plainText = `A new contact request has been submitted.\n\nName: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone || "N/A"}\nService: ${contact.service || "N/A"}\nOther Details: ${contact.other_details || "N/A"}\nComments: ${contact.comments || "N/A"}\nSubmitted at: ${new Date(contact.created_at).toLocaleString()}`;
  const html = `
    <h2>New Contact Request</h2>
    <p><strong>Name:</strong> ${contact.name}</p>
    <p><strong>Email:</strong> ${contact.email}</p>
    <p><strong>Phone:</strong> ${contact.phone || "N/A"}</p>
    <p><strong>Service:</strong> ${contact.service || "N/A"}</p>
    <p><strong>Other Details:</strong> ${contact.other_details || "N/A"}</p>
    <p><strong>Comments:</strong> ${contact.comments || "N/A"}</p>
    <p><strong>Submitted at:</strong> ${new Date(contact.created_at).toLocaleString()}</p>
  `;

  return transporter.sendMail({
    from: EMAIL_FROM,
    to: EMAIL_TO,
    subject,
    text: plainText,
    html,
  });
};

export const sendOtpEmail = async (email, otp) => {
  const subject = `Your Password Reset OTP`;
  const plainText = `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`;
  const html = `
    <h2>Password Reset Request</h2>
    <p>You have requested to reset your password. Here is your OTP:</p>
    <h3 style="font-size: 24px; letter-spacing: 2px;">${otp}</h3>
    <p>This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
  `;

  return transporter.sendMail({
    from: EMAIL_FROM,
    to: email, // send to the user's email
    subject,
    text: plainText,
    html,
  });
};

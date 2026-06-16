import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = Number(process.env.EMAIL_PORT || 587);
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

console.log("Testing email with user:", EMAIL_USER);

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

async function run() {
  try {
    let info = await transporter.sendMail({
      from: EMAIL_USER,
      to: EMAIL_USER,
      subject: "Test Email",
      text: "This is a test email.",
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error occurred:", error.message);
    if (error.response) {
        console.error("SMTP Response:", error.response);
    }
  }
}

run();

const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { performance } = require("perf_hooks");

dotenv.config();

console.log("GMAIL_USER:", process.env.GMAIL_USER);
console.log("GMAIL_PASS:", process.env.GMAIL_PASS);

const sendReferralEmail = async (referral) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: referral.refereeEmail,
    subject: "You have been referred!",
    text: `Hi ${referral.refereeName},\n\n${referral.referrerName} has referred you to join the course: ${referral.courseName}.\n\nBest regards,\nAccredian.`,
  };

  const start = performance.now();

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }

    const end = performance.now();
    console.log(`Email sent in ${end - start} ms`);
  });
};

// Sample referral object for testing
const referral = {
  referrerName: "John Doe",
  referrerEmail: "john@example.com",
  refereeName: "Jane Doe",
  refereeEmail: "bgp99000@gmail.com",
  courseName: "Course XYZ",
};

sendReferralEmail(referral);

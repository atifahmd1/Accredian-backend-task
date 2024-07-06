// index.js
const express = require("express");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/api/referrals", async (req, res) => {
  const { referrerName, referrerEmail, refereeName, refereeEmail, courseName } =
    req.body;

  if (
    !referrerName ||
    !referrerEmail ||
    !refereeName ||
    !refereeEmail ||
    !courseName
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // console.log(req.body);

  // console.log(process.env.GMAIL_USER);
  // console.log(process.env.GMAIL_PASS);

  try {
    const referral = await prisma.referral.create({
      data: {
        referrerName,
        referrerEmail,
        refereeName,
        refereeEmail,
        courseName,
      },
    });

    // Send referral email
    await sendReferralEmail(referral);

    res.status(201).json(referral);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
});

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
    text: `Hi ${referral.refereeName},\n\n${referral.referrerName} has referred you to join the course: ${referral.courseName}.\n\nBest regards,\Accredian.`,
  };

  await transporter.sendMail(mailOptions);
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

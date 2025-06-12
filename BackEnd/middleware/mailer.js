// 📁 mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gangvanimanav@gmail.com", // 🔒 Replace with your real email
    pass: "xjniwfwvjhvoxnww", // 🔒 Use an App Password if using Gmail
  },
});

const sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: "gangvanimanav@gmail.com", // 🔁 Same as above
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Mail sending failed:", error);
  }
};

module.exports = sendMail;

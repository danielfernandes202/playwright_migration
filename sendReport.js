const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Load Playwright JSON report
const reportPath = path.join(__dirname, 'playwright-report', 'report.json');
const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

// Extract top-level stats
const stats = reportData.stats;
const passed = stats.expected + stats.flaky;
const failed = stats.unexpected;
const total = passed + failed;

// Convert duration from ms to mm:ss
const durationMs = stats.duration;
const minutes = Math.floor(durationMs / 60000);
const seconds = Math.floor((durationMs % 60000) / 1000);
const formattedDuration = `${minutes}m ${seconds}s`;

// 📧 HTML Email Body
const htmlBody = `
  <h2 style="font-family:sans-serif;">Automation Test Summary</h2>
  <table style="border-collapse:collapse; font-family:sans-serif; font-size:16px;">
    <tr>
      <td><strong>Total:</strong></td><td>${total}</td>
    </tr>
    <tr>
      <td style="color:green;">✅ <strong>Passed:</strong></td><td>${passed}</td>
    </tr>
    <tr>
      <td style="color:red;">❌ <strong>Failed:</strong></td><td>${failed}</td>
    </tr>
    <tr>
      <td>⏱️ <strong>Duration:</strong></td><td>${formattedDuration}</td>
    </tr>
  </table>
  <p style="font-family:sans-serif; font-size:14px;">
    📎 The full report is attached as <b>report.html</b>.
  </p>
`;
const transporter = nodemailer.createTransport({
  service: 'gmail', // or another SMTP provider
  auth: {
    user: 'daniel.fernandes@oneorigin.us',
    pass: 'dfot dxtk ahrm srwh', // use app-specific password
  },
});

const mailOptions = {
  from: 'daniel.fernandes@oneorigin.us',
  to: 'triangulator-deployme-aaaamgvfftuteiwvbuh63argn4@asu.org.slack.com', // special Slack email for channels
  subject: 'Triangulator QA Report',
  html: htmlBody,
  attachments: [
    {
      filename: 'report.html',
      path: './playwright-report/index.html',
    },
  ],
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log('Error:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});

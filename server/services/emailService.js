const nodemailer = require('nodemailer');

/**
 * Email Service for sending subscription renewal notifications
 * Uses Gmail SMTP (you can also use other providers)
 */

let transporter = null;

/**
 * Initialize email transporter
 */
const initializeTransporter = () => {
  if (transporter) return transporter;

  // Using Gmail SMTP for sending emails
  // Alternative: Use your own email provider (SendGrid, Mailgun, etc.)
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
    },
  });

  return transporter;
};

/**
 * Send subscription renewal reminder email
 * @param {string} userEmail - User's email
 * @param {string} serviceName - Service/subscription name
 * @param {number} daysUntilRenewal - Days until renewal
 * @param {number} price - Subscription price
 * @param {string} currency - Currency code
 * @returns {Promise<Object>} Email send result
 */
const sendRenewalReminderEmail = async (
  userEmail,
  serviceName,
  daysUntilRenewal,
  price,
  currency = 'USD'
) => {
  try {
    const transporter = initializeTransporter();

    const emailTemplate = generateRenewalEmailHTML(
      serviceName,
      daysUntilRenewal,
      price,
      currency
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `⏰ Reminder: ${serviceName} Renewing in ${daysUntilRenewal} Days`,
      html: emailTemplate,
    };

    const result = await transporter.sendMail(mailOptions);

    console.log(`✅ Renewal reminder email sent to ${userEmail} for ${serviceName}`);
    return result;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Generate HTML email template for renewal reminder
 */
const generateRenewalEmailHTML = (serviceName, daysUntilRenewal, price, currency) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            padding: 30px;
            color: white;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            background: white;
            border-radius: 8px;
            padding: 20px;
            color: #333;
            margin-bottom: 20px;
          }
          .reminder-box {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
          }
          .details {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            margin: 15px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #dee2e6;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .label {
            font-weight: 600;
            color: #666;
          }
          .value {
            color: #333;
            font-weight: 500;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #999;
            margin-top: 20px;
          }
          .btn {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            margin: 20px 0;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Subscription Renewal Reminder</h1>
          </div>

          <div class="content">
            <p>Hi,</p>

            <p>Your subscription to <strong>${serviceName}</strong> will renew in <strong>${daysUntilRenewal} day${daysUntilRenewal !== 1 ? 's' : ''}</strong>.</p>

            <div class="reminder-box">
              <strong>⚠️ Important:</strong> Make sure you have sufficient funds in your payment method. If you don't want to renew, cancel before the renewal date to avoid charges.
            </div>

            <h3>Subscription Details:</h3>
            <div class="details">
              <div class="detail-row">
                <span class="label">Service:</span>
                <span class="value">${serviceName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Renewal Amount:</span>
                <span class="value">${formattedPrice}</span>
              </div>
              <div class="detail-row">
                <span class="label">Days Until Renewal:</span>
                <span class="value">${daysUntilRenewal}</span>
              </div>
            </div>

            <p>You can manage your subscription in your account dashboard anytime.</p>

            <p>Best regards,<br>
            <strong>Subscription Manager</strong></p>
          </div>

          <div class="footer">
            <p>This is an automated email from Subscription Manager. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Send subscription cancellation reminder email
 */
const sendCancellationEmail = async (userEmail, serviceName) => {
  try {
    const transporter = initializeTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `ℹ️ Reminder: ${serviceName} Cancelled`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <h2>Subscription Cancelled</h2>
            <p>Your subscription to <strong>${serviceName}</strong> has been cancelled.</p>
            <p>You will not be charged again unless you reactivate the subscription.</p>
            <p>Best regards,<br>Subscription Manager</p>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Cancellation email sent to ${userEmail}`);
  } catch (error) {
    console.error('❌ Error sending cancellation email:', error);
  }
};

module.exports = {
  sendRenewalReminderEmail,
  sendCancellationEmail,
  initializeTransporter,
};

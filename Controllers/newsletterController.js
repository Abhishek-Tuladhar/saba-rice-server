const Newsletter = require("../Models/Newsletter");
const sendMail = require("../Config/mailer");

const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error("Email is required.");
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      res.status(400);
      throw new Error("Please provide a valid email address.");
    }

    const existing = await Newsletter.findOne({ email: email.toLowerCase() });

    if (existing) {
      if (existing.isActive) {
        res.status(409);
        throw new Error("This email is already subscribed.");
      }
      // Re-subscribing someone who unsubscribed
      existing.isActive = true;
      await existing.save();
      await sendWelcomeEmail(existing);
      return res.status(200).json({
        success: true,
        message: "Welcome back! You're re-subscribed.",
        data: existing,
      });
    }

    const subscriber = await Newsletter.create({
      email: email.toLowerCase(),
    });
    await sendWelcomeEmail(subscriber);

    res.status(201).json({
      success: true,
      message: "Subscribed successfully!",
      data: subscriber,
    });
  } catch (err) {
    next(err);
  }
};

const unsubscribeNewsletter = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Unsubscribe</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2 style="color: #d32f2f;">❌ Invalid Unsubscribe Link</h2>
          <p>The unsubscribe link is missing or invalid. Please check your email and try again.</p>
        </body>
        </html>
      `);
    }

    const subscriber = await Newsletter.findOne({ unsubscribeToken: token });
    if (!subscriber) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Unsubscribe</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2 style="color: #d32f2f;">❌ Invalid or Expired Link</h2>
          <p>The unsubscribe link is invalid or has already been used.</p>
          <p><a href="${process.env.CLIENT_URL}">Return to Saba Rice</a></p>
        </body>
        </html>
      `);
    }

    // --- This is the key step: Set isActive to false ---
    subscriber.isActive = false;
    await subscriber.save();

    // --- Send a success HTML page directly to the browser ---
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Unsubscribed - Saba Rice</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            background-color: #f4f4f0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
          }
          .container {
            background: white;
            border-radius: 16px;
            padding: 48px 40px;
            max-width: 480px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
          }
          .icon { font-size: 56px; margin-bottom: 16px; }
          h1 { color: #4C5E22; font-size: 28px; margin-bottom: 8px; }
          p { color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
          .btn {
            background: #4C5E22;
            color: white;
            border: none;
            padding: 12px 32px;
            border-radius: 8px;
            font-size: 16px;
            text-decoration: none;
            display: inline-block;
            transition: background 0.3s;
          }
          .btn:hover { background: #3a4a1a; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">✅</div>
          <h1>You're Unsubscribed</h1>
          <p>You have been successfully unsubscribed from the Saba Rice newsletter. You will no longer receive our email updates.</p>
          <a href="${process.env.CLIENT_URL}" class="btn">Return to Saba Rice</a>
        </div>
      </body>
      </html>
    `);
  } catch (err) {}
};

async function sendWelcomeEmail(subscriber) {
  const unsubscribeUrl = `https://saba-rice-server-seven.vercel.app/api/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`;

  await sendMail({
    to: subscriber.email,
    subject: "Subscription Confirmed - Saba Rice",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Saba Rice</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f0; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f0; padding:40px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" style="max-width:560px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">

              <!-- Header -->
              <tr>
                <td style="background-color:#4C5E22; padding:32px 40px; text-align:center;">
                  <h1 style="margin:0; color:#ffffff; font-size:26px; font-weight:700; letter-spacing:-0.5px;">🌾 Saba Rice</h1>
                  <p style="margin:8px 0 0; color:#B4D867; font-size:14px; font-weight:400;">Premium Quality Rice Since 1994</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:40px 40px 32px;">
                  <h2 style="margin:0 0 12px; color:#1a1a1a; font-size:22px; font-weight:600; line-height:1.3;">
                    You're Confirmed! 🎉
                  </h2>
                  <p style="margin:0 0 16px; color:#444444; font-size:15px; line-height:1.7;">
                    Thanks for subscribing to <strong>Saba Rice</strong>. You'll be the first to hear about:
                  </p>
                  <ul style="margin:0 0 20px; padding-left:20px; color:#444444; font-size:15px; line-height:1.8;">
                    <li>New rice varieties and seasonal offers</li>
                    <li>Stories from our 32-year journey</li>
                    <li>Exclusive updates and promotions</li>
                  </ul>
                  <p style="margin:0 0 24px; color:#444444; font-size:15px; line-height:1.7;">
                    We promise — <strong>no spam</strong>, just the good stuff. 📬
                  </p>

                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${process.env.CLIENT_URL}" style="display:inline-block; background-color:#B4D867; color:#3A4A1A; font-size:15px; font-weight:600; text-decoration:none; padding:14px 32px; border-radius:999px; transition: all 0.3s ease;">
                          Explore Saba Rice →
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="padding:0 40px;">
                  <hr style="border:0; border-top:1px solid #eeeeee; margin:0;">
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:24px 40px 32px; background-color:#f9f9f6;">
                  <p style="margin:0 0 8px; color:#999999; font-size:12px; line-height:1.6; text-align:center;">
                    You're receiving this because you subscribed at sabarice.vercel.app.
                  </p>
                  <p style="margin:0; color:#999999; font-size:12px; line-height:1.6; text-align:center;">
                    <a href="${unsubscribeUrl}" style="color:#999999; text-decoration:underline;">Unsubscribe</a> at any time.
                  </p>
                  <p style="margin:16px 0 0; color:#bbbbbb; font-size:11px; line-height:1.5; text-align:center;">
                    © ${new Date().getFullYear()} Saba Rice. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `,
  });
}

module.exports = { subscribeNewsletter, unsubscribeNewsletter };

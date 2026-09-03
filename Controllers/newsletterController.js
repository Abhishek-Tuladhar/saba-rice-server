const Newsletter = require("../Models/Newsletter");
const sendMail = require("../Config/mailer");

const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error("Email is required.");
    }

    const existing = await Newsletter.findOne({ email });
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

    const subscriber = await Newsletter.create({ email });
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
      res.status(400);
      throw new Error("Missing unsubscribe token.");
    }

    const subscriber = await Newsletter.findOne({ unsubscribeToken: token });
    if (!subscriber) {
      res.status(404);
      throw new Error("Invalid or expired unsubscribe link.");
    }

    subscriber.isActive = false;
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: "You've been unsubscribed.",
    });
  } catch (err) {
    next(err);
  }
};

async function sendWelcomeEmail(subscriber) {
  const unsubscribeUrl = `${process.env.CLIENT_URL}/unsubscribe?token=${subscriber.unsubscribeToken}`;
  await sendMail({
    to: subscriber.email,
    subject: "Welcome to Saba Rice 🌾",
    html: `
    <!DOCTYPE html>
    <html>
    <body style="margin:0; padding:0; background-color:#f4f4f0; font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f0; padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" style="max-width:560px; background-color:#ffffff; border-radius:16px; overflow:hidden;">

              <!-- Header banner -->
              <tr>
                <td style="background-color:#4C5E22; padding:32px 40px; text-align:center;">
                  <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:700; letter-spacing:-0.02em;">Saba Rice</h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:40px;">
                  <h2 style="margin:0 0 16px; color:#1a1a1a; font-size:22px; font-weight:600; line-height:1.3;">
                    You're on the list 🎉
                  </h2>
                  <p style="margin:0 0 16px; color:#444444; font-size:15px; line-height:1.6;">
                    Thanks for subscribing to Saba Rice. You'll be the first to hear about new rice varieties, seasonal offers, and stories from our 32-year journey.
                  </p>
                  <p style="margin:0 0 28px; color:#444444; font-size:15px; line-height:1.6;">
                    We promise — no spam, just the good stuff.
                  </p>

                  <a href="${process.env.CLIENT_URL}" style="display:inline-block; background-color:#B4D867; color:#3A4A1A; font-size:14px; font-weight:600; text-decoration:none; padding:12px 28px; border-radius:999px;">
                    Explore Saba Rice →
                  </a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:24px 40px; background-color:#f9f9f6; border-top:1px solid #eeeeee;">
                  <p style="margin:0; color:#999999; font-size:12px; line-height:1.6; text-align:center;">
                    You're receiving this because you subscribed at sabarice.vercel.app.<br/>
                    <a href="${unsubscribeUrl}" style="color:#999999; text-decoration:underline;">Unsubscribe</a> at any time.
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

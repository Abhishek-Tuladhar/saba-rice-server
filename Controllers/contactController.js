const Contact = require("../Models/Contact");
const sendMail = require("../Config/mailer");

const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, phone, enquiryType, message } = req.body;

    if (!name || !email || !message) {
      res.status(400);
      throw new Error("Name, email, and message are required.");
    }

    const newContact = await Contact.create({
      name,
      email,
      phone,
      enquiryType,
      message,
    });

    // Admin notification
    sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: `New enquiry from ${name} (${enquiryType || "general"})`,
      html: `
      <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif; max-width:560px; margin:0 auto; padding:24px;">
        <h2 style="color:#4C5E22; margin:0 0 20px;">New Contact Form Submission</h2>
        <table role="presentation" width="100%" style="border-collapse:collapse; font-size:14px;">
          <tr>
            <td style="padding:8px 0; color:#888; width:100px;">Name</td>
            <td style="padding:8px 0; color:#1a1a1a; font-weight:600;">${name}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#888;">Email</td>
            <td style="padding:8px 0; color:#1a1a1a;"><a href="mailto:${email}" style="color:#4C5E22;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#888;">Phone</td>
            <td style="padding:8px 0; color:#1a1a1a;">${phone || "—"}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#888;">Type</td>
            <td style="padding:8px 0; color:#1a1a1a;">${enquiryType || "general"}</td>
          </tr>
        </table>
        <div style="margin-top:16px; padding:16px; background:#f9f9f6; border-radius:8px; font-size:14px; line-height:1.6; color:#333;">
          ${message}
        </div>
      </div>
      `,
    });

    // Auto-reply to submitter
    sendMail({
      to: email,
      subject: "We've received your enquiry — Saba Rice",
      html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0; padding:0; background-color:#f4f4f0; font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f0; padding:32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" style="max-width:560px; background-color:#ffffff; border-radius:16px; overflow:hidden;">

                <tr>
                  <td style="background-color:#4C5E22; padding:32px 40px; text-align:center;">
                    <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:700; letter-spacing:-0.02em;">Saba Rice</h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding:40px;">
                    <h2 style="margin:0 0 16px; color:#1a1a1a; font-size:22px; font-weight:600; line-height:1.3;">
                      Thanks, ${name} — we've got your message
                    </h2>
                    <p style="margin:0 0 24px; color:#444444; font-size:15px; line-height:1.6;">
                      We've received your enquiry and our team will get back to you within a day.
                    </p>

                    <table role="presentation" width="100%" style="background-color:#f9f9f6; border-radius:10px; margin-bottom:8px;">
                      <tr>
                        <td style="padding:20px 24px;">
                          <p style="margin:0 0 6px; color:#999999; font-size:11px; text-transform:uppercase; letter-spacing:0.05em; font-weight:600;">Enquiry type</p>
                          <p style="margin:0 0 16px; color:#1a1a1a; font-size:14px;">${enquiryType || "General"}</p>
                          <p style="margin:0 0 6px; color:#999999; font-size:11px; text-transform:uppercase; letter-spacing:0.05em; font-weight:600;">Your message</p>
                          <p style="margin:0; color:#1a1a1a; font-size:14px; line-height:1.6;">${message}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:24px 40px; background-color:#f9f9f6; border-top:1px solid #eeeeee;">
                    <p style="margin:0; color:#999999; font-size:12px; line-height:1.6; text-align:center;">
                      Saba Rice · <a href="mailto:contact@sabaricegroup.com" style="color:#999999;">contact@sabaricegroup.com</a>
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

    res.status(201).json({
      success: true,
      message: "Your form has been submitted successfully",
      data: newContact,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitContactForm };
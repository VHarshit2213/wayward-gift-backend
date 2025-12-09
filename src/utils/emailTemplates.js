export function registrationEmailTemplate(name) {
  return `
  <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to Wayward Gifts & Crafts</title>
  </head>

  <body style="font-family: Arial, sans-serif; background-color:#f8f2ea; padding: 20px; margin: 0;">
    <table width="100%" cellpadding="0" cellspacing="0"
      style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; 
      box-shadow:0px 4px 10px rgba(0,0,0,0.08);">

      <!-- Header -->
      <tr>
        <td style="background:#f3e5d0; padding:25px; text-align:center;">
          <img src="http://18.234.1.203:3001/assets/new-BxK6u4yD.png" 
               alt="Wayward Gifts & Crafts" 
               style="width:160px; height:auto;">
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:30px; color:#4a3f35; font-size:15px; line-height:1.6;">
          
          <h2 style="margin-top:0; color:#3c2f27; font-size:22px;">
            Welcome, ${name || "Valued Customer"}!
          </h2>

          <p>
            Thank you for signing up with <strong>Wayward Gifts & Crafts</strong> — your destination for thoughtfully curated and beautifully themed gift baskets.
          </p>

          <p>
            We’re delighted to have you with us! As a registered member, you can now:
          </p>

          <ul style="padding-left:20px; margin:0;">
            <li>Browse our unique, handcrafted gift collections</li>
            <li>Create wishlists and save your favorite items</li>
            <li>Track orders and manage your account with ease</li>
            <li>Receive exclusive offers, seasonal themes, and member-only updates</li>
          </ul>

          <p style="margin-top:15px;">
            Whether youre shopping for a loved one or treating yourself, we’re here to help you find the perfect gift for every occasion.
          </p>

          <p>If you ever need assistance, our support team is always ready to help.</p>

          <p style="margin-top:30px;">
            Warm regards, 🎁<br />
            <strong>The Wayward Gifts & Crafts Team</strong>
          </p>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f8f2ea; padding:15px; text-align:center; font-size:12px; color:#7a6e63;">
          © ${new Date().getFullYear()} Wayward Gifts & Crafts. All rights reserved.<br />
          This is an automated email — please do not reply directly.
        </td>
      </tr>

    </table>
  </body>
</html>
  `;
}

export function forgotPasswordEmailTemplate(name, resetLink) {
  return `
  <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Reset Your Password - Wayward Gifts & Crafts</title>
  </head>

  <body style="font-family: Arial, sans-serif; background-color:#f8f2ea; padding: 20px; margin: 0;">
    <table width="100%" cellpadding="0" cellspacing="0"
      style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; 
      box-shadow:0px 4px 10px rgba(0,0,0,0.08);">

      <tr>
        <td style="background:#f3e5d0; padding:25px; text-align:center;">
          <img src="http://18.234.1.203:3001/assets/new-BxK6u4yD.png" 
               alt="Wayward Gifts & Crafts" 
               style="width:160px; height:auto;">
        </td>
      </tr>

      <tr>
        <td style="padding:30px; color:#4a3f35; font-size:15px; line-height:1.6;">
          
          <h2 style="margin-top:0; color:#3c2f27; font-size:22px;">
            Password Reset Request
          </h2>

          <p>
            Hello <strong>${name || "Valued Customer"}</strong>,
          </p>

          <p>
            We received a request to reset the password for your <strong>Wayward Gifts & Crafts</strong> account. If you made this request, please click the button below to choose a new password:
          </p>

          <div style="text-align:center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color:#3c2f27; color:#ffffff; padding:12px 25px; border-radius:5px; text-decoration:none; font-weight:bold; display:inline-block; font-size:16px;">
              Reset My Password
            </a>
          </div>

          <p>
            If the button above doesn't work, you can also copy and paste the following link into your browser:
          </p>
          <p style="word-break: break-all; font-size: 13px; color:#007bff;">
            <a href="${resetLink}" style="color:#7a6e63; text-decoration:underline;">${resetLink}</a>
          </p>

          <p style="margin-top:20px; font-size:14px; color:#7a6e63; background:#f8f2ea; padding:10px; border-radius:5px;">
            <strong>Note:</strong> If you did not request a password reset, please ignore this email. Your password will remain unchanged.
          </p>

          <p style="margin-top:30px;">
            Warm regards, <br />
            <strong>The Wayward Gifts & Crafts Team</strong>
          </p>

        </td>
      </tr>

      <tr>
        <td style="background:#f8f2ea; padding:15px; text-align:center; font-size:12px; color:#7a6e63;">
          © ${new Date().getFullYear()} Wayward Gifts & Crafts. All rights reserved.<br />
          This is an automated email — please do not reply directly.
        </td>
      </tr>

    </table>
  </body>
</html>
  `;
}
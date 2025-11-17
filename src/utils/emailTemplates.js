export function registrationEmailTemplate(name) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Welcome to Wayward Gifts & Crafts</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin:0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin: auto; background:#ffffff; border-radius: 10px; overflow:hidden; box-shadow:0px 4px 8px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <tr>
          <td style="background:#8A2BE2; padding:20px; text-align:center; color:white; font-size:24px; font-weight:bold;">
            Wayward Gifts & Crafts
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:30px; color:#333;">
            <h2 style="margin-top:0;">Welcome, ${name || "Valued Customer"}!</h2>
            <p>
              Thank you for signing up at <strong>Wayward Gifts & Crafts</strong> – your go-to destination for unique, handmade, and heartfelt gifts.
            </p>
            <p>
              We’re excited to have you on board! As a registered member, you can now:
              <ul style="padding-left: 20px; margin-top:10px;">
                <li>Browse and shop handcrafted items from talented artisans</li>
                <li>Create wishlists and save your favorite products</li>
                <li>Track your orders and manage your account easily</li>
                <li>Receive exclusive offers and promotions</li>
              </ul>
            </p>
            <p>
              Whether you’re shopping for yourself or looking for the perfect gift, we’re here to help you find something truly special.
            </p>
            <p>
              If you ever need assistance, our support team is just a click away.
            </p>
            <p style="margin-top: 30px;">
              Happy shopping! 🎁<br/>
              The Wayward Gifts & Crafts Team
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f4f4f4; padding:15px; text-align:center; font-size:12px; color:#666;">
            © ${new Date().getFullYear()} Wayward Gifts & Crafts. All rights reserved.<br/>
            This is an automated email – please do not reply directly.
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

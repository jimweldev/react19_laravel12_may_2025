<?php

namespace Database\Seeders;

use App\Models\MailTemplate;
use Illuminate\Database\Seeder;

class MailTemplateSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        $content = <<<'HTML'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Welcome Template</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f5f5f4;
      font-family: Arial, sans-serif;
    "
  >
    <table
      role="presentation"
      border="0"
      cellpadding="0"
      cellspacing="0"
      width="100%"
    >
      <tr>
        <td align="center" style="padding: 20px 0">
          <table
            role="presentation"
            border="0"
            cellpadding="0"
            cellspacing="0"
            style="
              background-color: #ffffff;
              border-radius: 6px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            "
          >
            <!-- Header -->
            <tr>
              <td
                align="center"
                style="background-color: #93c5fd; padding: 10px"
              >
                <img
                  src="https://megatool.connextglobal.com/assets/logo_navbar.png"
                  alt="Company Logo"
                  height="36"
                  style="display: block"
                />
              </td>
            </tr>
            <!-- Avatar -->
            <tr>
              <td align="center" style="padding: 20px">
                <table
                  role="presentation"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                >
                  <tr>
                    <td
                      align="center"
                      style="
                        border: 2px solid #ffffff;
                        box-shadow: 0 0 0 2px #fb923c;
                        border-radius: 50%;
                        width: 72px;
                        height: 72px;
                        overflow: hidden;
                      "
                    >
                      <img
                        src="{{ avatar }}"
                        onerror="this.onerror=null; this.src='https://megatool.connextglobal.com/assets/logo.png';"
                        alt="User Avatar"
                        width="72"
                        height="72"
                        style="border-radius: 50%; display: block"
                      />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Greeting -->
            <tr>
              <td style="padding: 10px 20px 20px">
                <h4 style="margin: 0 0 8px 0; font-size: 18px">
                  Hello, {{ name }}!
                </h4>
                <p style="margin: 0; color: #374151">
                  Thank you for connecting with us. We're excited to have you on
                  board.
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="border-top: 1px solid #cbd5e1; padding: 16px 24px">
                <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px">
                  Stay connected with us:
                </p>
                <table
                  role="presentation"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                >
                  <tr>
                    <td style="padding-right: 10px">
                      <a href="https://facebook.com" target="_blank">
                        <img
                          src="https://img.icons8.com/color/48/000000/facebook.png"
                          alt="Facebook"
                          width="20"
                          height="20"
                          style="display: block"
                        />
                      </a>
                    </td>
                    <td style="padding-right: 10px">
                      <a href="https://twitter.com" target="_blank">
                        <img
                          src="https://img.icons8.com/color/48/000000/twitter--v1.png"
                          alt="Twitter"
                          width="20"
                          height="20"
                          style="display: block"
                        />
                      </a>
                    </td>
                    <td style="padding-right: 10px">
                      <a href="https://linkedin.com" target="_blank">
                        <img
                          src="https://img.icons8.com/color/48/000000/linkedin.png"
                          alt="LinkedIn"
                          width="20"
                          height="20"
                          style="display: block"
                        />
                      </a>
                    </td>
                    <td>
                      <a href="https://instagram.com" target="_blank">
                        <img
                          src="https://img.icons8.com/color/48/000000/instagram-new.png"
                          alt="Instagram"
                          width="20"
                          height="20"
                          style="display: block"
                        />
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
HTML;

        try {
            MailTemplate::create([
                'label' => 'welcome_template',
                'content' => $content,
            ]);
        } catch (\Throwable $th) {
            // throw $th;
        }
    }
}

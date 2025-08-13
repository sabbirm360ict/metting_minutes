export const createTenant = (
  owner_name: string,
  username: string,
  password: string
) => {
  return `
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            font-size: 24px;
            color: #2189bb;
        }

        p {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
            margin-bottom: 15px;
        }

        .website-link {
            font-weight: bold;
            color: #2189bb;
            text-decoration: none;
        }

        .credentials {
            background-color: #f1f8ff;
            padding: 15px;
            border-left: 4px solid #2189bb;
            margin: 20px 0;
            border-radius: 5px;
        }

        .credentials p {
            margin: 0 0 8px;
        }

        .footer {
            font-size: 14px;
            color: #888;
            text-align: center;
            margin-top: 30px;
        }

        .footer a {
            color: #173c5e;
            font-weight: bold;
            text-decoration: none;
        }

        .footer p {
            margin: 5px 0;
        }

        @media only screen and (max-width: 600px) {
            .container {
                padding: 15px;
            }
        }
    </style>
</head>

<body>

    <div class="container">
        <h1>Welcome, ${owner_name}!</h1>

        <p>I hope this email finds you well.</p>

        <p>We are pleased to inform you that your website is now live! You can access it using the following domain:</p>

        <p><a href="https://www.recruit360.biz/" target="_blank"
                class="website-link">https://www.recruit360.biz/</a></p>

        <p>Please find your login credentials below:</p>

        <div class="credentials">
            <p><strong>Username:</strong> ${username}</p>
            <p><strong>Password:</strong> ${password}</p>
        </div>

        <p>If you encounter any issues or need further assistance, feel free to reach out. We're here to ensure
            everything runs smoothly.</p>

        <p>Thank you for choosing Recruit360. We look forward to continuing our partnership.</p>

        <p>Best regards,</p>
        <p>Team Recruit360</p>

        <div class="footer">
            <p><a href="https://m360ict.com/" target="_blank">M360ICT</a></p>
        </div>
    </div>

</body>

</html>
        `;
};

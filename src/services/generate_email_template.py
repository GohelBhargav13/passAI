# make a functions to generate a email template for the user
def generate_email_template(otp_code:str) -> str:
    return f"""
    <html>
    <head>
        <style>
            .container {{
                max-width: 600px;       
                margin: 0 auto;
                padding: 20px;
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }}
            .header {{
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                text-align: center;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
            }}
            .content {{
                padding: 20px;
                text-align: center;
            }}
            .otp-code {{
                font-size: 24px;
                font-weight: bold;
                color: #333;
                margin: 20px 0;
            }}
            .footer {{
                background-color: #f4f4f4;
                color: #777;
                padding: 10px 20px;
                text-align: center;
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;
                font-size: 12px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>PASSAI - Your OTP Code</h1>
            </div>
            <div class="content">
                <p>Dear User,</p>
                <p>Your OTP code for PASSAI is:</p>
                <div class="otp-code">{otp_code}</div>
                <p>Please use this code to verify your email address. This OTP is valid for the next 10 minutes.</p>
                <p>If you did not request this code, please ignore this email.</p>
            </div>
            <div class="footer">
                &copy; 2024 PASSAI. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    """
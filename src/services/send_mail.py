import smtplib,os
from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

load_dotenv()

# configure the email server and sender email with html format
EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = os.getenv("EMAIL_PORT")
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_USERNAME = os.getenv("SENDER_USERNAME")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")

# define the function to send email
def send_email(user_email: str, html_content: str, subject: str = "Your OTP Code for PASSAI"):
    try:
        message = MIMEMultipart()
        message['From'] = SENDER_EMAIL
        message['To'] = user_email
        message['Subject'] = subject

        message.attach(MIMEText(html_content, "html"))

        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT, timeout=10) as server:  # ✅ added timeout
            server.starttls()
            server.login(SENDER_USERNAME, SENDER_PASSWORD)
            server.send_message(message)

        return { "status": True, "message": "Email sent successfully" }

    except smtplib.SMTPAuthenticationError:
        # ✅ wrong username/password
        print("SMTP Auth Error - check credentials")
        return { "status": False, "message": "Email authentication failed" }

    except smtplib.SMTPException as e:
        # ✅ any other SMTP error
        print("SMTP Error:", str(e))
        return { "status": False, "message": str(e) }

    except Exception as e:
        print("General Error:", str(e))
        return { "status": False, "message": str(e) }
import smtplib, os
from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

load_dotenv()

EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp-relay.brevo.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))         
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_USERNAME = os.getenv("SENDER_USERNAME")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")        

def send_email(user_email: str, html_content: str, subject: str = "Your OTP Code for PASSAI"):
    try:
        message = MIMEMultipart()
        message['From'] = SENDER_EMAIL
        message['To'] = user_email
        message['Subject'] = subject
        message.attach(MIMEText(html_content, "html"))

        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT, timeout=10) as server:
            server.ehlo()                               
            server.starttls()
            server.ehlo()                              
            server.login(SENDER_USERNAME, SENDER_PASSWORD)
            server.send_message(message)

        return { "status": True, "message": "Email sent successfully" }

    except smtplib.SMTPAuthenticationError:
        print("SMTP Auth Error - check SMTP key in Brevo dashboard")
        return { "status": False, "message": "Email authentication failed" }

    except smtplib.SMTPConnectError as e:              
        print("Connection Error:", str(e))
        return { "status": False, "message": "Could not connect to email server" }

    except smtplib.SMTPException as e:
        print("SMTP Error:", str(e))
        return { "status": False, "message": str(e) }

    except Exception as e:
        print("General Error:", str(e))
        return { "status": False, "message": str(e) }
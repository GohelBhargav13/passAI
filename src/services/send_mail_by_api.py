import requests
import os
from dotenv import load_dotenv

load_dotenv()

def send_email_api(user_email: str, html_content: str, subject: str = "Your OTP Code for PASSAI"):
    smtp_base_url = os.getenv("BREVO_BASE_URL","https://example.com/api/send-email")
    
    try:
        # build a header with API key for authentication
        headers = {
            "content-type":"application/json",
            "api-key":os.getenv("SENDER_PASSWORD")
        }

        # design a payload with email details
        payload = {
            "sender":{ "email": os.getenv("SENDER_EMAIL") },
            "to":[ { "email": user_email } ],
            "subject": subject,
            "htmlContent": html_content
        }

        # send a POST request to the SMTP API endpoint
        response = requests.post(smtp_base_url,json=payload,headers=headers,timeout=10)
        response.raise_for_status() # for raise the error if the response status code is not 2xx

        if response.status_code == 201:
            return { "status": True, "message": "Email sent successfully" }
        else:
            print("API Error:", response.status_code, response.text)
            return { "status": False, "message": f"API error: {response.status_code}" }
        
    except requests.exceptions.RequestException as e:
        print("Request Error:", str(e))
        return { "status": False, "message": "Failed to send email due to request error" }
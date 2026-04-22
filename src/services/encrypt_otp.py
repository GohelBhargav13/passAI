import hashlib
from dotenv import load_dotenv
import os

load_dotenv()

def encrypt_otp(otp_code:str):
    key = os.getenv("OTP_ENCRYPT_KEY")
    encrypted_otp = hashlib.sha256((otp_code + key).encode()).hexdigest()
    return encrypted_otp


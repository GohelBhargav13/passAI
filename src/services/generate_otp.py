# Generate a otp of the 6 digit for the user
import random

def generate_otp_code() -> str:
    random_otp = ""
    for i in range(6):
        random_otp += str(random.randint(1,9))
    return random_otp

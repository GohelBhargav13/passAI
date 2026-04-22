import jwt,os
from datetime import datetime
from src.utills.apierror import ApiError

JWT_SECRET = os.getenv("JWT_SECRET_KEY")
def generate_security_token(user_id):
    data = {
        "user_id":user_id,
        "exp":datetime.now() + 60 * 60 * 24
    }
    return jwt.encode(data,JWT_SECRET,algorithm="sha256")

def deocde_security_token(token:str):
    try:
        decoed_token = jwt.decode(token,JWT_SECRET,algorithms="sha256")

        if decoed_token.get("user_id") is None:
            raise ApiError(400,"User id is not found")
        
        return { "status":True, "user_id":decoed_token.get("user_id") }
        
    except jwt.ExpiredSignatureError as es:
        raise ApiError(500,str(es))
    except Exception as e:
        raise ApiError(500,str(e))
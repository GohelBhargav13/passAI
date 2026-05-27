from src.services.redis_services.redis_object import redis_create_object
from src.utills.apierror import ApiError
from functools import wraps
from flask import request as req

# get the redis objct for api_rate_limiting
redis_object = redis_create_object()

# check the redis object is loaded or not
if not redis_object.ping():
    raise ApiError(500,"caching is not loaded")


MAX_CLOSE_WINDOW = 60 * 60 * 24
MAX_TRIES = 2

def paper_api_rate_limiter(func):

    # @wraps() holds the original function identity ( name, behaviour, )
    @wraps(func)
    def wrapper(*args, **kwargs):
            # get the user IP address from the headers
           user_ip_headers = req.headers.get("X-Forwarded-For")

           if user_ip_headers is None:
                user_id = f"user:{req.remote_addr}"
           else:
                user_id = f"user:{user_ip_headers.split(',')[0].strip()}"

           user_tries = redis_object.get(user_id)

           if user_tries and int(user_tries) > MAX_TRIES:
               raise ApiError(429,"Too Many requests now try after 24 hours")
           
           current_user_count = redis_object.incr(user_id,1)

           if current_user_count == 1:
               redis_object.expire(user_id,MAX_CLOSE_WINDOW)
        
           result = func(*args,**kwargs)

           return result 
    
    return wrapper




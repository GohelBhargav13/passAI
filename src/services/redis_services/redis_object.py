import os
from redis import Redis
from dotenv import load_dotenv
from src.utills.apierror import ApiError

load_dotenv()

redis_cloud_url = os.getenv("REDIS_CLOUD_URL")

if not redis_cloud_url:
    raise ApiError(500,"Cloud URL is not found")

def redis_create_object():
    return Redis(
        host=redis_cloud_url,
        decode_responses=True,
        retry_on_timeout=True
    )

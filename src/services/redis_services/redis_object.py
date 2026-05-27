from redis import Redis

def redis_create_object():
    return Redis(
        host="localhost",
        port=6379,
        decode_responses=True,
        retry_on_timeout=True
    )






from redis_handler import RedisHandler


def get_redis_keys():
    obj = RedisHandler()

    print(obj.redis.keys())

get_redis_keys()
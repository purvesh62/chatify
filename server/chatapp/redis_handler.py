import json
import logging
import redis
from secret_manager import SecretManager


class RedisHandler:

    def __init__(self):
        secret_obj = SecretManager()
        redis_configurations = secret_obj.get_secret_value("redis")
        redis_configurations = json.loads(redis_configurations)
        self.redis = redis.Redis(
            host=redis_configurations.get("host"),
            port=redis_configurations.get("port"),
            username=redis_configurations.get("user"),
            password=redis_configurations.get("password")
        )

    def get_item(self, key):
        try:
            data = self.redis.get(key)
            if data:
                return json.loads(data.decode())
        except Exception as exc:
            logging.exception(exc)
        return None

    def set_item(self, key, value):
        status = False
        try:
            if isinstance(value, list) or isinstance(value, dict):
                value = json.dumps(value)
            self.redis.set(key, value)
            status = True
        except Exception as exc:
            logging.exception(exc)
        return status

    def delete_item(self, key):
        status = False
        try:
            self.redis.delete(key)
            status = True
        except Exception as exc:
            logging.exception(exc)
        return status

    def add_element_to_list(self, key, element):
        status = False
        try:
            value = self.get_item(key)
            if value:
                value.append(element)
                self.set_item(key, value)
                status = True
        except Exception as exc:
            logging.exception(exc)
        return status

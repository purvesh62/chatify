import json
import boto3
from redis_handler import RedisHandler

api_connection_url = "https://2b53u49ch2.execute-api.us-east-1.amazonaws.com/production"

api_client = boto3.client('apigatewaymanagementapi', endpoint_url=api_connection_url)

redis = RedisHandler()


class SocketHandler:

    def __init__(self, event):
        self.event = event
        self.connection_id = self.event.get('requestContext').get('connectionId')

    def connect(self):
        socket_ids = redis.get_item("socket_ids")

        if socket_ids:
            socket_ids = json.loads(socket_ids)
            socket_ids.append(self.connection_id)
        else:
            socket_ids = json.dumps([self.connection_id])

        redis.set_item("socket_ids", socket_ids)

        print(f"CONNECTED {self.connection_id}")

    def chat(self):
        connection_id = self.connection_id

        event_body = {
            "message": "Hello from Lambda!",
            "type": "Global message"
        }

        socket_ids = redis.get_item("socket_ids")
        if socket_ids:
            socket_ids = json.loads(socket_ids)
            for id in socket_ids:
                self.send_message(id, event_body)

    def send_message(self, id, body):
        print("message body: ", body)
        api_client.post_to_connection(ConnectionId=id, Data=json.dumps(body))

    def create_room(self):
        print("Create room")

    def join_room(self):
        print("join room")

    def disconnect(self):
        socket_ids = redis.get_item("socket_ids")

        if socket_ids:
            socket_ids = json.loads(socket_ids)
            socket_ids.remove(self.connection_id)

            if len(socket_ids) > 1:
                redis.set_item("socket_ids", socket_ids)
            else:
                redis.delete_item("socket_ids")

        print("DISCONNECT called")




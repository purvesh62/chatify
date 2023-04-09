import json
import boto3
import string
import random
import logging
from redis_handler import RedisHandler

api_connection_url = "https://2b53u49ch2.execute-api.us-east-1.amazonaws.com/production"

api_client = boto3.client('apigatewaymanagementapi', endpoint_url=api_connection_url)

redis = RedisHandler()


class SocketHandler:

    def __init__(self, event):
        self.event = event
        self.connection_id = self.event.get('requestContext').get('connectionId')
        self.body = json.loads(self.event.get('body')) if "body" in self.event else {}
        self.key_all_socket_ids = "socket_ids"
        self.key_rooms = "rooms"
        self.key_sockets = "sockets"
        self.key_room_sockets = "room_"

    """
        Utility functions
    """

    def send_message(self, body, id=None):
        if not id:
            id = self.connection_id
        api_client.post_to_connection(ConnectionId=id, Data=json.dumps(body))

    def get_socket_map(self):
        sockets_map = redis.get_item(self.key_sockets)
        if not sockets_map:
            return {}
        return sockets_map

    def get_room_id(self):
        sockets = self.get_socket_map()
        if sockets:
            return sockets[self.connection_id]
        return None

    def get_rooms(self):
        rooms = redis.get_item(self.key_rooms)
        if not rooms:
            return []
        return rooms

    """
        Connection functions
    """

    def connect(self):
        pass

    def chat(self):
        room_id = self.get_room_id()
        sockets_in_room = redis.get_item(f"{self.key_room_sockets}{room_id}")
        message = self.body.get("message")
        language = self.body.get("language", "en")
        for socket in sockets_in_room:
            print(f"Sending message to {socket} with {message}")
            self.send_message({
                "type": "chat",
                "message": message,
                "language": language
            }, socket)

    def create_room(self):
        try:
            new_room_id = "".join(random.choice(string.ascii_letters) for c in range(1, 10))
            # Add cache: connection_id -> room_id
            sockets_map = self.get_socket_map()
            sockets_map[self.connection_id] = new_room_id
            redis.set_item(self.key_sockets, sockets_map)

            # Add cache: room_id -> rooms
            rooms = self.get_rooms()
            rooms.append(new_room_id)
            redis.set_item(self.key_rooms, rooms)

            # Add cache: room_unique_socket_id -> connection_id
            room_socket_ids = [self.connection_id]
            redis.set_item(f"{self.key_room_sockets}{new_room_id}", room_socket_ids)

            self.send_message(
                {
                    "type": "create_room",
                    "message": "Room created.",
                    "room_id": new_room_id,
                    "status": 200
                }
            )
        except Exception as exc:
            logging.exception(exc)
            self.send_message({
                "type": "create_room",
                "message": "Error while creating group",
                "room_id": None,
                "status": 400
            })

    def join_room(self):
        rooms = self.get_rooms()
        room_id = self.body.get('room_id')
        print("room body: ", self.body)
        if len(rooms) > 0 and room_id in rooms:
            room_sockets = redis.get_item(f"{self.key_room_sockets}{room_id}")
            room_sockets.append(self.connection_id)
            print(f"Socket rooms: {room_sockets}")
            # Add cache room_socket -> connect_id
            redis.set_item(f"{self.key_room_sockets}{room_id}", room_sockets)

            sockets_map = self.get_socket_map()
            sockets_map[self.connection_id] = room_id
            redis.set_item(self.key_sockets, sockets_map)
            for socket in room_sockets:
                print(f"Sending message to {socket}")
                self.send_message({
                    "type": "chat",
                    "message": f"{self.body.get('message').get('username')} has joined the chat."
                }, socket)

            self.send_message({
                "type": "join_room",
                "message": "Added to the group.",
                "room_id": room_id,
                "status": 200
            })
            return

        self.send_message({
            "type": "join_room",
            "message": "Room ID does not exist.",
            "status": 404
        })
        return

    def disconnect(self):

        sockets = self.get_socket_map()
        if self.connection_id in sockets:
            room_id = sockets[self.connection_id]

            # Delete key from socket
            del sockets[self.connection_id]
            redis.set_item(self.key_sockets, sockets)

            # Remove socket from room socket cache
            sockets_in_room = redis.get_item(f"{self.key_room_sockets}{room_id}")
            sockets_in_room.remove(self.connection_id)

            if len(sockets_in_room) == 0:
                # Delete the room if no sockets exists
                redis.delete_item(f"{self.key_room_sockets}{room_id}")
                rooms = self.get_rooms()
                rooms.remove(room_id)
                redis.set_item(self.key_rooms, rooms)
            else:
                redis.set_item(f"{self.key_room_sockets}{room_id}", sockets_in_room)

        logging.info(f"{self.connection_id} DISCONNECTED")


def lambda_handler(event, context):
    try:
        # Get event type and call the function
        """
            {
                "message": "",
                "action": "",
            }
        """
        print(event)
        event_type = event['requestContext']['routeKey'].replace("$", "")
        if event_type == "default":
            event_type = json.loads(event['body'])['action']
        obj = SocketHandler(event)
        getattr(obj, event_type)()

    except Exception as e:
        logging.exception(e)

    return {
        'statusCode': 200,
        'body': ''
    }

import redis
import boto3
import json
import logging
import uuid
import random
import string


class SystemManager:

    def __init__(self):
        self.ssm = boto3.client('ssm')

    def get_parameter(self, parameter_name):
        response = self.ssm.get_parameter(
            Name=parameter_name,
            WithDecryption=True | False
        )

        if response.get('Parameter').get('Value'):
            return response.get('Parameter').get('Value')
        else:
            logging.error("Error while fetching the parameter.")
            return ""


sys_obj = SystemManager()

r = redis.Redis(
    host=sys_obj.get_parameter("redis_host"),
    port=sys_obj.get_parameter("redis_port"),
    username=sys_obj.get_parameter("redis_user"),
    password=sys_obj.get_parameter("redis_password"))

connection_id = str(uuid.uuid4())

key_rooms = "rooms"
key_sockets = "sockets"
key_room_sockets = "room_"


def generate_room_id():
    return "".join(random.choice(string.ascii_letters) for c in range(1, 10))


def generate_connection_id():
    return "".join(random.choice(string.digits + string.ascii_letters) for c in range(1, 10))


def get_socket_map():
    value_id_room_map = r.get(key_sockets)
    if value_id_room_map:
        socket_map = json.loads(value_id_room_map)
    else:
        socket_map = {}
    return socket_map


def create_room(id):
    # Generate room ID
    new_room_id = generate_room_id()

    # Connect SocketID with RoomId
    socket_ids = get_socket_map()
    socket_ids[id] = new_room_id
    r.set(key_sockets, json.dumps(socket_ids))

    # Add new room id to room_ids cache
    rooms = [new_room_id]
    r.set(key_rooms, json.dumps(rooms))

    # Map SocketId with RoomId
    room_socket_ids = [id]
    r.set(f"{key_room_sockets}{new_room_id}", json.dumps(room_socket_ids))

    print(f"Room {new_room_id} created.")
    return new_room_id


def get_rooms(id=None):
    rooms = r.get(key_rooms)
    if rooms:
        rooms = json.loads(rooms.decode())

    if id:
        # Check room exists
        if id in rooms:
            return True
        else:
            return False
    else:
        print("Rooms: ")
        for r_id in rooms:
            print(r_id)
        return rooms


def add_to_room(id, room_id):
    room_sockets = r.get(f"{key_room_sockets}{room_id}")

    if room_sockets:
        room_sockets = json.loads(room_sockets.decode())
        room_sockets.append(id)
    else:
        room_sockets = [id]

    # Add ID -> ROOM sockets
    r.set(f"{key_room_sockets}{room_id}", json.dumps(room_sockets))

    sockets_map = get_socket_map()
    sockets_map[id] = room_id
    r.set(key_sockets, json.dumps(sockets_map))

    print("Added to the room")


def connect():
    connection_id = generate_connection_id()
    room = ""
    print("ConnectionId: ", connection_id)

    choice = input("1. Create room. \n2.Join room. \nEnter your choice: ")

    if choice == '1':
        room = create_room(connection_id)
    else:
        # Join room
        get_rooms()

        while True:
            room = input("Enter room id: ")
            status = get_rooms(room)
            if status:
                # add to room
                add_to_room(connection_id, room)
                break
            else:
                # room does not exist
                print("Room does not exists. Try again")
                choice2 = input("y/n to continue")
                if choice2 != "y":
                    break
    print("Connect process finished.")
    return connection_id, room


def send_message(id, message):
    socket_map = get_socket_map()
    room_id = socket_map.get(id)

    sockets_in_room = json.loads(r.get(f"{key_room_sockets}{room_id}").decode())
    for socket in sockets_in_room:
        print(f"Sent {message} to {socket}")


def disconnect(id):
    sockets = get_socket_map()
    room_id = sockets[id]

    # Remove socket from room
    sockets_in_room = json.loads(r.get(f"{key_room_sockets}{room_id}").decode())
    sockets_in_room.remove(id)

    if len(sockets_in_room) == 0:
        # Delete the room if no sockets exists
        r.delete(f"{key_room_sockets}{room_id}")

        # Delete the room ID from cache
        rooms = get_rooms()
        rooms.remove(room_id)
        r.set(key_rooms, json.dumps(rooms))

    # Delete ID from sockets
    del sockets[id]


if __name__ == "__main__":
    # connection_id, room = connect()
    # print(f"Created: connectionId = {connection_id} roomId = {room}")
    #
    # connection_id, room = connect()
    # print(f"Created: connectionId = {connection_id} roomId = {room}")
    #
    # connection_id, room = connect()
    # print(f"Created: connectionId = {connection_id} roomId = {room}")
    #
    # send_message(connection_id, "Hello")

    r.keys()

    {"message": "Hi", "action": "create_room"}
    {"message": "hello", "action": "join_room", "room_id": "iduelgQja"}
    {"message": "hello", "action": "chat"}
import asyncio
import websockets

from classes.IMU_v2 import IMU

imu = IMU("COM9", 115200)

# Dictionary to store connected clients
clients = set()

# Function to handle incoming messages from clients
async def handle_client(websocket, path):
    clients.add(websocket)
    try:
        while True:
            # Wait for a message from the client
            message = await websocket.recv()

            # Check if the message is a specific call
            if message == "specific_call":
                # imu.calibrate_gyros()
                pass
            else:
                print(f"Received message: {message}")

    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        # Remove the client from the set when the connection is closed
        clients.remove(websocket)

# Function to broadcast messages to all connected clients
async def broadcast(message):
    for client in clients:
        await client.send(message)

# Function to constantly broadcast messages
async def broadcast_task():
    while True:
        try:
            imu.update_pose()
            pr = str(imu.get_pose_json())
            print(pr)
            await broadcast(pr)
        except Exception as e:
            print(e)
        await asyncio.sleep(0)  # Broadcast every 1 second

# Start the WebSocket server
start_server = websockets.serve(handle_client, "localhost", 8765)

# Start the broadcast task in the event loop
async def main():
    await asyncio.gather(start_server, broadcast_task())

# Run the event loop
if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())

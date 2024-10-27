# Real-Time Chat Application with Publisher-Subscriber Setup in Go

This application implements a basic publisher-subscriber mechanism in Go for real-time chat. Users can join individual channels to send and receive messages. It supports creating rooms based on channel names, broadcasting messages to all nodes, and connecting over a socket-based communication system.

[![Watch the video](https://img.youtube.com/vi/5A7HuIGUGnY/maxresdefault.jpg)](https://youtu.be/5A7HuIGUGnY)

Click the image above to watch a demo of the application.

## Features

- **Channel-Based Communication**: Users can connect to specific channels and receive all messages on that channel.
- **Broadcast Messaging**: Messages sent on a socket connection are broadcasted to all nodes.
- **Dynamic Room Creation**: Rooms are dynamically created based on channel names.

## Potential Future Enhancements

- **Peer-to-Peer Connections**: Enable direct communication between peers.
- **Data Persistence**: Store messages for historical access and durability.
- **End-to-End Encryption**: Enhance security with peer-to-peer encryption.
- **Additional Features**: Explore more functionalities as needed.

## Prerequisites

- **Docker**: Make sure you have Docker and Docker Compose installed.

## Getting Started

### Clone the Repository

To start, clone the repository from GitHub:

```bash
git clone https://github.com/doppedheat/pubsub.git
```

### Run the Application with Docker
use Docker compose to build and run the application:
```bash
docker-compose up --build
```
### Access the application
once the application is running, open your browser and navigate to:
```bash
http://localhost:8080
```

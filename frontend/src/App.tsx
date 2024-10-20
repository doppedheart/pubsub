import React,{useEffect, useState} from 'react';

function App() {
  return (
       <ChatApp/>
  )
}

interface Message {
    username: string;
    message: string;
}

const ChatApp = () => {
    const [username, setUsername] = useState('');
    const [channel, setChannel] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [connected, setConnected] = useState(false);
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        if (ws) {
            ws.onmessage = (event) => {
                console.log('connected')
                const message: Message = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, message]);
            };
            ws.onopen =()=>{
                console.log("connection open")
            }
            ws.onclose = () => {
                console.log('Connection closed')
            };

            ws.onerror = (event) => {
                console.error('Error occurred:', event);
            };
        }
    }, [ws]);

    const handleUsernameAndChannelSubmit = () => {
        try{
            if (username && channel) {
                const wsUrl = `ws://localhost:8080/ws/${channel}`;
                const newWs = new WebSocket(wsUrl);
                setWs(newWs);
                setConnected(true)
            }
        }catch (err){
            console.log("ERRRRRRRR")
            console.log(err);
        }
    };

    const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (ws && newMessage) {
            ws.send(JSON.stringify({ username, message: newMessage }));
            setNewMessage('');
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            {!connected && (
                <div>
                    <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Enter Your Username:
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="Username"
                        className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
                    />
                    <label
                        htmlFor="channel"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Enter channel name where you want to connect
                    </label>
                    <input
                        type="text"
                        id="channel"
                        value={channel}
                        onChange={(event) => setChannel(event.target.value)}
                        placeholder="channel"
                        className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
                    />
                    <button
                        onClick={handleUsernameAndChannelSubmit}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Submit
                    </button>
                </div>
            )}
            {connected && (
                <div>
                    <div
                        id="messages"
                        className="h-80 overflow-y-scroll p-4 border border-gray-300 rounded-md"
                    >
                        {messages.map((message, index) => (
                            <div key={index}>
                                <span className="font-bold">{message.username}:</span>{' '}
                                {message.message}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            id="input"
                            value={newMessage}
                            onChange={(event) => setNewMessage(event.target.value)}
                            placeholder="Type a message..."
                            className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default App

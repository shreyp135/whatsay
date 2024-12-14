import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import api from "../utils/api";

interface Message {
  _id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: string;
}

interface User {
  _id: string;
  username: string;
  isActive: boolean;
}

function Chatroom() {
  const { chatroomid } = useParams<{ chatroomid: string }>();
  const userId = localStorage.getItem("userid");
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currmessage, setCurrmessage] = useState<string>("");
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatroomName, setChatroomName] = useState<string>("");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await api.get(`/chatroom/${chatroomid}/chats`,{
            headers: {chatroomid: chatroomid}
        });
        setMessages(response.data.messages);
        setChatroomName(response.data.name);
        console.log(response.data.messages);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };

    fetchChats();
  }, [chatroomid]);

  useEffect(() => {
    const newSocket = io("http://localhost:9000"); 
    setSocket(newSocket);
    console.log(userId);
    console.log(chatroomid);  

    newSocket.emit("join_room", { chatroomid, userId });

    newSocket.on("receive_message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on("updated_users", (users: User[]) => {
      setActiveUsers(users);
    });

    return () => {
      newSocket.emit("leave_room", { chatroomid, userId });
      newSocket.disconnect();
    };
  }, [userId, chatroomid]);

  const handleSendMessage = () => {
    if (!currmessage.trim() || !socket) return;
    socket.emit("send_message", { userId, chatroomid, text: currmessage });
    setCurrmessage("");
  };

  const handleLeaveRoom = () => {
    if (socket) {
      socket.emit("leave_room", { chatroomid, userId });
      socket.disconnect();
    }
    navigate("/");
  };

  return (
    <div className="flex ">

      <div className="w-[23%]  p-4 border-r border-r-black flex flex-col justify-between ">
        <div>
            <h2 className="text-lg font-semibold mt-4 mb-8 text-center">Active Users</h2>
            <ul className="space-y-2 ml-20">
            {activeUsers.map((user) => (
                <li
                key={user._id} 
                className={`p-2 rounded w-[60%] bg-yellow-100  text-center }`}
                >
                {user._id===userId? "You":user.username}
                </li>
            ))}
            </ul>
        </div>
        <div className="mt-2 flex justify-center">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleLeaveRoom}
          >
            Leave Room
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 ">
        <div className="mb-4">
            <h1 className="text-2xl font-semibold">Room: {chatroomName}</h1>
          <h1 className="text-l font-normal">ID: {chatroomid}</h1>
        </div>

        <div className="h-[75vh] overflow-auto [&::-webkit-scrollbar]:hidden border p-4">
  {messages.map((msg) => (
    <div
      key={msg._id}
      className={`w-full flex ${
        msg.userId === userId ? "justify-end" : "justify-start"
      }`}
    >
      <div className="mb-3 bg-violet-300 w-fit p-1 rounded-md min-w-[15%] ml-4">
        <div className="text-xs text-gray-700 text-left ml-2 font-semibold">
          {msg.userId === userId ? "You" : msg.username}
        </div>
        <div className="ml-6 mt-1">{msg.text}</div>
        <div className="text-xs text-right text-gray-500">
          {new Date(msg.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  ))}
</div>


<div className="flex">
  <input
    type="text"
    className="border p-2 flex-1 rounded-md"
    value={currmessage}
    onChange={(e) => setCurrmessage(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter" && currmessage.trim()) {
        handleSendMessage();
      }
    }}
    placeholder="Type a message..."
  />
  <button
    className="bg-purple-500 text-white px-4 py-2 rounded ml-2"
    onClick={handleSendMessage}
  >
    Send
  </button>
</div>
      </div>
    </div>
  );
}

export default Chatroom;

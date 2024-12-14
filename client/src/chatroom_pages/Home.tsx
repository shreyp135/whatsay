import api from "../utils/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Chatroom {
  _id: string;
  name: string;
  status: boolean; 
  created_by: {
    id: string;
    username: string;
  };
}

const Home: React.FC = () => {
  const [activeChatrooms, setActiveChatrooms] = useState<Chatroom[]>([]);
  const [dormantChatrooms, setDormantChatrooms] = useState<Chatroom[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getChatrooms();
  }, []);

  const getChatrooms = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/chatroom/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const activeChatrooms = response.data.activeChatRooms;
      const dormantChatrooms = response.data.dormantChatRooms;
      setActiveChatrooms(activeChatrooms);
      setDormantChatrooms(dormantChatrooms);
    } catch (err) {
      console.error("Error fetching chatrooms", err);
    }
  };

  const handleJoinChatroom = (chatroomId: string) => {
    navigate(`/chatroom/${chatroomId}`);
  };

  return (
    <div className="h-[100vh]">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Chatrooms</h1>

        {/* Active Chatrooms */}
        <h2 className="text-xl font-semibold mb-2">Active Chatrooms</h2>
        <ul className="mb-6">
          {activeChatrooms.map((chatroom) => (
            <li
              key={chatroom._id}
              className="p-4 bg-green-100 rounded mb-2 cursor-pointer hover:bg-green-200"
              onClick={() => {handleJoinChatroom(chatroom._id)}}
            >
              <div>
                <span className="font-bold">{chatroom.name}</span>
                <span className="ml-2 text-sm text-gray-600">
                  (Created by: {chatroom.created_by.username})
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* Dormant Chatrooms */}
        <h2 className="text-xl font-semibold mb-2">Dormant Chatrooms</h2>
        <ul>
          {dormantChatrooms.map((chatroom) => (
            <li
              key={chatroom._id}
              className="p-4 bg-gray-100 rounded mb-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleJoinChatroom(chatroom._id)}
            >
              <div>
                <span>{chatroom._id}</span>
                <span className="font-bold">{chatroom.name}</span>
                <span className="ml-2 text-sm text-gray-600">
                  (Created by: {chatroom.created_by.username})
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;

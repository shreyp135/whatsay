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
  const userId = localStorage.getItem("userid");
  const [activeChatrooms, setActiveChatrooms] = useState<Chatroom[]>([]);
  const [dormantChatrooms, setDormantChatrooms] = useState<Chatroom[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getChatrooms();
  }, []);

  const getChatrooms = async () => {
    try {
      // const token = localStorage.getItem("token");
      const response = await api.get("/chatroom/");
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
      <div className="p-6 ml-4">
        <h1 className="text-4xl font-semibold mb-4 text-center">Chatrooms</h1>

        {/* Active Chatrooms */}
        <h2 className="text-xl font-semibold mb-2">Active Chatrooms</h2>
        <ul className="w-[90%]  justify-center grid grid-cols-2 gap-4 p-2 ml-12 mb-4">
          {activeChatrooms.map((chatroom) => (
            <li
              key={chatroom._id}
              className="p-4 bg-gray-100 rounded mb-2 cursor-pointer hover:bg-gray-200 hover:duration-200 border border-green-500"
              onClick={() => {handleJoinChatroom(chatroom._id)}}
            >
              <div className="flex justify-around items-center">
                <span className="text-2xl font-semibold">{chatroom.name}</span>
                <div className="flex flex-col">
                  <span className="ml-2 text-sm text-gray-600">
                    Created by: {chatroom.created_by.username}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">
                    Chatroom id: {chatroom._id}
                  </span>
                </div>
                <button className="text-white px-6 py-1.5 rounded-md bg-purple-400 hover:bg-purple-500 hover:duration-150">Join</button>
              </div>
            </li>
          ))}
        </ul>

        {/* Dormant Chatrooms */}
        <h2 className="text-xl font-semibold mb-2">Dormant Chatrooms</h2>
        <ul className="w-[90%]  justify-center grid grid-cols-2 gap-4 p-2 ml-12">
          {dormantChatrooms.map((chatroom) => (
            <li
              key={chatroom._id}
              className="p-4 bg-gray-100 rounded mb-2 cursor-pointer hover:bg-gray-200 hover:duration-200"
              onClick={() => handleJoinChatroom(chatroom._id)}
            >
              <div className="flex justify-around items-center">
                <span className="text-2xl font-semibold">{chatroom.name}</span>
                <div className="flex flex-col">
                  <span className="ml-2 text-sm text-gray-600">
                    Created by: {chatroom.created_by.id ===userId?"You": chatroom.created_by.username}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">
                    Chatroom id: {chatroom._id}
                  </span>
                </div>
                <button className="text-white px-6 py-1.5 rounded-md bg-purple-400 hover:bg-purple-500 hover:duration-150">Join</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;

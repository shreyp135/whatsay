import React, { useEffect, useState } from 'react';
import { isAdmin } from '../utils/authCheck';
import api from '../utils/api';

interface Chatroom {
  _id: string;
  name: string;
  createdBy: string;
}

const ManageChatrooms: React.FC = () => {
  const isAdminUser = isAdmin();
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [newName, setNewName] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [chatroomid, setChatroomId] = useState<string>('');


  // get all the Chatrooms
  const fetchChatrooms = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const response = await api.get(`/chatroom/admin/`,{
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(response.data.chatrooms);
      setChatrooms(response.data.chatrooms);
    } catch (error) {
      console.error('Error fetching chatrooms:', error);
    }
  };

  // Update Chatroom Name
  const handleEdit = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(
        `/chatroom/${id}`,
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewName('');
      setEditModalOpen(false);
      fetchChatrooms(); // Refresh chatrooms
    } catch (error) {
      console.error('Error updating chatroom:', error);
    }
  };

  // Delete Chatroom
  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/chatroom/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchChatrooms(); // Refresh chatrooms
    } catch (error) {
      console.error('Error deleting chatroom:', error);
    }
  };

  const handleCreateChatroom = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post(
        `/chatroom`,
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // console.log('Chatroom created');
      setNewName('');
      setModalOpen(false);
      fetchChatrooms();
    } catch (error) {
      console.error('Error creating chatroom:', error);
    }
  };

  useEffect(() => {
    fetchChatrooms();
  }, []);

  return (


    <div className="container mx-auto py-4 h-[100vh]">
          {!isAdminUser ? <div className='text-2xl mt-64 ml-64 h-[100vh]'>
        Authorization Error !!
      </div> : 
          <div>
            <h1 className="text-2xl font-bold mb-4">Manage Chatrooms</h1>
            <button
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
        onClick={() => setModalOpen(true)}
      >
        Create Chatroom
      </button>


            {(chatrooms===undefined) ?(
              <div className='text-2xl mt-64 ml-64 h-[100vh]'>
                No Chatrooms Found
              </div>
            ):(
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Chatroom Name</th>
                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {chatrooms.map((chatroom) => (
                    <tr key={chatroom._id}>
                      <td className="border border-gray-300 px-4 py-2">{chatroom.name}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                          onClick = {() => {setEditModalOpen(true), setChatroomId(chatroom._id)}}   >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded"
                          onClick={() => handleDelete(chatroom._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    ))}
                </tbody>
              </table>


              )} 


      {/* Modal for Creating Chatroom */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Create New Chatroom</h2>
            <input
              type="text"
              placeholder="Chatroom Name"
              className="border border-gray-300 px-4 py-2 rounded w-full mb-4"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleCreateChatroom}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
        {/* Modal for edit name */}
        {editModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Edit chatroom name </h2>
            <input
              type="text"
              placeholder="New Name"
              className="border border-gray-300 px-2 py-1 rounded mr-2"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => handleEdit(chatroomid)} >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}


      </div>
      }
      

    </div>
  );
};

export default ManageChatrooms;

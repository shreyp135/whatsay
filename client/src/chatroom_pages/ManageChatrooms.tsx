import React, { useEffect, useState } from 'react';
import { isAdmin } from '../utils/authCheck';
import api from '../utils/api';
import { Link } from 'react-router-dom';

interface Chatroom {
  _id: string;
  name: string;
  createdBy: string;
  created_at: string;
  status: boolean;
}
interface sortOptions {
  type: string;
  order: number;
}
interface filterOptions {
  date: {from: string, to: string};
  isActive: string;
  isFiltered: boolean;
}

const ManageChatrooms: React.FC = () => {
  const isAdminUser = isAdmin();
  const [chatroomsOriginal, setChatroomsOriginal] = useState<Chatroom[]>([]);
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [newName, setNewName] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
  const [chatroomid, setChatroomId] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [sorting, setSorting] = useState<sortOptions>({ type: 'created_at', order: -1 });
  const [filter, setFilter] = useState<filterOptions>({ date: {from: '', to: ''}, isActive: "All", isFiltered: false });


  // get all the Chatrooms
  const fetchChatrooms = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const response = await api.get(`/chatroom/admin/`,{
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(response.data.chatrooms);
      setChatroomsOriginal(response.data.chatrooms);
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

  // filtering 
  const handleClearFilter = () => {
    setFilter({ date: {from: '', to: ''}, isActive: "All", isFiltered: false });
    setChatrooms(chatroomsOriginal);
    setFilterModalOpen(false);

  };
  const handleFilter = () => {
    setFilter({ ...filter, isFiltered: true });
    setFilterModalOpen(false);
  };


  useEffect(() => {
    fetchChatrooms();
  }, []);

  useEffect(() => {
    let results = [...chatroomsOriginal];  // Create a copy to avoid mutating the original state
  
    // Search Filter
    if (search) {
      results = results.filter((chatroom) =>
        chatroom.name.toLowerCase().includes(search.toLowerCase())
      );
    }
  
    // Sorting
    if (sorting.type === 'name') {
      results = [...results].sort((a, b) => sorting.order * a.name.localeCompare(b.name)); // Create new array before sorting
    } else if (sorting.type === 'created_at') {
      results = [...results].sort((a, b) =>
        sorting.order * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      ); // Create new array before sorting
    }
  
    // Active/Inactive Filter
    if (filter.isFiltered) {
      if (filter.isActive === 'true') {
        results = results.filter((chatroom) => chatroom.status === true);
      } else if (filter.isActive === 'false') {
        results = results.filter((chatroom) => chatroom.status === false);
      }
    }
  
    // Date Range Filter
    if (filter.date.from && filter.date.to) {
      const fromDate = new Date(filter.date.from);
      const toDate = new Date(filter.date.to);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);
      results = results.filter((chatroom) => {
        const chatroomDate = new Date(chatroom.created_at).getTime();
        return chatroomDate >= fromDate.getTime() && chatroomDate <= toDate.getTime(); ;
      });
    }
  
    // Set the filtered results to state
    setChatrooms(results);
  
  }, [search, sorting, chatroomsOriginal, filter]);
      
  return (


    <div className="container mx-auto py-4 h-[100vh]">
          {!isAdminUser ? <div className='text-2xl mt-64 ml-64 h-[100vh]'>
        Authorization Error !!
      </div> : 
          <div>
            <div className='flex flex-col justify-around'>
              <div>
                  <h1 className="text-3xl font-semibold text-center my-8">Manage Chatrooms</h1>
              </div>
              <div className='flex flex-row justify-between mr-4 items-center mb-4 mt-6'>
                <div className='flex flex-row items-center justify-between  ml-2'>
                  <input
                    type="text"
                    placeholder="Search Chatrooms"
                    className=" bg-transparent  h-10 px-4 py-2 w-[50vw]  border border-gray-800 rounded-md "
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className='flex flex-row items-center justify-around gap-1 border border-gray-900 rounded-md '>
                  <svg className='ml-2' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h4q.425 0 .713.288T9 17t-.288.713T8 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h10q.425 0 .713.288T15 12t-.288.713T14 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z"/></svg>

                  <select
                    className=" border-none bg-transparent h-10  text-md px-4  py-2 rounded-md hover:cursor-pointer"
                    value={sorting.type}
                    onChange={(e) => [setSorting({type: e.target.value, order: sorting.order}), console.log(e.target.value)]}
                  >
                    <option value="created_at">Created At</option>
                    <option value="name">Name</option>
                  </select>

                    <div className='flex justify-center items-center w-8 h-8  rounded-2xl hover:cursor-pointer hover:bg-slate-400 hover:duration-150 mr-2' onClick={() => setSorting({ ...sorting, order: -sorting.order })}>
                        {sorting.order === 1 ? (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M11.47 3.47a.75.75 0 0 1 1.06 0l6 6a.75.75 0 1 1-1.06 1.06l-4.72-4.72V20a.75.75 0 0 1-1.5 0V5.81l-4.72 4.72a.75.75 0 1 1-1.06-1.06z" clip-rule="evenodd"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 3.25a.75.75 0 0 1 .75.75v14.19l4.72-4.72a.75.75 0 1 1 1.06 1.06l-6 6a.75.75 0 0 1-1.06 0l-6-6a.75.75 0 1 1 1.06-1.06l4.72 4.72V4a.75.75 0 0 1 .75-.75" clip-rule="evenodd"/></svg>
                          )}
                    </div>
                </div>

                  <div>
                    <button className='border border-gray-900 rounded-md w-16 h-10 hover:bg-slate-400' onClick={()=>{setFilterModalOpen(true)}}>
                      Filters
                    </button>
                  </div>
                <div>
                  <button
                      className="bg-purple-500 hover:bg-purple-600 hover:duration-150 text-white py-2 px-4 rounded my-4"
                      onClick={() => setModalOpen(true)}>Create Chatroom
                  </button>
                </div>
              </div>

              <div>
                {(chatrooms===undefined) ?(
                  <div className='text-2xl mt-64 ml-64 h-[100vh]'>
                    No Chatrooms Found
                  </div>
                ):(

                  <table className="table-auto w-full border-collapse border-2 border-gray-500  mt-1">
                    <thead>
                      <tr>
                      <th className='border-2 border-gray-500 px-4 py-2' >Created At </th>
                        <th className="border-2 border-gray-500 px-4 py-2">Chatroom id</th>
                        <th className="border-2 border-gray-500 px-4 py-2">Chatroom Name</th>
                        <th className="border-2 border-gray-500 px-4 py-2">Actions</th>
                        <th className='border-2 border-gray-500 px-4 py-2' >Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chatrooms.map((chatroom) => (
                        <tr key={chatroom._id}>
                          <td className='border border-gray-500 px-4 py-2 text-center text-lg'>{new Date(chatroom.created_at).toLocaleDateString("en-GB")} </td>
                          <td className="border border-gray-500 px-4 py-2 text-center text-lg">{chatroom._id}</td>
                          <td className="border border-gray-500 px-4 py-2 text-center text-xl hover:text-purple-500 hover:duration-150">
                            <Link to={`/chatroom/${chatroom._id}`}>
                            {chatroom.name}
                            </Link>
                            </td>
                          <td className="border border-gray-500 px-4 py-2 text-center pr-2">
                            <button
                              className="bg-gray-500 text-white px-5 py-[4px] my-2 ml-2 rounded mr-8 "
                              onClick = {() => {setEditModalOpen(true), setChatroomId(chatroom._id), setNewName(chatroom.name)}}   >
                              
                              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></g></svg>

                            </button>
                            <button
                              className="bg-red-500 text-white px-4 py-[4px]  rounded mr-8"
                              onClick={() => handleDelete(chatroom._id)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M20 5a1 1 0 1 1 0 2h-1l-.003.071l-.933 13.071A2 2 0 0 1 16.069 22H7.93a2 2 0 0 1-1.995-1.858l-.933-13.07L5 7H4a1 1 0 0 1 0-2zm-3.003 2H7.003l.928 13h8.138zM14 2a1 1 0 1 1 0 2h-4a1 1 0 0 1 0-2z"/></g></svg>

                            </button>
                          </td>
                          <td className='border border-gray-500 px-4 py-2 text-center text-lg'>{chatroom.status ? <p> Active</p> :<p> Inactive</p> }</td>
                        </tr>
                        ))}
                    </tbody>
                  </table>


                  )} 
              </div>
          </div>
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
                className="bg-purple-500 text-white px-4 py-2 rounded"
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
              
              className="border border-gray-300 px-4 py-2 rounded mr-2 w-full"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                  className="bg-purple-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => handleEdit(chatroomid)} >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

{/* Modal for Filters */}
{filterModalOpen && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
      <h2 className="text-xl font-bold mb-4">Filter Chatrooms</h2>
      <div>
        <h1 className='text-md font-semibold'>Date</h1>
        {/* Date Filters */}
        <label className='block p-2 w-fit h-fit'>
          From:
          <input
          className='rounded mx-4 '
            type="date"
            value={filter.date.from}
            onChange={(e) => [setFilter({ ...filter, date: { ...filter.date, from: e.target.value } }), console.log(e.target.value)]}
          />
        </label>
        <label className='block ml-4 p-2 w-fit h-fit'>
          To:
          <input
          className='rounded mx-4'
            type="date"
            value={filter.date.to}
            onChange={(e) => setFilter({ ...filter, date: { ...filter.date, to: e.target.value } })}
          />
        </label>
      </div>
      <div>
        {/* Active Status Filter */}
        <h1 className='text-md font-semibold mt-4  '> Status </h1>
        <label className='block mb-6 p-2 w-fit h-fit'>

          <select className='rounded mx-4 p-1 ml-10'
            value={filter.isActive}
            onChange={(e) => setFilter({ ...filter, isActive: e.target.value })}
          >
            <option value="All">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </label>
      </div>
      <div className="flex justify-end mt-4">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          onClick={() => setFilterModalOpen(false)}
        >
          Cancel
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          onClick={handleClearFilter}
        >
          Clear Filters
        </button>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded mr-2"
          onClick={handleFilter}
        >
          Apply Filters
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

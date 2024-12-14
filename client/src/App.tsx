import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup  from './auth_pages/Signup';
import Signin from './auth_pages/Signin';
import Home from './chatroom_pages/Home';
import ManageChatrooms from './chatroom_pages/ManageChatrooms';
import Chatroom from './chatroom_pages/Chatroom';

function App() {

  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/chatroom/:chatroomid" element={<Chatroom />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/manage-chatrooms" element={<ManageChatrooms />} />
    </Routes>
    </>
  );
};

export default App

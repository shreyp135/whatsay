import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup  from './auth_pages/Signup';
import Signin from './auth_pages/Signin';
import Home from './chatroom_pages/Home';
import Explore from './chatroom_pages/Explore';
import CreateChatroom from './chatroom_pages/CreateChatroom';

function App() {

  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/createChatroom" element={<CreateChatroom />} />
    </Routes>
    </>
  );
};

export default App

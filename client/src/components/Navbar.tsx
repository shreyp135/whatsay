import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { isAdmin } from "../utils/authCheck";
import toast,{Toaster} from "react-hot-toast";

function Navbar() {
    const Navigate = useNavigate();
    const isToken = localStorage.getItem("token");

    const handleClick = async() => {
        const response = await api.get("/auth/signout");
        if(response.status === 200) toast.success("Logged out successfully");
        console.log(response.status);
        localStorage.removeItem("token");
        localStorage.removeItem("userid");
        Navigate("/signin");
        
    }
    const isAdminUser = isAdmin();

    return (
      <>
        <div className=" h-[7vh] sticky top-0 backdrop-blur-sm  text-black flex flex-row justify-between items-center border-b border-b-gray-900 px-20">
            <div className="text-2xl font-semibold text-indigo-800">
            <Link to="/">Whatsay</Link>
            
            </div> 
            <div className="flex flex-row gap-24 justify-between text-lg font-semibold">
                <div>
                    <Link className="hover:text-purple-500 hover:duration-200" to="/">Home</Link>                
                </div>

                {isAdminUser ? <div>
                    <Link className="hover:text-purple-500 hover:duration-200" to="/manage-chatrooms">Manage Chatrooms</Link>
                </div> : <></>}

                {!isToken ?  <div>
                    <Link className="hover:text-purple-500 hover:duration-200" to="/signin">Login</Link>
                </div> : <></>}
            
                {isToken ?  
                <div className="hover:cursor-pointer hover:text-purple-500 hover:duration-200" onClick={handleClick}>Logout</div>:<></>}
            </div>
        </div>
        <Toaster/>
      </>
    );
  };
  
  export default Navbar;
  
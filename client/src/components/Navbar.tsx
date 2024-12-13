import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";


function Navbar() {
    const Navigate = useNavigate();
    const isToken = localStorage.getItem("token");

    const handleClick = async() => {
        const response = await api.get("/auth/signout");
        console.log(response.status);
        localStorage.removeItem("token");
        Navigate("/signin");
    }

    return (
      <>
        <div className=" h-[7vh] sticky top-0 backdrop-blur-sm text-white flex flex-row justify-around items-center border-b">
            <div>
                {isToken ?  <Link to="/">Whatsay</Link> :  <Link to="/explore">Whatsay</Link>}
            
            </div>
            <div>
                {isToken ?  <Link to="/">Home</Link> :  <Link to="/explore">Home</Link>}
               
            </div>
            {isToken ? <div>
                <Link to="/explore">Explore</Link>
            </div> : <></>}
            
            {/* <div>
                <Link to="/createChatroom">create</Link>
            </div> */}
            {!isToken ?  <div>
                <Link to="/signin">Login</Link>
            </div> : <></>}
           
            {isToken ?  
            <div onClick={handleClick}>
                  Logout
            </div> : <></>}
        </div>
      </>
    );
  };
  
  export default Navbar;
  
// import { useState } from "react";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";

function CreateChatroom() {
    const Navigate = useNavigate();
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            username: { value: string };
            password: { value: string };
        }
        const username = target.username.value;
        const password = target.password.value;
        try {
            const response = await api.post("/auth/signin", { username, password });
            localStorage.setItem("token", response.data.token);
            Navigate("/home");
            }
            catch (err) {
                console.error("Login was not successful", err);
            }
        }
    

    return (
      <>
        <div className="h-[95vh] text-white flex justify-center ">
            <div className=" flex flex-col justify-evenly ">
                <div className=" text-4xl font-medium">
                    Create a chatroom !!
                </div>
                <div className="h-[60vh] backdrop-blur-sm border rounded-xl border-gray-500 bg-gradient-to-r  from-sky-950 via-blue-950 to-sky-950">
                        <form action="" onSubmit={handleSubmit}>
                            <input type="text" name="username" placeholder="Username or Email" id="" />
                            <input type="password" name="password" placeholder="Password" id="" />

                            <button type="submit">
                                Login
                            </button>
                        </form>

                        <Link to="/signup"> signup</Link>
                </div>
            </div>
           
        </div>
      </>
    );
  };
  
  export default CreateChatroom;
  
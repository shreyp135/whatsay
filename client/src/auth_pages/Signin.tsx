// import { useState } from "react";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import toast,{Toaster} from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";
import { useState } from "react";

function Signin() {
    const Navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        toast("Logging in, please wait...")
        setLoading(true);
        e.preventDefault();
        const target = e.target as typeof e.target & {
            username: { value: string };
            password: { value: string };
        }
        const username = target.username.value;
        const password = target.password.value;
        try {
            const response = await api.post("/auth/signin", { username, password });
            toast.success("Login successful",{
                duration: 5000,
                position: "top-center",
            });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userid", response.data.user._id);
            Navigate("/");
            }
            catch (err: any) {
                if (err.response?.status === 404) {
                    toast.error("Invalid credentials");
                }
                if(err.response?.status === 500) {
                    toast.error("Error logging in");
                }
                console.error("Login was not successful", err);
            }
            setLoading(false);
        }
    

    return (
      <>
        <div className="h-[95vh]  flex justify-center ">
            <div className=" flex flex-col justify-center gap-16  w-[25%] ">
                <div className=" text-3xl font-medium text-center">
                    Welcome to Whatsay !!
                </div>
                <Toaster/>
                <div className=" h-[60vh] backdrop-blur-sm border rounded-xl border-gray-500 bg-white flex flex-col justify-around p-6">
                        <div className="flex flex-col gap-2">                        
                            <div className="text-2xl font-semibold">
                                Login to Whatsay
                            </div>
                            <div className="font-normal text-md text-gray-600">
                                Chat with people in secured chatrooms with zero latency.
                            </div>
                        </div>
                        <form action="" className="flex flex-col justify-between gap-3" onSubmit={handleSubmit}>
                            <label className="font-medium" htmlFor="username">Email Address</label>
                            <input className="rounded-md hover:shadow-md hover:duration-150" type="text" name="username" placeholder="Username or Email" id="" />
                            <label className="font-medium" htmlFor="password">Password</label>
                            <input className="rounded-md hover:shadow-md hover:duration-150" type="password" name="password" placeholder="Enter your password" id="" />

                            <button type="submit" className="bg-purple-400 hover:bg-purple-500 hover:duration-150 hover:shadow-md h-10 rounded-md text-center text-white text-md font-medium mt-4 flex justify-center items-center">
                               {loading ? <TailSpin height={25} width={80} radius={1} color="#ffffff" /> : "Login"}  
                            </button>
                        </form>
                        <div>Don't have an account?
                            <Link className="text-purple-500" to="/signup"> Signup</Link>
                        </div>
                </div>
            </div>
           
        </div>
      </>
    );
  };
  
  export default Signin;
  
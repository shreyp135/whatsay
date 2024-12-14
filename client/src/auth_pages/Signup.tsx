import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
    const Navigate = useNavigate();
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            username: { value: string };
            email: { value: string };
            password: { value: string };
        }
        const username = target.username.value;
        const email = target.email.value;
        const password = target.password.value;
        try {
            const response = await api.post("/auth/signup", { username, email, password });
            console.log(response.status);
            }
            catch (err) {
                console.error("Signup was not successful", err);
            }

        //signing in the user
        try {
            const response = await api.post("/auth/signin", { username, password });
            localStorage.setItem("token", response.data.token);
            Navigate("/");
            }
            catch (err) {
                console.error("Login was not successful", err);
            }
        }    

    return (
      <>
        <div className="h-[95vh] flex justify-center ">
            <div className=" flex flex-col justify-center gap-12  w-[25%]">
                <div className=" text-3xl text-center font-medium">
                    Welcome to Whatsay !!
                </div>
                <div className=" h-[68vh] backdrop-blur-sm border rounded-xl border-gray-500 bg-white flex flex-col justify-around p-6">
                        <div className="flex flex-col gap-2">                        
                            <div className="text-2xl font-semibold">
                                Signup on Whatsay
                            </div>
                            <div className="font-normal text-md text-gray-600">
                                Chat with people in secured chatrooms with zero latency.
                            </div>
                        </div>                        
                        <form action="" className="flex flex-col justify-between gap-2" onSubmit={handleSubmit}>
                            <label className="font-medium" htmlFor="username">Username</label>
                            <input className="rounded-md hover:shadow-md hover:duration-150" type="text" name="username" placeholder="abc" id="" />
                            <label className="font-medium" htmlFor="email">Email Id</label>
                            <input className="rounded-md hover:shadow-md hover:duration-150" type="email" name="email" placeholder="abc@abc.com" id="" />
                            <label className="font-medium"  htmlFor="password">Password</label>
                            <input className="rounded-md hover:shadow-md hover:duration-150" type="password" name="password" placeholder="Enter your password" id="" />

                            <button type="submit" className="bg-purple-400 hover:bg-purple-500 hover:duration-150 hover:shadow-md h-10 rounded-md text-white text-md font-medium mt-4">
                                Signup
                            </button>
                        </form>
                        <div>Already have an account?
                            <Link className="text-purple-500" to="/signin"> Login</Link>
                        </div>
                </div>
            </div>
           
        </div>
      </>
    );
  };
  
  export default Signup;
  
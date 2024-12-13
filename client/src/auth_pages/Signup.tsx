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
        <div className="h-[95vh] text-white flex justify-center ">
            <div className=" flex flex-col justify-evenly ">
                <div className=" text-4xl font-medium">
                    Welcome to Whatsay !!
                </div>
                <div className="h-[60vh] backdrop-blur-sm border rounded-xl border-gray-500 bg-gradient-to-r  from-sky-950 via-blue-950 to-sky-950 text-black">
                        <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <input type="text" name="username" placeholder="Username " id="" />
                            <input type="email" name="email" placeholder="Email" id="" />
                            <input type="password" name="password" placeholder="Password" id="" />

                            <button type="submit">
                                Signup
                            </button>
                        </form>

                        <Link to="/signin"> signin</Link>
                </div>
            </div>
           
        </div>
      </>
    );
  };
  
  export default Signup;
  
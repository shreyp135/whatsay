import {jwtDecode} from 'jwt-decode';


export const isAdmin = () => {
    try{
        const token = localStorage.getItem("token");
        if(token){
            const decodedToken: any = jwtDecode(token);
            if(decodedToken.role === "admin"){
                return true;
            }
        }
        return false;
    }catch(err){
        console.error("Error in Authorization from jwt", err);
        return false;
    }
}

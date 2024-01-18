import { Link } from "react-router-dom";
import owner from "../images/owner.avif"
import rental from "../images/canva.png"
function Login({logged,setLogged,user,setUser}){
     
        return(
        <div className="bg-[rgb(226,229,229)] p-36">
            <div className="flex flex-row bg-white mx-auto w-[850px] rounded-2xl p-5, shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]">
           
                     
           <div className=" p-10">
           <img className="w-96 h-64" src={owner} ></img>
               
           <Link to="/login/owner">
                <button className="bg-[rgb(31,32,97)]  p-2 rounded-xl text-white hover:shadow-[8.0px_8.0px_8.0px_rgba(0,0,0,0.40)]">Login as Owner</button>
            </Link>
           </div>


            <div className=" p-10">
                   <img className="w-96 h-64"  src={rental} height={100} width={500}></img>
               
            <Link to="/login/tenant">
                <button className="bg-[rgb(31,32,97)]  p-2 rounded-xl text-white hover:shadow-[8.0px_8.0px_8.0px_rgba(0,0,0,0.40)]">Login as Rental</button>
            </Link>
            </div>    

                
                
                
       </div>
        </div>
    )
}
export default Login;
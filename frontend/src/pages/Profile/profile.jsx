
import { useEffect, useState } from "react"
import { useContext } from "react"
import {UserContext} from "../../components/userContext.jsx"
import FirstPart from "../../components/profile/firstPart"
import SecondPart from "../../components/profile/secondPart"

const baseURL = import.meta.env.VITE_BASE_URL;

//className="dark:bg-purple-100 bg-mainBackground dark:text-black text-white z-[-10]"
function Profile() {
    var { user } = useContext(UserContext)
    var [userData , setUserData] = useState(null)
    
    useEffect(() => {
        if(user == null) return
           var id = user.user._id
       
        fetch(`${baseURL}/api/v1/dashboard/stats/${id}`, {
            method: "GET",
            credentials:"include",
            headers: {
                "Accept": "application/json"
            }
        })
        .then(res => res.json())
            .then(data => {
          
            setUserData(data.data)
        })
        .catch(err => {
            console.log(err)
        })
       

      },[user])
            
    return <div className="dark:bg-purple-100 bg-mainBackground dark:text-black text-white z-[-10]" >
        <div>
            {userData ? <FirstPart userData={userData}></FirstPart> : <p className="text-2xl max-sm:text-xl text-white dark:text-black">Loading</p>}
            <SecondPart ></SecondPart>
        </div>
       
       
        
    </div>
}

export default Profile
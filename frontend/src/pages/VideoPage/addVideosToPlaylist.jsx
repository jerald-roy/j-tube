import { useEffect } from "react"
import { UserContext } from "../../components/userContext"
import { useContext } from "react"
import { useState } from "react";
import { useLocation , useNavigate} from "react-router-dom";
import Button from "../../components/common/button/button"
const baseURL = import.meta.env.VITE_BASE_URL;


function AddVideos() {
     var location = useLocation()
    var { videoId } = location.state
    var navigate = useNavigate()
    var { user } = useContext(UserContext)
    var [playlistData, setPlaylistData] = useState(null)
       function handleBackButton() {
        
               navigate("/videoPage", { state: { videoId } });
    }
    useEffect(() => {
        var userId = user.user._id
        fetch(`${baseURL}/api/v1/playlist/getVideos/toAddVideo/${userId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept":"application/json"
            }
        })   
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                setPlaylistData(data.data)

            })
            .catch(err => {
            console.log(err)
        })
    },[user])
    return <div className="bg-mainBackground dark:bg-purple-100 dark:text-black 
    min-h-[100vh] pb-4">
        {playlistData && <div className="grid justify-center place-items-center">
         {playlistData.map((item , index )=> {
              return <SinglePlaylist item = {item} key={index} ></SinglePlaylist>  
         })}
        </div>}
           <div className="flex justify-center pt-4">
            <Button text="back" onClick={handleBackButton}></Button>
        </div>
    </div>
}

function SinglePlaylist({ item }) {
    var location = useLocation()
    var { videoId } = location.state
    var navigate = useNavigate()
   
    function handlePlaylist(playlistId) {
       
        fetch(`${baseURL}/api/v1/playlist/add/${videoId}/${playlistId}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Accpet":"application/json"
            }
        })
            .then(async res => {
                
                let data
                try {
                    data = await res.json(); // always try to parse JSON first  
                } catch {
                    data ={}
                }
             
            
              if (!res.ok) {
                   
                  if (res.status === 409) alert("this video has been already added to this playlist");
                  if(res.status === 507) alert("create another playlist for this video because limit(25) exceeded!")
                throw new Error(data.message); // stop further then
               }
                return data; // normal success
               })
           .then(() => {
              
               navigate("/videoPage", { state: { videoId } });
           })
           .catch(err => console.log("Error caught:", err.message));
    }
 
    return <div className="pt-10 text-2xl" >
        <div className="border-2 text-white dark:text-black border-white dark:border-black mb-2 w-[70vw] p-2 cursor-pointer hover:bg-gradient-to-r from-purple-400 to-grey-400 max-sm:text-xl" onClick={( )=>handlePlaylist(item._id)}>
        <div className="font-bold">{item.name}</div>
        <div>{item.description}</div>
        </div>
     
    </div>
}
export default AddVideos
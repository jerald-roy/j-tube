
// import photo from "../../assets/photo-1.png"
// import profile from "../../assets/thumbnail.png"
import { useState , useContext , useEffect} from "react"
import { CirclePlay } from "lucide-react"
const baseURL = import.meta.env.VITE_BASE_URL;
import { UserContext } from "../userContext";
import { useNavigate } from "react-router-dom";

// import profile from "../../assets/thumbnail.png"


//so we will do the request here in this file

function HeroSection() {
  var { user } = useContext(UserContext)
  var [homeData, setHomeData] = useState([])
  useEffect(() => {
     fetch(`${baseURL}/api/v1/videos/homePage/videos`, {
       method: "GET",
       credentials:"include",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
      // "Authorization": `Bearer ${user.accessToken}`,
      "Accept":"application/json"
    }
  })
    .then((res) => res.json())
       .then((data) => {
      // console.log(data.data)
      setHomeData(data.data)
    })
    .catch((err) => {
      console.log(err)
    })
   
  },[user.accessToken])
 
  var [active, setActive] = useState(-1)
  return  homeData.length != 0 ?
      <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1  gap-x-10 max-lg:gap-x-2 gap-y-0 overflow-x-hidden max-md:gap-y-10 justify-center max-sm:pl-1 max-sm:pr-1"> {
      homeData.map((item , pos) => {
       return <SingleSection
         key={item._id}
         id={item._id}
          thumbnail={item.thumbnail.url}
          profilePhoto={item.profilePhoto}
          title={item.title}
         channelName={item.channelName}
         isActive={active == pos}
         onMouseEnter={() => setActive(pos)}
         onMouseLeave={()=> setActive(null)}
        ></SingleSection>
      })  
  }  </div> 
      
      
      
    : <div className="bg-mainBackground2 flex justify-center h-screen text-white">
      <div>
        Loading...
      </div>
      
    </div>
  
  




  } 


export function SingleSection({ id, thumbnail, profilePhoto, title, channelName, isActive, onMouseEnter, onMouseLeave }) {
  var navigate = useNavigate()
  //logic for trunacating the title
  function truncateLogic(text, maxChar) {
    if (text.length <= maxChar) return text
    return text.slice(0 , maxChar) + "..."
  }
  function handleClick(videoId) {
    navigate("/videoPage" , {state:{videoId}})
    
  }
  return <div className=" max-w-full md:m-5 text-white dark:text-black cursor-pointer" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={()=>{handleClick(id)}}>
    <div className="pb-2 relative w-full" >
      <img src={thumbnail} className="w-full ml-auto mr-auto max-md:w-[600px] h-[250px] max-xl:h-[230px]object-cover"></img>
      {
         (
          <span className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${isActive ? "opacity-90" : "opacity-0"}`}>
            <CirclePlay color="#b060d9" size={48}></CirclePlay>
           </span>
        )
      }
    </div>
    <div className="grid grid-cols-4">
      <div className="col-span-1 flex items-center justify-center">
        <img src={profilePhoto} className="w-12 h-12  rounded-full object-center"></img>
      </div>
      <div className="col-span-3 font-sans">
        <h4 className="text-2xl font-medium">{truncateLogic(title , 30)}</h4>
         <h6 className="text-xl">{channelName}</h6>
      </div>
    </div>
  </div>
}

export default HeroSection

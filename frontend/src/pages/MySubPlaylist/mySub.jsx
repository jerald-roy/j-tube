import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../components/userContext"
const baseURL = import.meta.env.VITE_BASE_URL;
// import profile from "../../assets/photo-1.png"
import "./index.css"
import Pagination from "../../components/pagination/pagination";
import OthersPlaylist from "./othersPlaylist";
// var arr = [
   
  
//     {
//         data : profile
//     },
//     {
//         data : profile
//     },
//     {
//         data : profile
//     },
//     {
//         data : profile
//     },
//     {
//         data : profile
//     },
//     {
//         data : profile
//     },
//     {
//         data : profile
//     },
//     {
//         data : profile
//     },
// ]
function MySub() {
    //this below state will be used for pagination
    var [page , setPage] = useState(1)
    //now i need some way to get the user id so that i can get channels of which the user has subscribed
    var { user } = useContext(UserContext)
    //this below state is used for storing the data about the subscribed channels
    var [subscribedData, setSubscribedData] = useState("")
    //this below state is used to get whether the user has 0 subscriptions
    var [load , setLoad] = useState(true)
    //now i need to get the user subscribed channels 
    var [totaldocs , setTotaldocs] = useState(0)
    useEffect(() => {
       getData(user , setLoad , setSubscribedData , page , setTotaldocs)
    },[user , page])
    return <div className="min-h-[100vh]">
      <div className="text-black  bg-mainBackground dark:bg-purple-100 dark:text-black">
        {
            subscribedData ?
                <div>
                    {
                        load ? <div className="pt-2 pl-2 ">
                        <div className="font-bold text-white max-sm:text-xl dark:text-black">Subscribed Channels</div>
                        <DisplaySubscribers subscribedData={subscribedData} page={page} setPage={setPage} totaldocs={totaldocs}></DisplaySubscribers>
                        
                        </div> : <div className="max-sm-text-xl">No subscribed channels</div>
                    }
     </div>
            : <div>Loading...</div>                     
            }
    
        </div>
        <OthersPlaylist></OthersPlaylist>
    </div> 
}

function DisplaySubscribers({subscribedData , page , setPage , totaldocs}) {
    return <div className="pt-5 pl-4 flex flex-wrap gap-y-6 gap-x-10 pb-4 ">
        {
            subscribedData.map(item => {
                return <Subscribers item={item}  key={item._id}></Subscribers>
            })
        }
        <div className="flex text-white gap-y-2 items-center">
        <Pagination page={page} setPage={setPage} totalPage={totaldocs}></Pagination>
        </div>
    
    </div>
}

function Subscribers({item}) {
    return <>
        <div className="w-[100px] h-[100px] max-sm:w-[80px] max-sm:h-[80px]">
            <img src={item.channelInfo.avatar} className="w-full h-full rounded-full object-cover"></img>
    </div>
    </>
}

function getData(user , setLoad , setSubscribedData , page=1 , setTotaldocs) {
     var channelId = user.user._id
       
        fetch(`${baseURL}/api/v1/subscriptions/u/${channelId}?page=${page}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept":"application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                if(data.data.channelCount == 0) setLoad(false)
                setSubscribedData(data.data.channelInfo)
                setTotaldocs(data.data.channelCount)
            })
        .catch(err => console.log(err))
}
export default MySub
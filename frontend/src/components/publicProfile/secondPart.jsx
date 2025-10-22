import { useEffect, useState } from "react"
// import profile1 from "../../assets/profile1.png"
import Pagination from "../pagination/pagination"
const baseURL = import.meta.env.VITE_BASE_URL;
import { useNavigate } from "react-router-dom";
// var videos = [
//     {
//         id:"123",
//         thumbnail: profile1 , 
//         title: "this is just the sample", 
//         creationDate:"12/23/2002"
//     },
//     {
//         id:"321",
//         thumbnail: profile1 , 
//         title: "this is just the sample", 
//         creationDate:"12/23/2002"
//     },
//     {
//         id:"3212",
//         thumbnail: profile1 , 
//         title: "this is just the sample", 
//         creationDate:"12/23/2002"
//     },
// ]

function SecondPart({ id }) {
    //this below state is used for storing the videos of the user coming from the backend
    var [selected , setSelected ] = useState("video") 
    var [videos , setVideos] = useState(null)
    var [page, setPage] = useState(1)
    var [page2 , setPage2] = useState(1)
    var [totalPage , setTotalPage] = useState(0)
    var [loading , setLoading] = useState(true)
    var [playlist, setPlaylist] = useState(null)
    var [totalPlaylist , setTotalPlaylist] = useState(0)
    
    useEffect(() => {
        
        if (selected == "video" ) getVideos(id, page, setLoading, setTotalPage, setVideos)
        
        if (selected == "playlist" ) getPlaylist(id, setPlaylist , page2 , setTotalPlaylist)
        
        
    },[selected , id , page , page2])
    return <div className="bg-mainBackground2  text-white p-15 dark:bg-purple-200 dark:text-black">
        <div className="flex gap-x-4 p-4 max-sm:text-xl justify-center">
           <div onClick={()=>{setSelected("video")}}>  
            <button className={`bg-purple-600 hover:bg-purple-800 rounded-md p-2 cursor-pointer ${selected == "video" ? "border-white border-2 " :""}`} >Videos</button>
        </div>
        <div onClick={()=>{setSelected("playlist")}}>  
            <button className={`bg-purple-600 hover:bg-purple-800 rounded-md p-2 cursor-pointer ${selected == "playlist" ? "border-white border-2 " :""}`}>Playlists</button>
        </div>
     

        </div>
        {/* second part */}

        {
            !loading ? <div className="">
                <div className="grid  grid-cols-2 max-lg:grid-cols-1 place-items-center pt-10 gap-y-6 max-lg:gap-y-3">
                    {
                        
                        selected == "video" ? <>
                        <DisplayVideo videos={videos}></DisplayVideo>
                             <div className="flex justify-center">
                <Pagination page={page} setPage={setPage} totalPage={totalPage} ></Pagination>
                </div>
                        </>
                            : // if not videos it should be playlists
                            < >
                                <DisplayPlaylist playlist={playlist}></DisplayPlaylist> 
                               
                                
                                <Pagination page={page2} setPage={setPage2} totalPage={totalPlaylist}></Pagination>
                            </>
                       
            }
                </div>
                
            </div> : <div className="">Loading...</div>
        }
    
    
    </div>
}
function DisplayVideo({ videos }) {

    return (
        <>
            {
              videos.length != 0 ?
            videos.map((video) => {
                return <span key={video._id}>  <SinglePart video={video}  id={video._id}></SinglePart>   </span>
                
            }) :
            <div className="text-white dark:text-black max-sm:text-xl text-2xl ">No data is added!</div>  
            }
           
            
        </>
        
        )
}

function DisplayPlaylist({ playlist }) {
    
    return (playlist ?
        playlist.map(item => {
         return <PlaylistPart item={item} key={item._id} ></PlaylistPart>
        }) :
        
     < div className = "text-white dark:text-black max-sm:text-xl text-2xl " >
                                No data is added  </div>)
}
function SinglePart({ video, id }) {
    var navigate = useNavigate()
   var date =  new Date(video.createdAt)
    function handleVideo(videoId) {
        navigate("/videoPage",{state:{videoId:videoId}})
    }
    return <div className="w-[400px] h-[300px] max-lg:w-[350px] max-sm:w-[300px] flex-col text-2xl bg-mainBackground3 text-white cursor-pointer max-sm:text-xl mb-"
    onClick={()=>handleVideo(id)}>
        <div className="w-full h-[200px] bg-purple-500">
            <img src={video.thumbnail.url} className="w-full h-full object-cover"></img>
        </div>
        <div>
            <p className="font-bold"> {video.title}</p>
        <p className="text-xl max-sm:text-xl">{date.toLocaleDateString()}</p>
        </div>
        
    </div>
}

function getVideos(id, page, setLoading, setTotalPage, setVideos) {
      var ownerId = id
    // console.log(ownerId)
    // console.log(page)
          fetch(`${baseURL}/api/v1/videos/checkUserVideos/${ownerId}?page=${page}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept":"application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
              
                if (data.data.videos.length == 0) {
                    setLoading(false)
                    setVideos([])
                } else {
                    setLoading(false)
                //     console.log(data.data.videos)
                // console.log(data.data)

                    setVideos(data.data.videos)
                    setTotalPage(data.data.totalPage)
               
                }
                
            })
}
function getPlaylist(id, setPlaylist, page2 = 1 , setTotalPlaylist) { //here id means id of the choosen profile (not the user)
    var page = page2
    fetch(`${baseURL}/api/v1/playlist/getPlaylist/person/public/${id}?page=${page}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Accept":"application/json"
        }

    })
        .then(res => res.json())
        .then(data => {
            // console.log(data.data)
            setPlaylist(data.data.findPlaylist)
            setTotalPlaylist(data.data.totalPages)
        })
        .catch(err => {
        console.log(err)
    })
}
function PlaylistPart({item}) {
    var navigate = useNavigate()

    function handlePlaylist(playlistId){
         navigate("/checkPlaylist",{state:{playlistId:playlistId , pathname:"/publicProfile"}})
    }
    return <div className="text-white border-white border-2 text-2xl p-5 w-[80%] cursor-pointer hover:border-purple-600 mb-5 max-sm:text-xl dark:border-black dark:hover:bg-purple-600 dark:text-black" onClick={()=>handlePlaylist(item._id)}>
        <div>
            {item.name}
        </div>
        <div>
            {item.description}
        </div>
    </div>
}
export default SecondPart
import { useEffect } from "react"
import { useState } from "react"
import { useLocation , useNavigate } from "react-router-dom"
import Button from "../../components/common/button/button";
const baseURL = import.meta.env.VITE_BASE_URL;
//this playlist is for viewing indivisual playlist like when you click on it you can see the details and the videos of the playlist
function CheckPlaylist() {
    var location = useLocation()
    var { playlistId } = location.state
    var {pathname} = location.state
    var [playlistData, setPlaylistData] = useState(null)
    var [deletePopup , setDeletePopup] = useState(false)
    useEffect(() => {
        getVideos(playlistId , setPlaylistData)
    }, [playlistId])
    var navigate = useNavigate()
    function handleUpdate() {
       navigate("/updatePlaylist" , {state:{playlistId : playlistId}})
   }
    function handleBack() {
        if (pathname == "/mySub") {
            navigate("/mySub")
        } else if (pathname == "/privatePlaylist") {
            navigate("/privatePlaylist")
        }else if( pathname == "/publicProfile"){
            navigate("/publicProfile")
        } 
    }
    function handleDelete() {
        setDeletePopup(!deletePopup)
    }
    function handleCancel2() {
        setDeletePopup(!deletePopup)
    }
    function mainHandleDelete() {
        fetch(`${baseURL}/api/v1/playlist/${playlistId}`, {
            method: "DELETE",
            credentials:"include"
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                navigate("/privatePlaylist")
            })
            .catch(err => {
            console.log(err)
        })
    }
    return <div className="min-h-[100vh] bg-mainBackground">
        {playlistData ?
            <div className="text-white bg-mainBackground min-h-[100vh] dark:bg-purple-100 dark:text-black"> 
                <div className="pl-4 pt-4 font-mono text-3xl max-lg:text-2xl max-sm:text-xl pr-1">
                    <div className="h-[200px] w-[200px] pb-2 max-lg:h-[150px] max-lg:w-[150px] max-sm:h-[100px] max-sm:w-[100px] cursor-pointer">
                        <img src={playlistData[0].owner.avatar} className="h-full w-full object-cover rounded-full" />
                    </div>
                    <div className="pb-2">
                       <p>username : {playlistData[0].owner.username} </p> 
                     </div>
                     <div className="pb-2 ">
                      <p>playlist name : {playlistData[0].name}  </p>   
                    </div>
                    
                    <div className="pb-2  w-[80%] max-sm:[95%]">
                        <p className="whitespace-normal w-full">playlist description : {playlistData[0].description }</p>
                      
                    </div>
                    <div className="flex gap-x-4 pt-2">
                        {deletePopup ? <div className="w-[80%] h-[150px] border-2 dark:border-black flex justify-center">
                            <div>
                                <p>are you sure</p>
                                <div className="flex gap-x-4 pt-4">
                                    <Button text="delete" onClick={mainHandleDelete}></Button>
                                    <Button text="cancel" onClick={handleCancel2}></Button>
                                </div>
                            </div>
                            
                        </div> :<>
                        <Button text="Update" onClick={handleUpdate}></Button>
                        <Button text="Delete " onClick={handleDelete}></Button>
                        <Button text="back" onClick={handleBack}></Button>
                        </>}
                    </div>
                </div>
                {/* this is the videos of the playlist part */}
                <div className="w-[100vw] bg-black text-white font-bold mt-4 pl-2  max-lg:text-xl">Videos of the playlist</div>
                {
                    playlistData[0].videos.length != 0 ? <div className="bg-mainBackground pb-10">
                        {
                            playlistData[0].videos.map((item) => {
                              return  <SingleVideo item={item} key={item._id} playlistId={playlistId} setPlaylistData={setPlaylistData}></SingleVideo>
                            })
                        }
                    </div> :<div className="max-lg:text-xl pl-2 pr-1">there are no videos added to the playlist</div>
                }
        </div> : <div>Loading..</div>}
    </div>
}

function SingleVideo({ item  , playlistId , setPlaylistData}) {
    function handleDeleteVideo(videoId) {
        fetch(`${baseURL}/api/v1/playlist/remove/${videoId}/${playlistId}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Accept":"application/json"
            }
        })
            .then(res => res.json())
            .then(() => {
                 getVideos(playlistId ,setPlaylistData )
            })
        .catch(err => {console.log(err)})
    }
    return <div className="cursor-pointer pl-10 pt-4 mt-2 border-2 p-2 hover:bg-purple-400 grid grid-cols-2 max-sm:grid-cols-1 max-sm:text-xl">
        <div>
            <div className="w-[200px] h-[200px] max-sm:w-[150px] max-sm:h-[150px]">
            <img src={item.thumbnail.url} className="w-full h-full object-cover"></img>
        </div>
        <div>
            <p className="text-2xl max-sm:text-xl"> {item.title}</p>
        </div>
        </div>
        <div className="grid place-items-center max-sm:justify-start max-sm:pt-2 max-sm:pb-2">
            <Button text="delete" onClick={() => handleDeleteVideo(item._id)}></Button>
        </div>
    </div>
}

function getVideos(playlistId ,setPlaylistData ) {
    fetch(`${baseURL}/api/v1/playlist/user/getParticularPlaylist/${playlistId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Accept':"application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data.data)
                setPlaylistData(data.data)
            })
        .catch(err => console.log(err))
}
export default CheckPlaylist
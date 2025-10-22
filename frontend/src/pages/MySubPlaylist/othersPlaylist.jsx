import { useEffect, useState } from "react"
const baseURL = import.meta.env.VITE_BASE_URL;
import Pagination from "../../components/pagination/pagination";
import { useNavigate } from "react-router-dom";

function OthersPlaylist() {
    var [getPlaylistData, setGetPlaylistData] = useState([])
    var [totalPublic, setTotalPublic] = useState(0) 
    var [page , setPage] =  useState(1)
    useEffect(() => {
        fetch(`${baseURL}/api/v1/playlist/g/getPlaylist/public?page=${page}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept":"application/json"
            }
        }) 
            .then(res => res.json())
            .then(data => {
                // console.log(data.data.findPlaylist)

                setGetPlaylistData(data.data.findPlaylist)
                setTotalPublic(data.data.numberOfPlaylist)
            })
            .catch(err => console.log(err))
    },[page])
    return <div className="text-white min-h-[100vh] bg-mainBackground pt-10 pl-2 dark:bg-purple-100 dark:text-black">
        <div className="font-bold max-sm:text-xl"> others playlist</div>
        <div>
            {
                getPlaylistData ? <div className="pl-2 pr-2 pt-5">
                    {getPlaylistData.map((item) => {
                       return <SinglePlaylist item={item} key={item._id}></SinglePlaylist>
                    })}
                    <div className="pt-4">
                       <Pagination page={page} setPage={setPage} totalPage={totalPublic}></Pagination>
                    </div>
                </div> :<>Loading...</>
            }
        </div>
    </div>
}

function SinglePlaylist({ item }) {
    var navigate = useNavigate()

    function handlePlaylist(playlistId) {
        navigate("/checkPlaylist" , {state:{playlistId:playlistId , pathname:"/mySub"}})
    }
    return <div className="text-2xl border-2 p-2 hover:border-purple-400  max-sm:text-xl cursor-pointer mb-2 dark:border-black  dark:hover:border-purple-800 " onClick={()=>handlePlaylist(item._id)}>
        <p><span className="text-purple-500 ">name</span> : {item.name }</p>
        <p><span className="text-purple-500 ">description</span> : {item.description}</p>
        
    </div>
}

export default OthersPlaylist
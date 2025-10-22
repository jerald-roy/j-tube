import { useState } from "react";
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
const baseURL = import.meta.env.VITE_BASE_URL;
//this page is about private or the public part of the main playlist section
//****************************************************************** */

function GeneralPart({ section }) {
    var [playlistData, getPlaylistData] = useState(null)
    
    useEffect(() => {
        fetch(`${baseURL}/api/v1/playlist/getPlaylist/${section}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept":"application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                getPlaylistData(data.data)
            })
            .catch(err => console.log(err))
    },[section])
    return <div>{
        playlistData ? <>
        {playlistData.map((value , index)=> {
             return <SignglePlaylist value={value} key={index}></SignglePlaylist>   
        })}
        </> : <>Loading...</>   
    }</div>
}

function SignglePlaylist({ value }) {
    var navigate = useNavigate()
    function handleClick(playlistId) {
        //new page should open and pass the playlistId to this new page
        navigate("/checkPlaylist" , {state : {playlistId:playlistId , pathname:"/privatePlaylist"}})
    }
    return <div className="text-white w-[50%] max-sm:w-[95%] max-sm:ml-2 pt-4 text-2xl cursor-pointer max-sm:text-xl ">
        <div className="border-4 rounded-md dark:border-black sm:ml-2" onClick={() => handleClick(value._id)}>
            <p className="pt-2 pl-2 font-bold text-purple-400 dark:text-purple-700">{value.name}</p>
            <p className="pt-2 pl-2 pb-2 dark:text-black">{value.description}</p>
      </div>
    </div>
}
export default GeneralPart
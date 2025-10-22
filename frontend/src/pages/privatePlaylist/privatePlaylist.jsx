import { useState } from "react"
import Button from "../../components/common/button/button"
import "./index.css"
import GeneralPart from "./GeneralPart";
// import { useEffect } from "react";
import FormPlaylist from "./form";
//this is ENTRTY PART OF THE PLAYLIST
//************************************************************ */
const baseURL = import.meta.env.VITE_BASE_URL;
// import { useNavigate } from "react-router-dom";

function PrivatePlaylist() {
  
    //this below state is to show whether the pop up for creating the playlist appears or not 
    var [createPlaylist, setCreatePlaylist] = useState(false)
    //this below state is used for getting the playlist details from the user
    var [playlistDetails, setPlaylistDetails] = useState({
        name: "",
        description: "",
       
    })
    //this below state is used for choosing the playlist as private or public outside the form
    var [selectPlaylist , getSelectPlaylist] = useState("public")
    //this below state is used for choosing the playlist as private or public inside the form
    var [choose, setchoose] = useState("public")
    
    function handlePlaylist() {
        setCreatePlaylist(!createPlaylist)
    }

    function handleChange(e) {
        var { name  , value} = e.target
        setPlaylistDetails((pre) => ({
            ...pre,
            [name]: value
           
        }))
     
    }
    function handleSubmit(e) {
        e.preventDefault()
        var temp = true
        try {
            var { name, description } = playlistDetails
            if (name.length == 0 || description.length == 0) {
                alert("all the feilds must be filled")
                throw Error("all feilds must be filled!")
            }
        } catch (err) {
            temp = false
            console.log(err)
        }
        if (temp) {
            var dataToSend = {...playlistDetails , scope:choose}
            console.log(dataToSend)
               //now we will try to hit the route
        fetch(`${baseURL}/api/v1/playlist/`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify(dataToSend)
        })
            .then((res) => res.json())
            .then(() => {
             
                setCreatePlaylist(false)
            })
            .catch(err => console.log(err))
       }
    }
    
    
    return <div className="bg-mainBackground2 dark:bg-purple-100">
        {!createPlaylist ? <div className="min-h-screen">
         <div className="grid grid-cols-2 gap-4 items-center pt-4 pb-4 max-sm:grid-cols-1 ">
            <div>
 <p className="bg-black text-white  font-bold max-lg:text-xl ">click for creating playlist</p>
            </div>
                <div className="max-sm:flex max-sm:justify-center">
                    <Button text={"click me"} onClick={handlePlaylist}></Button>
               </div>
                
                
        </div>
        <div>
             <div className="flex gap-x-4 p-4 max-sm:text-xl max-sm:justify-center max-lg:text-xl">
           <div >  
            <button className={`${selectPlaylist == "public" ? "border-2" : ""} rounded-md p-2  cursor-pointer bg-purple-500`} value="public" onClick={(e) => getSelectPlaylist(e.target.value)} >Public</button>
        </div>
        <div >  
            <button className={` ${selectPlaylist == "private" ? "border-2" : ""}  rounded-md p-2 cursor-pointer bg-purple-500`} value="private" onClick={(e) => getSelectPlaylist(e.target.value)}>Private</button>
        </div>

        </div>
            </div>
            <GeneralPart section={selectPlaylist == "public" ? "public" : "private"} ></GeneralPart>
        </div> : <div className={`h-[100vh]  bg-gradient-to-r from-purple-400 to-gray-400 text-white flex justify-center `}
            >
                <FormPlaylist handleSubmit={handleSubmit}
                    handleChange={handleChange}
                    choose={choose}
                    setchoose={setchoose}
                    setCreatePlaylist={setCreatePlaylist}
                createPlaylist={createPlaylist}></FormPlaylist>
              
        </div>}  
    </div>
}

export default PrivatePlaylist
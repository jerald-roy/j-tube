import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Button from "../../components/common/button/button"
const baseURL = import.meta.env.VITE_BASE_URL;
function UpdatePlaylist() {
    var navigate = useNavigate()
    var location = useLocation()
    var {playlistId} = location.state
     //this below state is used for getting the playlist details from the user
     var [playlistDetails, setPlaylistDetails] = useState({
            name: "",
            description: "",
           
     })
    var [choose , setchoose] = useState("public")
    
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
        fetch(`${baseURL}/api/v1/playlist/${playlistId}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify(dataToSend)
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
             navigate('/checkPlaylist' , {state :{ playlistId : playlistId}})
                
            })
            .catch(err => console.log(err))
       }
    }
    
 
    function handleChange(e) {
          var { name  , value} = e.target
        setPlaylistDetails((pre) => ({
            ...pre,
            [name]: value
           
        }))
     
    }
    function handleClose() {
        navigate('/checkPlaylist' , {state :{ playlistId : playlistId}})
    }
    return <div className="h-[100vh]  bg-gradient-to-r from-purple-400 to-gray-400 text-white flex justify-center ">
    <form className="dataform  w-[60%] max-sm:w-[75%] max-sm:h-[80%] h-[340px] rounded-md mt-16 grid "onSubmit={handleSubmit}>
                     <p className="font-mono text-black max-md:text-2xl max-sm:text-xl">Enter the updated details </p>
                    <input type="text" placeholder="playlist name" className="bg-transparent text-black placeholder-gray-800 h-[60px] pt-2 border-b text-2xl max-md:text-xl focus:outline-none"name="name" onChange={ handleChange} >
                    </input>  
                    <textarea type="text" name="description" placeholder="description" className="bg-transparent text-black placeholder-gray-800 h-[90px] border-b text-2xl focus:outline-none max-md:text-xl" onChange={handleChange}>

                    </textarea>
                    <div className="flex gap-x-12 text-black text-2xl pt-2 max-md:text-xl max-sm:gap-x-4 max-sm:justify-center">
                        <div onClick={() => setchoose("public")} className={`cursor-pointer`}>
                            <div className={`bg-black text-white p-2 rounded-md ml-1 ${choose == "public" ? "border-4" : ""}`}>Public</div>
                        </div>
                        <div onClick={() => setchoose("private")} className="cursor-pointer">
                            <div className={`bg-black text-white p-2 rounded-md ${choose == "private" ? "border-4" : ""}`}>Private</div>
                        </div>
                    </div>       
                    <div className="pt-4 flex justify-center gap-x-2">
                        <Button text="submit" type="submit"></Button>
                        <Button text="close" onClick={handleClose}></Button>
                    </div>
                   
                  
        </form>
    </div>
}

export default UpdatePlaylist
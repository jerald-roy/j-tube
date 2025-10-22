import { useState } from "react"
import { useNavigate } from "react-router-dom";

function OtherSingleVideo({ video }) {
     var navigate = useNavigate()
    var [hoverVideo, setHoverVideo] = useState(false)
    // console.log(video)

    function handleVideoClick(videoId) {
        navigate("/videoPage" , {state:{videoId}})
    }



    return <div className={`dark:bg-purple-300 dark:text-black flex flex-col  text-white text-2xl items-center pb-6 gap-1 cursor-pointer ${hoverVideo ? "bg-purple-500":null} max-xl:text-xl  border-b border-white`} onMouseEnter={() => setHoverVideo(true)}
    onMouseLeave={()=>{setHoverVideo(false)}} onClick={()=>handleVideoClick(video._id)}>
        <div className="w-[350px] pt-4 max-xl:w-[300px] max-sm:w-[250px]">
            <img src={video.thumbnail.url}></img>
        </div>
        <div>
            <p>{video.title}</p>
        </div>
        
    </div>
}

export default OtherSingleVideo
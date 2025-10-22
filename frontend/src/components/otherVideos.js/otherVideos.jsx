
import Button from "../common/button/button"
import OtherSingleVideo from "./otherSingleVideo"
import { useNavigate } from "react-router-dom"
// var otherVideos = [
//     {
//         "title": "this uo is teilee numner 1 wja opk",
//         "thumbnail": thumbnail,
//         "_id":"123"
//     },
//     {
//         "title": "this uo is teilee numner 1 wja opk",
//         "thumbnail": thumbnail,
//         "_id":"234"
//     },
// ]

function OtherVideos({ getOtherVideos , id  , othervideosLength}) {
    var navigate = useNavigate()
    function handleMore(id) {
        navigate("/publicProfile" , {state:{id}})
    }
    return <>
        {
            othervideosLength ? <>
             <div>
        <div className="text-white text-2xl pt-8  max-xl:text-xl dark:bg-purple-300 dark:text-black "><div className="text-center">
        more content from the channel
        </div></div>
        <div>
{
            getOtherVideos.length != 0 ?
                <>
                    {getOtherVideos.map((videoDetails, key) => {
                        return <OtherSingleVideo video={videoDetails} key={key} className=" "></OtherSingleVideo>
                    })}
                  
                </>
           :
                <div>loading</div>
            
        }
        </div>
        </div>
            </> : <p className="text-xl pt-10 pb-6 max-sm:text-center  text-white dark:text-black dark:bg-purple-300">No more videos from this user</p>
        }
       
        <div className="flex justify-center pt-2 pb-2 dark:bg-purple-300 dark:text-black">
       <Button text="more" onClick={()=>{handleMore(id)}}></Button> 

        </div>
    </>
}

export default OtherVideos
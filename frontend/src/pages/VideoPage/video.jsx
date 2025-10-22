import {  useContext, useEffect , useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { UserContext } from "../../components/userContext";
const baseURL = import.meta.env.VITE_BASE_URL;
import { useState } from "react"
import GetLikes from "../../components/common/getLikes";
import { Cross } from "lucide-react"
import Button from "../../components/common/button/button";
import Pagination from "../../components/pagination/pagination";
import OtherVideos from "../../components/otherVideos.js/otherVideos";
import { ThumbsUp } from 'lucide-react';


function VideoPage() {
    var location = useLocation()
    var { videoId } = location.state 
    
    var { user } = useContext(UserContext)
    // console.log(user)
    //the below use state is for submitting the comment to the backend
    var [comment, setComment] = useState("")
    //the below comment is used for getting exactly about the video
    var [videoRequired, setVideoRequired] = useState(null)
    //this is for getting the already existed comments
    var [commentsRequired, setCommentsRequired] = useState([])
    //this below state is for the current page
       var [page, setPage] = useState(1)
    //this is for getting the total pages which we get from getComments
    var [totalPage, setTotalPage] = useState(0)
    //this state is used for display of right side videos
    var [checkSideVideos, setCheckSideVideos] = useState(true)
    //this state is used for getting the data for the other videos part
    var [getOtherVideos, setOtherVideos] = useState([])
    //this below state is used for getting the other videos length
    var [othervideosLength , setOtherVideosLength] = useState(0)
    //this state is for getting the total number of likes
    var [like, setLike] = useState(0)
    //the below state is getting the views at the mounting of the webpage
    var [views, setViews] = useState(0)
      //this below state is used for avoiding multiple request gng to backend used to sendind the time for the video played
    var [hasSent, setHasSent] = useState(false)
    //this below state is used to check whether the user is a subscriber or not during the inital render
    var [checkSubscribed, setCheckSubscribed] = useState("")
    
    var videoRef = useRef(null)
    function handleCancel() {
        setComment("")
    }
    function showPopup() {
        var popup = document.getElementById("popup")
        popup.classList.remove("hidden")
        setTimeout(() => {
            popup.classList.add("hidden")
        }, 2000)
    }
    function handleSubmit() {
        if (comment !== null && comment !== "") {
            var content = comment
            fetch(`${baseURL}/api/v1/comments/${videoId}`, {
                method: "POST",
                credentials:"include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({content})
            })
                .then(data => data.json())
                .then(() => {
                    // console.log(data)
                    showPopup()
                    handleCancel()
                    getComments(videoId , user , setCommentsRequired , setTotalPage , page)
                })
            .catch(err => console.log(err))
        }
    }


    //the above functions are all related to comment box and comments--------------------------
    
    useEffect(() => {
        
            async function fetchData() {
                try {
                
                    var [res1 , res2 ] = await Promise.all([
                        fetch(`${baseURL}/api/v1/videos/${videoId}` ,{
                            method: "GET",
                            credentials:"include",
                             headers: {
                             "Authorization": `Bearer ${user.accessToken}`,
                            "Accept":"application/json"
                             }
                        }),
                            fetch(`${baseURL}/api/v1/videos/otherVideos/${videoId}`, {
                            method: "GET",
                            credentials: "include",
                            headers: {
                              "Accept":"application/json"
                                 }
                             })
                    ])
                    
                    var [json1 , json2 ] = await Promise.all([res1.json() , res2.json()])
                   
                    setOtherVideosLength(json2.data.otherVideoLength)
                    // console.log(json2.data)
                    setOtherVideos(json2.data.otherVideos)
                
                  
                    GetLikes(`api/v1/likes/getTotalLike/${videoId}` , setLike )
                    
                    GetViews(videoId , setViews)
                    
                    checkSubscribedFunction(videoId , setCheckSubscribed)
                    setVideoRequired({
                         "videoFile": json1.data.videoFile.url,
                          "title": json1.data.title,
                          "description": json1.data.description,
                          "creationDate": new Date(json1.data.createdAt).toLocaleDateString(),
                          "creatorDetails": {
                               id: json1.data.creatorDetails[0]._id,
                               username: json1.data.creatorDetails[0].username,
                                avatar:json1.data.creatorDetails[0].avatar
                         }
                    })
                    
                   
                     getComments(videoId ,user , setCommentsRequired,setTotalPage , page)
                    
                    //this is used to get if the user has already viewed the video where it is considered as a view
                    var store = localStorage.getItem(`hasSent-${videoId}`) === "true"
                    setHasSent(store)
                } catch (err) {
                    console.log("error fetching the data :" , err)
                }
            }
          fetchData()
        
            
        },[comment , user , videoId , page ])
    return <> {videoRequired ?
        (<div className="grid grid-cols-12 pl-2 pr-2 bg-mainBackground2 relative dark:bg-purple-100 dark:text-black">
            <PopUp content="comment successfully added!"></PopUp>
            <div className={` ${checkSideVideos ? "col-span-11" : "col-span-8"
             } max-lg:col-span-11`}>
                <div className="text-white dark:text-black">
                    <SingleVideo
                        id = {videoId}
                        videoFile={videoRequired.videoFile}
                        title={videoRequired.title}
                        description={videoRequired.description}
                        creationDate={videoRequired.creationDate}
                        creatorId={videoRequired.creatorDetails.id}
                        creatorUsername={videoRequired.creatorDetails.username}
                        creatorAvatar={videoRequired.creatorDetails.avatar}
                        like={like}
                        setLike={setLike}
                        views={views}
                        setViews={setViews}
                        hasSent={hasSent}
                        setHasSent={setHasSent}
                        checkSubscribed={checkSubscribed}
                        setCheckSubscribed={setCheckSubscribed}
                        videoRef={videoRef}
                       
                    ></SingleVideo>
                </div>
                {/* this below div is for the comment you wanna write  */}
                <div className="">
               
                    <div className="flex pt-4 pb-4 gap-4 text-white text-2xl w-full items-center">
                        <div className="w-[80px] h-[80px] max-sm:w-[60px] max-sm:h-[60px] ">
                            <img src={user.user.avatar} className="w-full h-full  rounded-full"></img>
                        </div>
                        <div className=" flex-1">
                            <form className="w-full ">
                                <textarea className="dark:bg-purple-200 dark:text-black bg-mainBackground2 border-0 focus:outline-none border-b-2 border-t-2 focus-ring-0 w-3/4 h-40 dark:border-black placeholder-gray-700 max-sm:w-full" placeholder="write your comment "
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                ></textarea>
                            </form>
                            <div className="flex gap-4 pt-3">
                                <div>
                                    <Button text="cancel" onClick={handleCancel}></Button>
                                </div>
                                <div>
                                    <Button text="submit" onClick={handleSubmit}></Button>
                                </div>
                            </div>
                        
                      
                        </div>
                    </div>
                    <div className="text-white bg-black font-semibold text-1xl">
                        comments
                    </div>
                </div>
                {/* this below is for the actual comments */}
                <div><Comments comments={commentsRequired} setCommentsRequired={setCommentsRequired} totalPage={totalPage} page={page} setPage={setPage}></Comments></div>
            </div>
            <div className={`${!checkSideVideos ? "col-span-4 ": "col-span-1"}  absolute right-10 max-sm:right-0 max-sm:left-0 bg-mainBackground`}>
                {!checkSideVideos ? <OtherVideos id={videoRequired.creatorDetails.id} getOtherVideos={getOtherVideos} othervideosLength={othervideosLength}>
                    
                </OtherVideos> : null} 
                <div className="bg-newPurple">
                    <Cross className="bg-newPurple text-white absolute top-0 rounded-md sm:w-8 sm:h-8 " onClick={()=>setCheckSideVideos(!checkSideVideos)}></Cross>
                </div>
            </div>
        </div>) : <div className="flex justify-center text-purple-800">
            <div>loading</div>
        </div>
    } 
    </> 
 }

function SingleVideo({ id, videoFile, title, creatorAvatar, creationDate, creatorId, description, creatorUsername, like, setLike, views, setViews, hasSent, setHasSent, checkSubscribed, setCheckSubscribed, videoRef }) {
    //this below function is used to showing the pop up for adding the videos to the playlist
     var navigate = useNavigate()
    var [isExpanded, setIsExpanded] = useState(false)
  
    function setExpanded() {
        setIsExpanded(!isExpanded)
    }
    //this fuction is to handle things when the user clicks on the like button
    function handleLike(videoId) {
       
        fetch(`${baseURL}/api/v1/likes//toggle/v/${videoId}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Accept":"application/json"
            }
                
        })
            .then((res) => res.json())
            .then(() => {
                 GetLikes(`api/v1/likes/getTotalLike/${videoId}`,setLike)
                 
            })
               .catch(err => console.log(err))
    }
    //this function is used to check whether the video has gone more that (x)second and send the request to the backend
    function handleTimeUpdate(videoId) {
        var videoTime = videoRef.current.currentTime
     

        if (videoTime >= 2 && !hasSent) {
            // console.log("hello")
            setHasSent(true)
            localStorage.setItem(`hasSent-${videoId}`,"true")
            fetch(`${baseURL}/api/v1/videos/${videoId}/watch`, {
                method: "POST",
                "credentials": "include",
                headers: {
                    "Accept":"application/json"
                }
            })
                .then(res => res.json())
                .then(() => {
                    // console.log(data)
                    GetViews(videoId, setViews)
                })
            .catch(err => console.log(err))
        }

    }

    //this function is used for toggleing the subscription
    function handleSubscription(videoId) {
        fetch(`${baseURL}/api/v1/subscriptions/toggleSubscription/${videoId}`, {
            method: "POST",
            "credentials": "include",
            headers: {
                "Accept":"application/json"
            }

        })
            .then(res => res.json())
            .then(() => {checkSubscribedFunction(videoId , setCheckSubscribed) })
            .catch(err => console.log(err))
    }
    function handlePlaylist() {
        navigate("/navigatePlaylist" , {state:{videoId :id }})
    }
    function handleProfile(id) {
        navigate("/publicProfile",{state:{id:id}})
    }
    var displayText = isExpanded ? description : description.slice(0,100) + ("...")
    return <div>
        <div className="h-[400px] max-sm:h-[300px] dark:text-black">
            <video controls key={videoFile} className="w-full h-full" onTimeUpdate={()=>handleTimeUpdate(id)} ref={videoRef} >
                <source src={videoFile} ></source>
            </video>
        </div> 
        <div className="p-2">
            <div className="font-bold max-sm:text-2xl">
                <p>{ title}</p>
            </div>
            <div className="grid grid-cols-2 pt-5 max-sm:grid-cols-1">
                <div className="col-span-1 max-sm:place-items-center">
                    <div className="w-[100px] h-[100px] max-sm:w-[70px] max-sm:h-[70px] cursor-pointer" onClick={() => handleProfile(creatorId)}>
                        <img src={creatorAvatar} className="w-full h-full rounded-full"></img>
                    </div>
                    <p className="font-mono">{creatorUsername}</p>
                    <div className="pt-10">
                 <Button text={checkSubscribed ?"Unsubscribe"   :"Subscribe"} onClick={()=> {handleSubscription(id)}} id={id} ></Button>
                    </div>
                   
                </div>
                <div className="col-span-1">
                    <div >
                        <ThumbsUp onClick={()=>handleLike(id)} ></ThumbsUp>
                    </div>
                     
                    <div className="font-mono text-2xl max-sm:text-xl pt-2 dark:text-black">
                         
                        <p>likes :{ like ? like : 0}</p>
                        <p>views : { views}</p>
                        <p>creation Date : {creationDate}</p>
                        <div onClick={handlePlaylist}>
                            <button className="border-2 p-1 cursor-pointer rounded-md mt-2 dark:border-black">Add video to playlist</button>
                        </div>
                        
                      
                    </div> 
                    
                </div>
            </div>
            <div className="p-5 ">
                <p className="text-2xl inline">{displayText}</p>
                <button className="text-2xl font-bold inline " onClick={setExpanded}>
                    {isExpanded ? "less" : "more"}
                </button>
            </div>
        </div>
   </div> 
}

function Comments({ comments, setCommentsRequired  , totalPage  , page , setPage}) {
//  console.log(totalPage)
    
 return ( <>
    {comments.length != 0 ? ( 
             <>
       {  comments.map((comment, index) => (
        <SingleComment
          key={index}
          id={comment._id}
          content={comment.content}
          avatar={comment.comment_writer_details.avatar}
          setCommentsRequired={setCommentsRequired}    
          commentOwnerId={comment.comment_writer_details._id}
               page={page}
              
           />))}
              <Pagination page={page} setPage={setPage} totalPage={totalPage}></Pagination>
             </>
           
         )
             : (
                 <div className="flex justify-center text-white pb-4 max-sm:text-xl dark:text-black">
                     <div>
                         no comments were added yet
                     </div>
                 </div>
    )}
  </>
);   
}

function SingleComment({ content, avatar, id, setCommentsRequired, commentOwnerId, page }) {
    var navigate = useNavigate()
    // console.log(commentOwnerId)
    var check = false
    var { user } = useContext(UserContext)
    // console.log(commentOwnerId)
    // console.log(user)
    if (commentOwnerId == user.user._id) {
        check = true
    }
    var location = useLocation()
    var { videoId } = location.state 
    //this below state is used for displaying the div to write the updated mssg
    var [updatedData, setUpdatedData] = useState(false)
    //this below state is used for control on the written updated data
    var [updatedContent , setUpdatedContent] = useState("")
    function handleDelete(id) {
        // console.log(id)
        var commentId = id
        fetch(`${baseURL}/api/v1/comments/c/${commentId}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Authorization":`Bearer ${user.accessToken} `
            }
        })
            .then(res => res.json())
            .then(() => {
                
                getComments(videoId , user , setCommentsRequired,() => {} , page)

            })
            .catch(err => {
                console.log(err)
            })
        
        
            
    }
    function handleUpdate( content , id) {
        var commentId = id
        fetch(`${baseURL}/api/v1/comments/c/${commentId}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Authorization": `bearer ${user.accessToken}`,
                "Content-Type":"application/json"
            },
            body:JSON.stringify({content})
        })
            .then(res => res.json())
            .then(() => {
                setUpdatedData(!updatedData)
                getComments(videoId , user ,setCommentsRequired ,() => {}, page)
            })
    }
    function handleProfile(id) {
        navigate('/publicProfile' , {state:{id}})
    }
    
    return (
   <div className="pb-5 relative max-sm:text-xl ">
        <div className="flex items-center gap-x-3 pb-4 pt-4">
        <div className="w-[80px] h-[80px] max-sm:w-[60px] max-sm:h-[60px] cursor-pointer" onClick={()=>{handleProfile(commentOwnerId)}}> 
            <img src={avatar} className="w-full h-full  rounded-full"></img>
        </div>
                {/* here we are trying to show the box to update the comment */}
                {
                    updatedData ? <div className="absolute top-0 w-full ">
                        <form className="">
                            <textarea placeholder="write your updated comments here" className="h-28 w-full bg-mainBackground2
                            focus:outline-none border-b-2 border-t-2 focus-ring-0 text-white" onChange={(e) => {
                                setUpdatedContent(e.target.value) 
                            
                            }
                            
                            }>
                                
                            </textarea>
                            
                       </form>
                    </div> : <>{ null}</>
                }
        <div className="text-white dark:text-black">
            <p>{content}</p>
           
        </div>
 
        </div>
            <div className="flex gap-4  pt-5">
                {
                    updatedData  ? 
                        <>
                            <Button text="cancel" onClick={()=>{setUpdatedData(!updatedData)}}></Button>
                            <Button text="submit" onClick={() => handleUpdate(updatedContent , id)} id={id} ></Button>
                        </>
                        : <>
                            {check ?  <>
                                <Button text="update" onClick={() => { setUpdatedData(!updatedData) }} ></Button>
                            
                                <Button text="delete" onClick={(e) => handleDelete(e.target.id)} id={id}></Button>
                            </> : <>{null}</>}
                       
                    </>
                }
                
            </div>
    </div> 
        )
}

function PopUp({ content }) {
    return <div id="popup" className={`hidden  font-mono text-2xl fixed rounded-md bg-purple-100 z-10 max-sm:text-xl pt-3 text-black pl-2 pr-2
            left-1/2 transform -translate-x-1/2  dark:bg-black dark:text-white`}>
                <div>

                   {content}
                </div>
           
            </div>
}
function getComments( videoId, user, setCommentsRequired ,setTotalPage = () => {}, page = 1 ) {


    fetch(`${baseURL}/api/v1/comments/${videoId}?page=${page}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${user.accessToken}`,
            "Accept": "application/json",
            "Cache-Control": "no-cache",     
            "Pragma": "no-cache",
        }
    })
        .then(res => res.json())
        .then(data => {
        //    console.log(data.data.totalPages)
            setCommentsRequired(data.data.comments)
            setTotalPage(data.data.totalPages)

        }
        )
        .catch(err => console.log(err))

}
function GetViews(videoId , setViews) {
    fetch(`${baseURL}/api/v1/videos/checkViews/${videoId}`, {
             method: "GET",
            credentials: "include",
             headers: {
                        "Accept":"application/json"
                       }
    })
        .then(res => res.json())
        .then(data => {
            // console.log("inisde get views")
            // console.log(data)
            setViews(data.data)
        })
    
}
function checkSubscribedFunction(videoId , setCheckSubscribed) {
    fetch(`${baseURL}/api/v1/subscriptions/checkSubscribed/${videoId}`, {
        method: "GET",
        "credentials": "include",
        headers: {
            "Accpet":"application/json"
        }
    })
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            setCheckSubscribed(data.data)
        })
}
export default VideoPage
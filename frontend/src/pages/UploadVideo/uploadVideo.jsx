import { useEffect, useState } from "react"
import Button from "../../components/common/button/button"
import { useNavigate } from "react-router-dom"
import "../../components/common/cards/cards.css"
import Pagination from "../../components/pagination/pagination"
const baseURL = import.meta.env.VITE_BASE_URL;

function UploadVideo() {
    var navigate = useNavigate()
    //this below state is used for storing the data
    var [data, setData] = useState(null)
    //this below state is used to store the number of documents/videos that we receive used for showing the videos or no videos found
  var [numOfDocs, setNumOfDocs] = useState(0)
  //this below state is used for getting total number of pages
  var [totalPage, setTotalPage] = useState(1)
    //this below state is used to getting the total number of pages
    var [page , setPage] = useState(1)
    function handleClick() {
        navigate("/videoForm")
    }
    
  useEffect(() => {
      // console.log(page)
        fetch(`${baseURL}/api/v1/videos?page=${page}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept":"application/json"
            }
        })   
            .then(res => res.json())
            .then(data => {
               
                setData(data.data.resultOfPipeline)
                setNumOfDocs(data.data.numberOfVideos)
                setTotalPage(data.data.numberOfPages)
            }) 
            .catch(err => {
            console.log(err)
        })
    },[page])
  return <div className="bg-mainBackground min-h-[100vh] text-white pl-2 max-sm:pl-0 dark:bg-purple-100">
     
        <div className="grid grid-cols-2 pt-20 gap-x-4 max-sm:grid-cols-1 max-sm:place-items-center">
            <div className="bg-black font-bold pl-2  pt-2 text-2xl max-sm:text-xl max-sm:mb-4 max-sm:w-full">click here for uploading video</div>    
            <Button text="click me" onClick={handleClick}></Button>
    </div>
     <div className="pt-2 pb-2 font-bold dark:text-black max-sm:text-xl">your videos :</div>
      <div className="pt-6 flex gap-x-20 max-md:flex-wrap max-md:justify-center max-md:pt-16">
  {numOfDocs ? (
    data ? (
      data.map((item) => <Single item={item} key={item._id} />)
    ) : (
      <div className="text-white">loading</div>
    )
  ) : (
    <div className="text-white">no videos uploaded</div>
  )}
    </div>
    <div className="pt-6 pb-6">
      <Pagination page={page} setPage={setPage} totalPage={totalPage}></Pagination>
    </div>
    </div>
}

function Single({ item }) {
  var navigate = useNavigate()
  function handleClick() {
    navigate("/videoPage" , {state:{videoId:item._id}})
  }
  return <div className="w-[360px] max-sm:250 text-2xl  text-white  max-sm:text-xl cursor-pointer max-md:mb-10 bg-black h-[240px] max-sm:h[210px]  " onClick={handleClick}>
   
<div className="w-full  h-[70%] ">
      <img src={item.thumbnail.url} className="w-full object-cover h-full " ></img>
     </div>
    <div>
      <div>{item.title}</div>
     </div>

  
    
  </div>
}

export default UploadVideo
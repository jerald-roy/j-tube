import Cards from "../common/cards/cards.jsx"
import Pagination from "../pagination/pagination.jsx";
import { useEffect, useState } from "react"
var baseURL = import.meta.env.VITE_BASE_URL;
export default function SecondPart() {
    //this below state is used to store the data of the watch history
    var [watchHistoryData, setWatchHistoryData] = useState(null)
    //this below state is used to check the size of the watch history data
    var [size, setSize] = useState(0)
    //this below state is used to check total pages for pagination
    var [totalPage, setTotalPage] = useState(0)
    //this var is maintain which page are you in
    var [page , setPage] = useState(1)
    useEffect(() => {
        fetch(`${baseURL}/api/v1/users/history?page=${page}`, {
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept':"application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data.data)
                setWatchHistoryData(data.data.videos.watchedData)
                setSize(data.data.totalSize)
                setTotalPage(data.data.totalPages)
            })
            .catch(err => {
                console.log(err)
            })
    },[page])
    return <div className="grid pt-5 pl-2 pr-4 w-full">
        <div>
            <div className="p-6 font-mono w-full">
                <p className="text-4xl max-lg:text-3xl max-sm:text-2xl">Watch History :</p>
            </div>
            <div className="">
                {
                    size ?
                        <div className="flex justify-around flex-wrap gap-y-4 w-full">
                            {
                                watchHistoryData ? 
                                        watchHistoryData.map(item => {
                                            return <div className="">
                                               <Cards item={item} key={item._id}></Cards>
                                            </div>
                                           
                                        })
                                    
                                 : <div className="text-white dark:text-black">Loading...</div>
                            }
                        </div> :
                        <div className="text-white dark:text-black">No video watched</div>
               }
            </div>
            <div className="flex justify-center pb-10 pt-5">
                    <Pagination page={page} setPage={setPage} totalPage={totalPage}></Pagination>
                </div>
            
        </div>
        
   
    </div>
}
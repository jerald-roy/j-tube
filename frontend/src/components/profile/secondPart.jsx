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
    var [totalPage , setTotalPage] = useState(0)
    useEffect(() => {
        fetch(`${baseURL}/api/v1/users/history`, {
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept':"application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setWatchHistoryData(data.data.user[0].watchHistory)
                setSize(data.data.countDocument)
                setTotalPage(data.data.totalPages)
            })
            .catch(err => {
                console.log(err)
            })
    },[])
    return <div className="grid pt-5 pl-2 pr-4">
        <div>
            <div className="p-6 font-mono">
                <p className="text-4xl max-lg:text-3xl max-sm:text-2xl">Watch History :</p>
            </div>
            <div className=" grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-10">
                {
                    size ?
                        <div>
                            {
                                watchHistoryData ? 
                                        watchHistoryData.map(item => {
                                         return   <Cards item={item} key={item._id}></Cards>
                                        })
                                    
                                 : <div className="text-white dark:text-black">Loading...</div>
                            }
                        </div> :
                        <div className="text-white dark:text-black">No video watched</div>
               }
            </div>
            <div className="flex justify-center pb-10 pt-5">
                    <Pagination page={totalPage} setPage={setTotalPage} totalPage={totalPage}></Pagination>
                </div>
            
        </div>
        
   
    </div>
}
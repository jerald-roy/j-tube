import { useEffect, useState } from "react"
import Pagination from "../../components/pagination/pagination";
import helper from "./helper";

function SearchPage() {
    var [query, setQuery] = useState("")
    var [data, setData] = useState(null)
    var [countDocs, setCountDocs] = useState(0)
    
    //this below state is used for pagination
    var [page, setPage] = useState(1)
    //this below state is used for storing the total number of pages for the pagination
    var [totalPage , setTotalPage] = useState(0)
    function handleSubmit(e) {
        e.preventDefault()
        helper(query , setData , setCountDocs , page , setTotalPage)
    }
   
    useEffect(() => {
          if (query.trim()) {
    helper(query, setData, setCountDocs, page, setTotalPage);
        }
          // eslint-disable-next-line react-hooks/exhaustive-deps
    },[page])
    return <div className="bg-gradient-to-r from-purple-400 to-gray-400 min-h-screen  w-[100%] ">
 <div className="bg-[rgba(255,255,255,0.2)] min-h-screen w-[60%] max-sm:w-[80%] flex flex-col items-center mx-auto " >
            <div className="">
              
                     <form onSubmit={handleSubmit} className="flex justify-center max-sm:grid w-full max-sm:mx-auto max-sm:w-[80%] pt-2">
                <input type="text"  placeholder="please enter any keyword"
                    value={query}
                    onChange={(e)=>{setQuery(e.target.value)}}
                    className="border-2 border-black placeholder:text-xl pb-1 w-full"></input>
                <button type="submit " className="pl-2 max-sm:text-xl">Search</button>
            </form>

                
           
        </div>
        <div className="">
            {
                data ? <>
                 {
                        countDocs == 0 ?
                            <div>no title of videos found based on that keyword</div> :
                            <div className="grid gap-y-8 pt-10 max-sm:gap-y-4">
                                {
                                    data.map((item) => (
                                       <Single item={item} key={item._id}></Single>)
                                  ) 
                                }
                            </div>
                 }
                </> : <>
                 <div className="text-2xl max-sm:text-xl pt-2">no keywords searched</div>
                    </>
            }
            </div>
            <div className="pt-4">
                 <Pagination page={page} setPage={setPage} totalPage={totalPage} 
        ></Pagination>
            </div>
           
    </div>
    </div>
    
   
}

function Single({ item }) {
    // console.log(video)
    return <>
        <div className="w-[300px] h-[240px] max-sm:w-[290px] cursor-pointer hover:bg-purple-600">
            <img src={item.thumbnail.url} className="w-full h-[70%] bg-black" ></img>    
            <div className="text-2xl max-sm:text-xl">
            {
                item.title
            }
        </div>
        </div>
        
    </>
}


export default SearchPage
function Pagination({page, setPage, totalPage}) {
    // console.log(totalPage)
    // console.log(page)
    return <>
        <div className="flex gap-4 justify-center max-sm:text-2xl">
            <div className={`bg-purple-400 rounded-md p-1 mb-2 hover:bg-purple-700 ${page == 1 ? "bg-gray-400" : "bg-purple-400"}`}>
               <button onClick={()=>setPage(p => Math.max(p-1 , 1))} disabled={page==1}
            >prev</button> 
            </div>
            <div className={`bg-purple-400 rounded-md p-1 mb-2 hover:bg-purple-700 ${page == totalPage ? "bg-gray-400" : "bg-purple-400"}`}>
       <button onClick={()=>setPage(p => Math.min(p+1 ,totalPage ))} disabled={page==totalPage}>next</button>
            </div>
            
            
        </div>
    </>
}

export default Pagination
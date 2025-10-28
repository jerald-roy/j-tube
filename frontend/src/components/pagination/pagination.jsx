function Pagination({page, setPage, totalPage}) {


    return <>
        <div className="flex gap-4 justify-center max-sm:text-2xl">
            {
                !(page == 1) ?
                    <>
                <div className={`bg-purple-400 rounded-md p-1 mb-2 hover:bg-purple-700 `}>
               <button onClick={()=>setPage(p => Math.max(p-1 , 1))} disabled={page==1}
            >prev</button> 
                        </div>
                        </>
                : <></>
            }
            {
                !(page == totalPage) ? <>
                  <div className={`bg-purple-400 rounded-md p-1 mb-2 hover:bg-purple-700 }`}>
       <button onClick={()=>setPage(p => Math.min(p+1 ,totalPage ))} disabled={page==totalPage}>next</button>
            </div>
                </> : <></>
            }
            
          
            
            
        </div>
    </>
}

export default Pagination
function Pagination({ page, setPage, totalPage} ) {
    // console.log(`page = ${page}`)
    // console.log(`totalPage = ${totalPage}`)

    return <>
        <div className="flex gap-4 justify-center max-sm:text-2xl">
            {
                !(page == 1) ?
                    <>
                <div className={`bg-purple-400 rounded-md p-1 mb-2 hover:bg-purple-700 `}>
                            <button onClick={
                                () => {
                                      const newPage = Math.min(page - 1, totalPage);
                            setPage(newPage);
                    
                                }
                                
                            } disabled={page == 1}
            >prev</button> 
                        </div>
                        </>
                : <></>  
            }
            {
                !(page == totalPage  ||   totalPage == 0 ) ? <>
                  <div className={`bg-purple-400 rounded-md p-1 mb-2 hover:bg-purple-700 }`}>
                        <button onClick={() => {
                             const newPage = Math.min(page + 1, totalPage);
                            setPage(newPage);
                        
                        }} disabled={page == totalPage}>next</button>
            </div>
                </> : <></>
            }
            
          
            
            
        </div>
    </>
}

export default Pagination
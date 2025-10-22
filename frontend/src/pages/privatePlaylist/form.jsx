import Button from "../../components/common/button/button"
function FormPlaylist({ handleSubmit, handleChange, choose, setchoose, setCreatePlaylist, createPlaylist }) {
    return <>
      <form className="dataform  w-[60%] max-sm:w-[75%] max-sm:h-[80%] h-[340px] rounded-md mt-16 grid "onSubmit={handleSubmit}>
                     <p className="font-mono text-black max-md:text-2xl max-sm:text-xl">Enter the details of playlist</p>
                    <input type="text" placeholder="playlist name" className="bg-transparent text-black placeholder-gray-800 h-[60px] pt-2 border-b text-2xl max-md:text-xl focus:outline-none"name="name" onChange={ handleChange} >
                    </input>  
                    <textarea type="text" name="description" placeholder="description" className="bg-transparent text-black placeholder-gray-800 h-[90px] border-b text-2xl focus:outline-none max-md:text-xl" onChange={handleChange}>

                    </textarea>
                    <div className="flex gap-x-12 text-black text-2xl pt-2 max-md:text-xl max-sm:gap-x-4 max-sm:justify-center">
                        <div onClick={() => setchoose("public")} className={`cursor-pointer`}>
                            <div className={`bg-black text-white p-2 rounded-md ml-1 ${choose == "public" ? "border-2" : ""}`}>Public</div>
                        </div>
                        <div onClick={() => setchoose("private")} className="cursor-pointer">
                            <div className={`bg-black text-white p-2 rounded-md ${choose == "private" ? "border-2" : ""}`}>Private</div>
                        </div>
                    </div>       
                    <div className="pt-4 flex justify-center gap-x-2">
                        <Button text="submit" type="submit"></Button>
                        <Button text="close" onClick={()=>setCreatePlaylist(!createPlaylist)}></Button>
                    </div>
                   
                  
        </form>
    </>
}

export default FormPlaylist
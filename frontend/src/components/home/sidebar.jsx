// import profile1 from "../../assets/profile1.png"
// import profile2 from "../../assets/profile2.png"
// import profile3 from "../../assets/profile3.png"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus } from 'lucide-react';
import { ListVideo } from 'lucide-react';
import { Bird } from 'lucide-react';
import { Sun } from 'lucide-react'

import { ChevronsLeft } from 'lucide-react';
import { ChevronsRight } from 'lucide-react';
import { MoonStar } from 'lucide-react'
import UploadVideo from "../../pages/UploadVideo/uploadVideo";

function SidebarContent({ changeSideBar, sidebar , profile}) {
  var navigation = useNavigate()
  var [sun, setSun] = useState(true)
  function changeSun() {
     document.documentElement.classList.toggle("dark")
    setSun(!sun)
  }
  //this below function is used to navigate to the playlist page where you can create and check out your own playlist which can be private or public
  function handlePlaylist() {
    navigation('/privatePlaylist')
  }

  function handleProfile(id) {
    navigation("/publicProfile" , {state:{id:id}})
  }

  function handleSource() {
    navigation("/mySub")
  }

  function handleUploadVideo() {
    navigation("/uploadVideo")
  }
  return <> {  sidebar ? (<div className='h-full relative'>
       <ChevronsLeft size={34} className='absolute right-0 bg-black rounded-full cursor-pointer max-xl:hidden' color="white" onClick={changeSideBar}></ChevronsLeft>
      
      <div className='h-1/2'>
        <nav className='flex flex-col items-center justify-around h-full'> 
          <span title="change theme">
          {
          sun ? 
          (<Sun className='cursor-pointer text-newPurple w-[44px] h-[44px] max-lg:w-[34px] max-lg:h-[34px]' onClick={() => changeSun()}></Sun>) : 
          (
          <MoonStar className="cursor-pointer text-newPurple w-[44px] h-[44px] max-lg:w-[34px] max-lg:h-[34px]" onClick={changeSun}></MoonStar>    
          )
          }
          </span>
          
          <span title="Add a new Video">
            <Plus  className='cursor-pointer text-newPurple w-[44px] h-[44px] max-lg:w-[34px] max-lg:h-[34px]' onClick={handleUploadVideo} />
           </span>
          <span title="check out the playlist">
            <ListVideo onClick={handlePlaylist}  className='cursor-pointer text-newPurple w-[44px] h-[44px] max-lg:w-[34px] max-lg:h-[34px]' ></ListVideo>
           </span>
            
          
            
          </nav>
      </div>
      <div className='h-1/2 flex  flex-col justify-around'>
        <div className='flex justify-evenly '>
           <p className='text-2xl max-lg:text-lg text-newPurple font-bold pb-0 cursor-pointer' onClick={handleSource}>Sources</p>
        </div>
        <div className="flex  flex-col gap-1 items-center h-full justify-evenly">
          {
         profile && profile.map((item , idx)=>{
           return <div className='w-[45px] h-[45px]' key={idx}>
               <img src={item.avatar} className='w-full h-full object-cover rounded-full cursor-pointer' onClick={()=>handleProfile(item._id)}></img>
             </div>
          })
         }
        </div>
      </div>
    
  </div>) : ( <div className='bg-[#2f2f2f] dark:bg-purple-100 h-full w-full relative'>
           <ChevronsRight size={40} className='absolute  bg-black rounded-full cursor-pointer top-2 left-2 max-xl:hidden' color="white" onClick={changeSideBar}></ChevronsRight>
          </div>)
    }
    
  </>

 
}

export default SidebarContent
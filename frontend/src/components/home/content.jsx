
import { useContext, useEffect, useState } from "react"
import { sideBarContext } from "../sideBarContext.jsx"
import MainContent from "./heroParent.jsx";
import SidebarContent from "./sidebar.jsx";
const baseURL = import.meta.env.VITE_BASE_URL;

function Content() {
  var { sidebar, changeSideBar } = useContext(sideBarContext)
  //this state is used to get data for the sidepart profile
  var [profile, setProfile] = useState(null)
  useEffect(() => {
    fetch(`${baseURL}/api/v1/users/getChannelProfile`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept":"application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        // console.log(data)
        setProfile(data.data)
    })
  },[])
  return <> 
    {sidebar ? <div className='grid grid-cols-10 max-lg:relative'>

      <div className='bg-[#2f2f2f]   top-0 col-span-1  dark:bg-purple-200 z-10 max-lg:fixed max-lg:top-0 max-lg:w-1/4 '>
        <div className="  h-[800px] ">
           <SidebarContent 
          changeSideBar={changeSideBar}
            sidebar={sidebar}
            profile={profile}
        >
          
        </SidebarContent>
        </div>
       
      </div>
      <div className='col-span-9 max-lg:col-span-10'>
        <MainContent ></MainContent>
      </div>
    </div> :    
      <div className='flex flex-full  '>
        <div className='w-16 max-lg:hidden '>
          <SidebarContent
          changeSideBar={changeSideBar}
          sidebar={sidebar}
          ></SidebarContent> 
        </div>
        <div className="flex-1">
          <MainContent ></MainContent>
        </div>
        
      </div>}
    
  </>
} 

export default Content
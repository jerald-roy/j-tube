import { useContext } from 'react'
import { Crown } from 'lucide-react'
import {sideBarContext} from "../sideBarContext.jsx";
import { Search } from 'lucide-react';
import { UserPen } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { Menu } from 'lucide-react';
import { Link, useLocation , useNavigate } from "react-router-dom"
import { House } from 'lucide-react';
import { UserContext } from '../userContext.jsx';
const baseURL = import.meta.env.VITE_BASE_URL;
function Header() {
  
  return <header className={`grid grid-cols-6 items-center p-4 bg-[#201f21]
 dark:bg-purple-200 max-sm:p-2`} >   
    <div className="col-span-4 max-lg:col-span-4 max-sm:col-span-3 max-sm:gap-x-2">
       <Logo></Logo>
    </div>
    <div className="col-span-2 max-lg:col-span-2 max-sm:col-span-3 max-sm:pr-1">
      <nav>   
        <RightSideMenu></RightSideMenu>
      </nav>
   </div>
    
    </header>
  
}

export function Logo() {
  return <>
    <div className='font-bold text-newPurple flex  '>
      <div className=''><h1 className='inline'>JTube</h1></div>
      
      <span className=''>
        <Crown></Crown>
      </span>
    </div>
  
  </>
}

function RightSideMenu() {
  const {user , setUser} = useContext(UserContext)
  var { changeSideBar } = useContext(sideBarContext)
  var navigate = useNavigate()
  var location = useLocation()
  var isHome = location.pathname == '/home'
  var isProfile = location.pathname == '/profile'
  var isSearch = location.pathname == '/searchPage'
  function changeNavigation() {
    //first we need to hit the backend & try to remove the cookies
    //${baseURL}/api/v1/videos/homePage/videos`
    fetch(`${baseURL}/api/v1/users/logout`, {
      method: "POST",
      headers: {
        "Authorization":`Bearer ${user.accessToken}`
      },
      credentials: "include",
    })
      .then(() => { console.log("user was logged out") })
      .catch((err) => console.log(err))
    //change the state to null
    setUser(null)
    //then navigate to the home page
    navigate("/" , {state : {message : "Successfully log out!"}})
  }
  function changeToSearch() {
    navigate("/searchPage")
  }
  return <>
    <div className='flex justify-around text-newPurple font-semibold max-lg:font-medium max-sm:justify-end max-sm:space-x-4'>
      {
        !isHome ? null : <Menu className="xl:hidden" onClick={changeSideBar}></Menu>
      }
      
      {
        isProfile ? null : <div className="max-xl:hidden"><Dashboard ></Dashboard></div>
      }
 
      
      
      {
        
        isProfile ? null : <Link to="/profile"><UserPen className="xl:hidden"></UserPen></Link>
      
      }
      
      

      <div className="max-xl:hidden"><Sign changeNavigation={changeNavigation}></Sign></div>

      <LogOut className='xl:hidden' onClick={changeNavigation}></LogOut>
      
      {
        isSearch ? "" :
        <Search className="xl:hidden" onClick={changeToSearch}></Search>}
     
      {!isHome ? <div className='max-xl:hidden'>
        <Home></Home>
        
      </div> : null}

      { isSearch ? "": <div className='max-xl:hidden '>
        <SearchPage></SearchPage>
      </div>}
      
      {
        !isHome ? <Link to="/home"><House className='xl:hidden'></House></Link>  : null
      }
      
    </div>
  </>
}

function SearchPage() {
  return <>
    <div className='cursor-pointer max-md:text-xl'>
     <Link to="/searchPage"><h3>Search</h3></Link> 
    </div>
    </>
}

function Dashboard() {
  return <>
    <div className='cursor-pointer max-md:text-xl'>
      <Link to="/profile"><h3 className='m-0'>Profile</h3></Link>
    
    </div>
  
  </>
}

function Sign({changeNavigation}) {
  return <>
    <div className='cursor-pointer max-md:text-xl' onClick={changeNavigation}>
      <h3 >SignOut</h3>
    </div>
  
  </>
}

function Home() {
  return <>
    <div className='cursor-pointer max-md:text-xl'>
     <Link to="/home"><h3>Home</h3></Link> 
    </div>
  
  </>
}

export default Header
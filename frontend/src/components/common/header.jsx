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
  
  return <header className={`grid grid-cols-7 items-center p-4 bg-[#201f21]
 dark:bg-purple-200 max-sm:p-2`} >   
    <div className="col-span-2 max-lg:col-span-5 max-sm:col-span-3">
       <Logo></Logo>
    </div>
    <div className='col-span-3 max-lg:hidden '>
       <SearchBar></SearchBar>
    </div>
    <div className="col-span-2 max-lg:col-span-2 max-sm:col-span-4 max-sm:pr-1">
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
  return <>
    <div className='flex justify-evenly text-newPurple font-semibold max-lg:font-medium max-sm:justify-end max-sm:space-x-4'>
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
      
     <Search  className="xl:hidden" ></Search>
     
      {!isHome ? <div className='max-xl:hidden'>
        <Home></Home>
        
      </div> : null}
      
      {
        !isHome ? <Link to="/home"><House className='xl:hidden'></House></Link>  : null
      }
      
    </div>
  </>
}

function SearchBar() {
  
  return <>
  <input type="search" placeholder="search" className={`w-full rounded-lg text-2xl  text-black pl-2 pt-2 pb-2 border dark:border-black`} maxLength={50}></input>
  </>
}

function Dashboard() {
  return <>
    <div className='cursor-pointer max-md:text-xl'>
      <Link to="/profile"><h2>Profile</h2></Link>
    
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
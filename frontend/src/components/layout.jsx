import { Outlet } from "react-router-dom"
import Header from "./common/header"
import { useState } from "react"
// eslint-disable-next-line no-unused-vars
import { sideBarContext } from "./sideBarContext.jsx"
function Layout() {
   var [sidebar, setSidebar] = useState(false)
  function changeSideBar() {
    setSidebar(!sidebar)
  }
    return <sideBarContext.Provider value={{ sidebar, setSidebar, changeSideBar }}>
        <div className="max-w-[1920px] mx-auto text-3xl">
         <Header></Header>
        <Outlet></Outlet>
        </div>
       
    </sideBarContext.Provider>
}

export default Layout
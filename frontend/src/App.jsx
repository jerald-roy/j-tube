import {  useContext } from "react"
import Home from "./pages/Home/home.jsx"
import Profile from "./pages/Profile/profile.jsx"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./components/layout.jsx"
import Signin from "./pages/Signin/signin.jsx"
import Register from "./pages/Register/register.jsx"
import VideoPage from "./pages/VideoPage/video.jsx"
import PublicProfilePage from "./pages/PublicProfilePage/publicProfilePage.jsx"
import PrivatePlaylist from "./pages/privatePlaylist/privatePlaylist.jsx"
import { Navigate } from "react-router-dom"
import CheckPlaylist from "./pages/privatePlaylist/checkPlaylist.jsx"

import { UserContext } from "./components/userContext.jsx"
import AddVideos from "./pages/VideoPage/addVideosToPlaylist.jsx"
import UpdatePlaylist from "./pages/privatePlaylist/updatePlaylist.jsx"
import MySub from "./pages/MySubPlaylist/mySub.jsx"




function App() {
var {user} = useContext(UserContext)
  //  var hasAccessToken = document.cookie("").split()
  // if (user === null &&  ) {
  //   return <div>Loading...</div>;
  // }
  return (

    <Router>
      <Routes>
        {
            user == null ? 
            (<>
            <Route path="/" element={<Signin />}></Route>
            <Route path="/register" element={<Register></Register>}></Route>
                <Route path="/home" element={<div></div>}> </Route>
                <Route path="/profile" element={<Profile></Profile>}></Route>
                <Route path="/videoPage" element={<div></div>}></Route>
                <Route path="/publicProfile" element={<div></div>}></Route>
                <Route path="/privatePlaylist" element={<div></div>}></Route>
                <Route path="/checkPlaylist" element={<div></div>}></Route>
                <Route path="/navigatePlaylist" element={<div></div>}></Route>
                <Route path="/updatePlaylist" element={<div></div>}></Route>
                <Route path="/mySub" element={<div></div>}></Route>
              </>) :
              (
                <>
           
        <Route element={<Layout></Layout>}>
        <Route path="/" element={<Navigate to="/home" replace />}></Route>
        <Route path="/home" element={<Home></Home>}> </Route>
        <Route path="/profile" element={<Profile></Profile>}></Route>
        <Route path="/videoPage" element={<VideoPage></VideoPage>}></Route>
        <Route path="/publicProfile" element={<PublicProfilePage></PublicProfilePage>}></Route>
         <Route path="/privatePlaylist" element={<PrivatePlaylist></PrivatePlaylist>}></Route>
        <Route path="/checkPlaylist" element={<CheckPlaylist></CheckPlaylist>}></Route>            
          <Route path="/navigatePlaylist" element={<AddVideos></AddVideos>}></Route> 
          <Route path="/updatePlaylist" element={<UpdatePlaylist></UpdatePlaylist>}></Route>   
        <Route path="/mySub" element={<MySub></MySub>}></Route>            
        </Route>   </> 
            )
        }
      </Routes>
      </Router>

  )
  
}

export default App

import video1 from "../../assets/video.mp4" 
import profile from "../../assets/thumbnail.png"
import { Navigate, useNavigate } from "react-router-dom"
//we will always try to pick the randome playlist at the beginning
var playlist = [
  {
    name: "this is my first playlist",
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perspiciatis, itaque.",
    video:  video1 ,
    profilePhoto: profile
  }
]

function UpperHeroSection() {
  return <div className="grid grid-cols-2 max-md:grid-cols-1 max-md:gap-y-10">
    <div className="col-span-1 max-md:grid-cols-1">
      <VideoPart></VideoPart>
    </div>
    <div className="col-span-1 max-md:grid-cols-1 flex justify-center items-center max-md:mb-10">
      <TextPart></TextPart>
    </div>
  </div>
}

function VideoPart() {
  var navigate = useNavigate()
  function handleSub() {
    navigate("/mySub")
  }
  return <div className="md:mb-8 cursor-pointer" onClick={handleSub}>
    <video controls>
      <source src={playlist[0].video} type="video/mp4"></source>
    </video>
    <div className="grid   ">
      <p className="text-white text-2xl max-sm:text-xl max-sm:pl-1 dark:text-black">Check out the public playlist by creators around the world!</p>
      
    </div>
  </div>
 }
function TextPart() {
  return <div className="px-8 font-black font-2xl max-sm:text-xl">
      <p className="bg-black text-white mb-4 ">powered by jatoms</p>
       <h1 className="text-newPurple">
    Explore top #Videos from around the world
        </h1>
    </div>

}

export default UpperHeroSection
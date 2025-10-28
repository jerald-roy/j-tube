import { useNavigate } from "react-router-dom"
import Button from "../common/button/button.jsx"

export default function FirstPart({ userData }) {
    var navigate = useNavigate()
    function handleEdit() {
         navigate("/updateProfile" ,{state:{id:userData.id}})
     }
    return <div className="grid grid-cols-6 pt-5 font-mono  max-xl:grid-cols-1 text-3xl max-xl:text-2xl max-sm:text-xl">
        <div className="col-span-2 grid justify-center">
            <div className="h-60 w-60 max-xl:h-42 max-xl:w-42">
                <img src={userData.avatar} className="w-full h-full object-cover rounded-full"></img>
            </div>
            <div className="ml-auto mr-auto">
               {userData.username}
            </div>
        </div>
        <div className="col-span-4  max-xl:pt-5 pl-3 pr-3 ">
            <div className="space-y-4 ">
           
                 <div className="flex max-sm:flex-col">
                    <div className="w-[50%]  bg-newPurple dark:text-white text-right max-sm:w-[60%]">email :  </div>
                    <div className="max-sm:flex max-sm:justify-center">{userData.email}</div>
                </div>
                <div className="flex ">
                    <div className="w-[50%]  text-right max-sm:w-[60%]">Created at :  </div>
                    <div className="">{userData.creationDate}</div>
                </div>
                <div className="flex ">
                    <div className="w-[50%] text-right max-sm:w-[60%]">subscribers : </div>
                    <div className="">{userData.totalNumberOfSub}</div>
                </div>
                
                <div className="flex ">
                    <div className="w-[50%] text-right max-sm:w-[60%]">total views : </div>
                    <div className="">{userData.totalNumberOfViews}</div>
                </div>
                <div className="flex " > 
                    <div className="w-[50%]  text-right max-sm:w-[60%]">total likes : </div>
                    <div className="">{userData.totalNumberOfLikes
}</div>
                </div>
                <div className="flex " > 
                    <div className="w-[50%]  text-right max-sm:w-[60%]">total Videos : </div>
                    <div className="">{userData.
toalNumberOfVideos
}</div>
                </div>
                <div className="flex pb-2" >
                    <div className=" ml-auto mr-auto text-right ">
                        <Button text={"Edit"} onClick={() =>handleEdit()}></Button>
                    </div>
                    
                </div>
               
        
            </div>
        </div>
    </div>
}
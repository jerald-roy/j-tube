import { useState } from "react"
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/button/button";
const baseURL = import.meta.env.VITE_BASE_URL;

function UpdateProfile() {
     var navigate = useNavigate()
    //this is the id of the profile that you wanna update
  
    //this below state is used to store the details of the updated name or email
    var [data, updatedData] = useState({
        fullName: "",
        email:""
    })
    var [file1, setFile1] = useState(null)
    var [file2 , setFile2] = useState(null)
    function handleSubmit(e) {
        e.preventDefault()
        if (!data.fullName.trim() && !data.email.trim()) {
            alert("please fill  username or the email for updating")
            return
        }
         
        fetch(`${baseURL}/api/v1/users/update-account`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(data)
               
        })
         .then(res => res.json())
        .then( () => {
                  updatedData({
                   fullName: "",
                   email:""
                  })
            alert("details were successfully updated")
                })
            .catch(err => console.log(err))
    }
    function handleChange(e) {
        var { name,value } = e.target 
        updatedData({
            ...data,
            [name]:value
        })
    }
    function handleBack() {
        navigate("/profile")
    }
    function handleProfileChange(e) {
        setFile1(e.target.files[0])
    }
    function handleProfileSubmit(e) {
        e.preventDefault()
        if (!file1) {
            alert("please select your updated profile pic")
            return
        }
        var formData = new FormData()
        formData.append("avatar", file1)
        
        fetch(`${baseURL}/api/v1/users/avatar`, {
            method: "PATCH",
            credentials: "include",
            body:formData
        })
            .then(res => res.json())
            .then(() => {
                setFile1(null)
                alert("profile was successfully updated")
            })
        .catch(err => console.log(err))
    }
    function handleChangeCoverImage(e) {
        setFile2(e.target.files[0])
    }
    function handleSubmitCoverImage(e) {
        e.preventDefault()
        if (!file2) {
            alert("please select your updated cover pic")
            return
        }
        var formData = new FormData()
        formData.append("coverImage", file2)
        
        fetch(`${baseURL}/api/v1/users/cover-image`, {
            method: "PATCH",
            credentials: "include",
            body:formData
        })
            .then(res => res.json())
            .then(() => {
                setFile2(null)
                alert("cover image was successfully updated")
            })
        .catch(err => console.log(err))
    }
    return <div className="text-2xl max-sm:text-xl bg-gradient-to-r from-purple-400 to-gray-400  min-h-[100vh] flex justify-center" >
        <div className=" w-[70%] max-sm:w-[100%] bg-[rgba(255,255,255,0.2)]  pl-2">
             
              <div className="">
                <div className=" font-mono text-black max-md:text-2xl max-sm:text-xl  "> update name or email</div>
                <form onSubmit={handleSubmit} className="">
                    <div className="pl-2 ">
                        <input type="text"
                        name="fullName"
                        value={data.fullName}
                            onChange={handleChange}
                            className="bg-transparent text-black placeholder-gray-800 h-[60px] pt-2 border-b text-2xl max-md:text-xl focus:outline-none w-full"
                            placeholder="enter the updated name ">
                        </input>
                    </div>
                    <div className="pl-2">
                      <input type="text"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                         placeholder="enter the updated email"
                          className="bg-transparent text-black placeholder-gray-800 h-[60px] pt-2 border-b text-2xl max-md:text-xl focus:outline-none w-full"
                        >

                        </input>
                    </div>
                    <div className="pt-4 pb-4">
                       <Button text="submit" type="submit" ></Button> 
                   </div>
                    
                </form>
              </div>   
              <div className="">
                <div className="font-mono text-black max-md:text-2xl max-sm:text-xl  pt-2 pb-2">update profile </div> 
                <form onSubmit={handleProfileSubmit} className="">
                    <input type="file" onChange={handleProfileChange} className="block w-full"></input>
                    <div className="pt-4 pb-2">
                         <Button type="submit" text="submit" ></Button>
                    </div>
                  
                 </form>
              </div>
              <div className="">
                <div className="font-mono text-black max-md:text-2xl max-sm:text-xl pt-2 pb-2">update coverImage </div> 
                <form onSubmit={handleSubmitCoverImage}>
                    <input type="file" onChange={handleChangeCoverImage} className="block w-full bg-transparent text-black placeholder-gray-800 h-[60px] pt-2 "></input>
                    <div className="pt-2">
     <Button type="submit" text="submit">Submit</Button>
                    </div>
               
                </form>
                
              </div>
        
            <div className="flex justify-center" onClick={handleBack} >
                <div>
                    <button>Back</button> 
                </div>
           
       </div>
        </div>
      
    
    </div>
}
export default UpdateProfile
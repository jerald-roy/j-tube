import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../components/common/button/button";
const baseURL = import.meta.env.VITE_BASE_URL;

function Register() {
    var navigate = useNavigate()
    
    var [formData, setFormData] = useState({
        username: "",
        email: "",
        fullName: "",
        avatar: null,
        password:""
    })
    function handleChange(e) {
        var { name, value, files } = e.target
        
        setFormData((prev) => ({
            ...prev, // how is this spread opertor working here 
            [name]: files ? files[0] : value 
        }))
    }
    
    function handleSubmit(e) {
           var temp = true
        e.preventDefault()
        //here we need to check things whether all the required things are present and try to register thing with our db and it that POST request was successfull we should get the user back to the home page using navigate
           try {
               var { username, email, fullName, avatar, password } = formData
               if (username.length == 0 || email.length == 0 || fullName.length == 0 || avatar == null || password.length == 0) {
                   alert("all the feilds must be filled")
                   throw Error("all the feilds must be filled!")
               }
           } catch (err) {
               temp = false
               console.error(err)
        }
        if (temp) {
            //lets first try to save things in the db what the user has sent and then navigate back to the "/" page
            var  sendingData = new FormData()
            
            for (var key in formData) {
                sendingData.append(key,formData[key])
            }
                fetch(`${baseURL}/api/v1/users/register`, {
                    method: "POST",
                    body:sendingData
                })
                .then(res => res.json())
                    .then(data => {
                        console.log("data :", data)
                        //should do the navigation here
                        navigate("/")
                    })
                    .catch(err => {
                     console.log("this is the error :" , err )
                 })
            
        }
     }   
      
    function handleBack() {
        navigate("/")
    }
   
   
    return <div className="bg-gradient-to-r from-purple-400 to-gray-400  min-h-screen flex justify-center place-items-center">
        <form onSubmit={handleSubmit} className="w-[70%] max-sm:w-[92%]  bg-[rgba(255,255,255,0.2)] ">
            <div className=" h-full pl-5 grid">
                  <div className="font-mono text-2xl max-sm:text-xl grid justify-center pt-6">
                        <div>Enter the user details</div>
                        
                    </div>
                <div className="pt-14">
                  
                   <input
                        type="text"
                        name="username"
                         placeholder="username"
                        value={formData.username}
                        onChange={handleChange}
                        className=" bg-transparent text-black placeholder-gray-800 h-[60px]  border-b text-2xl max-md:text-xl focus:outline-none font-mono border-black w-full "
                        
                    ></input> 
                </div>
                <div>
                    <input
                         type="text"
                         name="email"
                         placeholder="email"
                         value={formData.email}
                        onChange={handleChange}
                             className=" bg-transparent text-black placeholder-gray-800 h-[60px] pt-2 border-b text-2xl max-md:text-xl focus:outline-none border-black w-full"
                     ></input>
                </div>  
                <div>
                   <input
                type="text"
                name="fullName"
                placeholder="fullName"
                value={formData.fullName}
                onChange={handleChange}
                       className=" bg-transparent text-black placeholder-gray-800 h-[60px] pt-2 border-b text-2xl max-md:text-xl focus:outline-none border-black font-mono w-full"      
            ></input>
                </div>
                <div className="pt-4 pb-4">
                   <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                      className=" bg-transparent text-black placeholder-gray-800 h-[60px] pt-2 border-b text-2xl max-md:text-xl max-sm:text-lg focus:outline-none w-full font-mono border-black "
                 ></input>
                </div>
                <div>
                  <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                      className=" bg-transparent text-black placeholder-gray-800 h-[60px] pt-2 border-b text-2xl max-md:text-xl focus:outline-none border-black font-mono"
            ></input>
                </div>
                 <div className="pt-4 pb-2 flex gap-x-4">
                    <Button text="submit" type="submit" >Submit</Button>
                    <Button text="back" onClick={handleBack}></Button>
                </div>
            </div>
           
            
           
          
            
            
    </form>
    </div>
}

export default Register
import { useState } from "react"
import { useNavigate} from "react-router-dom"
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
      
        
   
   
    return <div className="bg-black  h-screen">
        <form onSubmit={handleSubmit} className=" h-full ">
            <div className="grid justify-center h-full">
                <div>
                   <input
                        type="text"
                        name="username"
                         placeholder="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="h-10 placeholder-black"
                        
                    ></input> 
                </div>
                <div>
                    <input
                         type="text"
                         name="email"
                         placeholder="email"
                         value={formData.email}
                        onChange={handleChange}
                        className="h-10 placeholder-black"
                     ></input>
                </div>  
                <div>
                   <input
                type="text"
                name="fullName"
                placeholder="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="h-10 placeholder-black"        
            ></input>
                </div>
                <div>
                   <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                className="h-10 placeholder-black"
                 ></input>
                </div>
                <div>
                  <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="h-10 placeholder-black"
            ></input>
                </div>
                 <div>
<button type="submit" className="bg-white">Submit</button>
                </div>
            </div>
           
            
           
          
            
            
    </form>
    </div>
}

export default Register
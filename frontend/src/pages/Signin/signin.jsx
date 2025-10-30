import { useState , useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserContext } from "../../components/userContext"
import hello from "../../assets/hello.jpg"
import { Crown } from "lucide-react"

const baseURL = import.meta.env.VITE_BASE_URL;




function Signin() {
    
    var navigate = useNavigate()
    var {setUser} = useContext(UserContext)
    
    var [signData, setSignData] = useState({
        username: "",
        email: "",
        password:""
    })
    
    function handleChange(e) {
        var { name, value} = e.target
        setSignData((pre) => ({
            ...pre,
           [name]:value
        }))
    }
    function handleSubmit(e) {
        e.preventDefault()
        // console.log(baseURL)
        //here we need to check if the credentials are right by matching things with the database and then use Navigate() to the home page
        //and remember we should store some access token in the frontend here only 
        //------------------------
        //either username or the email should be given
        var temp =  true
        try {
             if (signData.username.length == 0 && signData.email.length == 0) {
                 throw new Error("Either username or the email should be provided")
            }
            if (signData.password.length == 0) {
                throw  Error("password must be provided")
            }
        } catch (err) {
            temp = false
            console.log(err)
        }
      
        if (temp) {
            fetch(`${baseURL}/api/v1/users/login`, {
                method: "POST",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify(signData),
                credentials:"include"
            })
                .then(res => res.json())
                
                .then(data => {
                //   console.log(data)
                    setUser({
                        accessToken: data.data.accessToken,
                        user:data.data.user
                    })  
                 navigate("/home")
                  
            })
            .catch(err => {
                console.log("Error :" , err)
            })
        }
       

       
    }

    return <div className={` bg-cover bg-center min-h-screen  bg-fixed`}
    style={{ backgroundImage: `url(${hello})` }}>
        <div className=" grid grid-cols-2 place-items-center max-sm:grid-cols-1 gap-y-4 max-sm:gap-y-1 h-full" >
             
            <div className="h-[100vh] max-sm:h-[95vh] w-full bg-[rgba(0,0,0,0.5)]">
                <Single></Single>
            </div>
            <div className="w-full flex items-center justify-center  h-full">
                <form onSubmit={handleSubmit} className=" bg-transparent w-[50%]  max-xl:w-[70%] max-sm:w-[90%] max-md:text-xl pb-2  " autoComplete="off">
                    <div className="grid bg-[rgba(0,0,0,0.5)] justify-center  pt-10 pb-10 max-sm:pb-1 max-sm:pt-1  h-full gap-y-4  ">
                        <div className="w-full h-full">
                             <input
                                   type="text"
                                   name="username"
                                   placeholder="enter the username"
                                   value={signData.username}
                                onChange={handleChange}
                                className="bg-transparent w-full text-2xl text-white focus:outline-none border-white border-b placeholder:text-xl mb-2 max-md:text-xl"
                              ></input>
                        </div>
                        <div>
                            <div className="font-bold text-white text-2xl">or</div>
                        </div>
                        <div>
                              <input
                                     type="email"
                                     name="email"
                                     placeholder="enter the email"
                                     value={signData.email}
                                onChange={handleChange}
                                 className="bg-transparent w-full text-2xl text-white focus:outline-none border-white border-b placeholder:text-xl mb-2 max-md:text-xl"
                               ></input>
                        </div>
                        <div>
                              <input
                                  type="password"
                                  name="password"
                                  placeholder="enter the password"
                                  value={signData.password}
                                onChange={handleChange}
                                 className="bg-transparent w-full text-2xl text-white focus:outline-none border-white border-b placeholder:text-xl mb-2 max-md:text-xl"
                                ></input>
                        </div>
                        <div>
                            <div className="pt-4 max-sm:pt-2">
                            <button type="submit" className="bg-white p-2  max-sm:text-xl max-sm:p-1">Submit</button>
                             <Link to="/register" className="w-10 h-10 ml-2 bg-white text-black p-2 max-sm:p-1 max-sm:text-xl"><button >register</button></Link>
                            </div>
                            
            </div>
                    </div>
       
        
        
               
        
             </form>
            </div>
           
        
      </div>
     
    </div> 
}

function Single() {
    return <div className="text-white  w-[full] flex flex-col justify-center items-center h-full  ">
         <div className='font-bold text-newPurple flex  '>
           <div className=''><h1 className='inline text-4xl'>JTube</h1></div>
      
               <span className=''>
                 <Crown size={40}></Crown>
               </span>
         </div>
        <div className="w-[60%] max-xl:w-[92%]  text-bold text-2xl max-md:text-xl font-mono p-2 pt-10 max-sm:pt-10">
            Enjoy videos from people you know and others you discover, react to them, and create your own playlists that you can listen to anytime, anywhere — all for free.
Discover, connect, and express yourself through the content you love.
        </div>
    </div>
}

export default Signin


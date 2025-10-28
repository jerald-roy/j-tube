// import { useState , useContext } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { UserContext } from "../../components/userContext"
// const baseURL = import.meta.env.VITE_BASE_URL;

function Signin() {
    
    // var navigate = useNavigate()
    // var {setUser} = useContext(UserContext)
    
    // var [signData, setSignData] = useState({
    //     username: "",
    //     email: "",
    //     password:""
    // })
    // function handleChange(e) {
    //     var { name, value} = e.target
    //     setSignData((pre) => ({
    //         ...pre,
    //        [name]:value
    //     }))
    // }
    // function handleSubmit(e) {
    //     e.preventDefault()
    //     // console.log(baseURL)
    //     //here we need to check if the credentials are right by matching things with the database and then use Navigate() to the home page
    //     //and remember we should store some access token in the frontend here only 
    //     //------------------------
    //     //either username or the email should be given
    //     var temp =  true
    //     try {
    //          if (signData.username.length == 0 || signData.email.length == 0) {
    //              throw new Error("Either username or the email shoould be provided")
    //         }
    //         if (signData.password.length == 0) {
    //             throw  Error("password must be provided")
    //         }
    //     } catch (err) {
    //         temp = false
    //         console.log(err)
    //     }
      
    //     if (temp) {
    //         fetch(`${baseURL}/api/v1/users/login`, {
    //             method: "POST",
    //             headers:{"Content-Type": "application/json"},
    //             body: JSON.stringify(signData),
    //             credentials:"include"
    //         })
    //             .then(res => res.json())
                
    //             .then(data => {
    //             //   console.log(data)
    //                 setUser({
    //                     accessToken: data.data.accessToken,
    //                     user:data.data.user
    //                 })  
    //              navigate("/home")
                  
    //         })
    //         .catch(err => {
    //             console.log("Error :" , err)
    //         })
    //     }
       

       
    // }
    return 
}


/*
<div className="bg-black h-screen">
        <form onSubmit={handleSubmit} className="bg-black">
        <input
            type="string"
            name="username"
            placeholder="enter the username"
            value={signData.username}
            onChange={handleChange}
        ></input>
        <input
            type="string"
            name="email"
            placeholder="enter the email"
            value={signData.email}
            onChange={handleChange}
        ></input>
        <input
            type="string"
            name="password"
            placeholder="enter the password"
            value={signData.password}
            onChange={handleChange}
            ></input>
            <div>
            <button type="submit" className="bg-white ">Submit</button>
            </div>   
        
        </form>
        <div className="bg-white">
            <Link to="/register" className="w-10 h-10"><button >register</button></Link>
        </div>
        
    </div> */
export default Signin
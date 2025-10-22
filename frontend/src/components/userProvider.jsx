import { useState, useEffect } from "react";
import { UserContext } from "./userContext";
var baseURL = import.meta.env.VITE_BASE_URL;
export function UserProvider({children}) {
    var [user, setUser] = useState(null)

     useEffect(() => {
    fetch(`${baseURL}/api/v1/users/currentUser`, {
      method:"GET",
      credentials: "include"
    
    })
      .then(res => {
        
        if (res.ok) {
          
          return res.json()
        }

        if (!res.ok) throw new Error("not able to get the home page!")
        
      })
      .then(data => {  
         setUser({ user: data.data })
        
      })
      .catch((err) => {
        console.log(err)
      })
     }, [])
  return <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
}
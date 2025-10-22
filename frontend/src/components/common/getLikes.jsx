const baseURL = import.meta.env.VITE_BASE_URL;


function GetLikes(api, setState ) {
    
      fetch(`${baseURL}/${api}`, {
                            method: "GET",
                            credentials: "include",
                            headers: {
                                "Accept":"application/json"
                            }
      })
        .then(res => res.json())
          .then(data => {
            //   console.log(data)
              setState(data.data)
              
           
          })
        .catch(err => console.log(err))
    return <>
    </>
}

export default GetLikes
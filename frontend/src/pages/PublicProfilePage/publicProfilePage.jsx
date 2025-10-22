import { useLocation } from "react-router-dom"
import FirstPart from "../../components/publicProfile/firstPart"
import SecondPart from "../../components/publicProfile/secondPart"
import { useEffect , useState} from "react";
const baseURL = import.meta.env.VITE_BASE_URL;
function PublicProfilePage() {
    //this below route is getting for all the data at once
    var [info , setInfo] = useState(null)
    var location = useLocation()
    var { id } = location.state 
    useEffect(() => {
        fetch(`${baseURL}/api/v1/dashboard/stats/${id}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept":"application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data.data)
                setInfo(data.data)
            })
            
    },[id])
    return <div className="text-black bg-mainBackground dark:bg-purple-200 dark:text-black">
        
       { info ? <FirstPart info={info}></FirstPart> : <div className="h-screen text-white dark:bg-purple-200 dark:text-black text-center max-sm:text-xl">Loading</div>}
        <SecondPart id={id}></SecondPart>
    </div>
}

export default PublicProfilePage
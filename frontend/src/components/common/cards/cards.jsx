import { SingleSection } from "../../home/heroLower"
import "./cards.css"


function Cards({arr}) {
    var {_id , thumbnail , profilePhoto , title , channelname} = arr
    return<div className="container w-full ">
        <div className="cards max-sm:w-3/4 dark:bg-white bg-mainBackground">
        <SingleSection _id={_id}
            thumbnail={thumbnail}
            profilePhoto={profilePhoto}
            title={title}
            channelName={channelname}
        ></SingleSection>
    </div>
    </div> 
}

export default Cards
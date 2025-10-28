import { SingleSection } from "../../home/heroLower"
import "./cards.css"


function Cards({item}) {
   
    return<div className="container w-[400px] ">
        <div className="cards  dark:bg-white bg-mainBackground  ">
        <SingleSection _id={item._id}
            thumbnail={item.thumbnail.url}
            profilePhoto={item.owner.avatar}
            title={item.title}
            channelName={item.owner.username}
        ></SingleSection>
    </div>
    </div> 
}

export default Cards
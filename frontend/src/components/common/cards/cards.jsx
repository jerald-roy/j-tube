import { SingleSection } from "../../home/heroLower"
import "./cards.css"


function Cards({item}) {
   
    return<div className="container w-[400px] max-sm:w-[300px]">
        <div className="cards  dark:bg-white bg-mainBackground w-full ">
        <SingleSection id={item._id}
            thumbnail={item.thumbnail.url}
            profilePhoto={item.owner.avatar}
            title={item.title}
            channelName={item.owner.username}
        ></SingleSection>
    </div>
    </div> 
}

export default Cards
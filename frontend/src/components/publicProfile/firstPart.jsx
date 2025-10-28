import defaultImage from "../../assets/general.jpg"
// import profile1 from "../../assets/profile1.png"
function FirstPart({ info }) {
   
    return <div className="bg-mainBackground2 text-white dark:bg-purple-200 dark:text-black">
        <div className="overflow-x-hidden h-[300px]">
            <div className="h-[250px] w-[100vw] bg-cover relative "
                style={{ backgroundImage: info.coverImage ? `url(${info.coverImage})`: `url(${defaultImage})` }}>
                <img src={info.avatar} className="w-[180px] h-[180px] max-sm:w-[130px] max-sm:h-[130px] rounded-full object-cover absolute bottom-[-20%] left-10 border-8"></img>
            </div>
            
        </div>
        <div className="font-mono text-center p-5 max-lg:pt-20 max-sm:text-xl">
            <p className="p-2">Username:{info.username}</p>
            <p className="p-2">accountCreation:{info.creationDate} </p>
            <p className="p-2">{info.email}</p>
            <p className="p-2">Total Subscribers : { info.totalNumberOfSub}</p> 
            <p className="p-2">Total Views :{info.
totalNumberOfViews
}</p>
           <p className="p-2">Total Videos : {info.
toalNumberOfVideos}
</p>
           <p className="p-2">Total Likes : {info.totalNumberOfLikes}
</p>
        </div>
    </div>
}
export default FirstPart
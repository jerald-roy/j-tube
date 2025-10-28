import { useState } from "react"
import Button from "../../components/common/button/button";
import { useNavigate } from "react-router-dom";
const baseURL = import.meta.env.VITE_BASE_URL;

function VideoForm() {
     var navigate = useNavigate()
    //this below state is used to store the details for uploading the video
    var [videoData, setVideoData] = useState({
        title: "",
        description: "",
        thumbanil: null,
        videoFile: null
    })
    function handleChange(e) {
        var { name, value, files } = e.target 
        setVideoData((pre) => ({
            ...pre,
             [name] :files ? files[0] : value
        }))
    }
    function handleBack() {
       
        navigate("/uploadVideo")
    }
    function handleSubmit(e) {
        e.preventDefault()
        var { title, description, thumbnail, videoFile } = videoData
        if (title.length == 0 || description.length == 0 || thumbnail == null || videoFile == null) {
            alert("all fields must be filled!")
            return
        }
        var form = new FormData()
        for (var key in videoData) {
            form.append(key,videoData[key])
        }

        fetch(`${baseURL}/api/v1/videos/`, {
            method: "POST",
            credentials: "include",
            body:form
        })
            .then(res => res.json())
            .then(() => {
    
                alert("video uploaded successfully!")
                setVideoData({
                    title: "",
                   description: "",
                   thumbanil: null,
                    videoFile: null
                })
            })
        .catch(err => console.log(err))
    }
    return <div className="min-h-[100vh] bg-mainBackground text-black bg-gradient-to-r from-purple-400 to-gray-400 flex justify-center place-items-center ">
        <div className="w-[70%] max-sm:w-[92%]  bg-[rgba(255,255,255,0.2)] font-mono text-2xl max-sm:text-xl pl-2">
            <div className=" pt-20 pb-5 ">
                Enter the details for the uploading of video
            </div>
            <form onSubmit={handleSubmit}>
                <div>
                   
                    <input
                        placeholder="enter the title"
                        type="text"
                        name="title"
                        value={videoData.title}
                        onChange={handleChange}
                        className="bg-transparent placeholder-gray-800 h-[60px]  border-b  focus:outline-none font-mono border-black w-full"
                    ></input>
                </div>
                <div className="pt-10">
                    <textarea
                        placeholder="enter the description"
                        type="text"
                        name="description"
                        value={videoData.description}
                        onChange={handleChange}
                         className="bg-transparent placeholder-gray-800 h-[60px]  border-b  focus:outline-none font-mono border-black w-full "
                    ></textarea>
                </div>
                <div className="pt-10">
                     <div className="pb-4">Upload the thumbanil</div>
                    <input
                        type="file"
                        name="thumbnail"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full "
                    ></input>
                </div>
                <div className="pt-10">
                    <div className="pb-4">Upload the videoFile</div>
                    <input
                        type="file"
                        name="videoFile"
                        accept="video/*"
                        onChange={handleChange}
                        className="w-full "
                    ></input>
                </div>
                <div className="flex gap-x-4 pt-6 pb-5">
                <Button text="submit"></Button>
                <Button text="Back" onClick={handleBack}></Button>
                </div>
               
               
            </form>
        </div>
    </div>
}

export default VideoForm
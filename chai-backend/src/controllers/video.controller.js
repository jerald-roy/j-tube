// import mongoose { isValidObjectId, Mongoose } from "mongoose"
import mongoose from "mongoose";
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary , deleteOnCloudinary} from "../utils/cloudinary.js"


//here the below route (getAllVideos) is for getting the videos of the particular user 
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    
    //now we wanna just get all the video from the db based on certain conditions that is as simple as it is 
    //you cannot use if(query inside the aggregation pipeline so we need to build it dynamically)
    var pipeline = []
    //1.first we are matching the user
   
    pipeline.push({
        $match: {
            owner:new mongoose.Types.ObjectId(userId)
        }
    })
    //2.we will try to match the query if it exists
    if (query) {
        pipeline.push({
            //regex:this is used for pattern matching by default its case sensitive so we are making it case in-sensitive it called REGULAR EXPRESSION
          $match:{ title:{$regex:query , $options:'i'}} 
        })
    }
    //next we will use sort by to sort things out based on certain feilds like , createdAt and views
    if (sortBy) {
        pipeline.push({
            //in general square brackets around the key means in getting assigned dynamic value in vanilla js also and aslo here
            $sort: {[sortBy] : sortType == 'asc'? 1 : -1}   
        })
    }
    //next we will work with pagination
    //parseInt belongs to js where converts string into an integer
    var skip = (parseInt(page)-1) * parseInt(limit) // skipping the videos formula
    //here we dont need to add an if condition since because by default we would be sending things to the backend for pagination 
    pipeline.push({ // this stage is particularly used for skipping things like how much of the video should be skipped 
        $skip:skip
    })
    pipeline.push({
        $limit:parseInt(limit) // this is used to limit the number of videos that you are sending to the frontend
    })
       

    var resultOfPipeline = await Video.aggregate(pipeline)

    if (resultOfPipeline.length == 0) {
        return res.status(200).json(new ApiResponse(200 , [] , "No videos available for to display or some internal error"))
    }
    
    return res.status(200).json(new ApiResponse(200 , resultOfPipeline , " videos successfully fetched"))
})
//here the below route (videosForHomepage) is for getting the videos general ones from the video collection for the home page
const videosForHomepage = asyncHandler(async (req, res) => {
    var { page = 1, limit = 20 } = req.query
    var pipeline = []
    pipeline.push({
       $sort:{createdAt:-1} 
    })
    pipeline.push({
        $skip:(page -1 ) * limit
    })
    pipeline.push({
        $limit:limit
    })
    pipeline.push({
        $lookup: {
            from: "users",
            let:{ownerId:"$owner"},
            pipeline: [
                { $match: { $expr: { $eq: ["$_id", "$$ownerId"] } } },
                {$project:{avatar:1 , username:1}}
            ],
            as:"ownerDetails"
        }
    })
    pipeline.push({
        $project: {
            _id: 1,
            thumbnail: 1,
            title:1,
            description: 1,
            profilePhoto: {
                $arrayElemAt:["$ownerDetails.avatar",0]
            },
            channelName: {
                $arrayElemAt:["$ownerDetails.username",0]
            }
            
        }
    })

    var videos = await Video.aggregate(pipeline)

    if (!videos) {
        throw new ApiError(404 , "some problem in displaying the videos for the home page or there are no videos on the data base")
    }
    return res.status(200).json(new ApiResponse(200 , videos , "videos for the home page is fetched"))
})
//this below controller is for getting other videos where we will be receiving the videoId from that we need to figure out the videos of the same owner and send it back maybe thorugh pagination
const getOtherVideos = asyncHandler(async (req, res) => {
    var { page = 1 , limit = 10} = req.query
    var videoId = req?.params?.videoId
    //find the video
    var originalVideo = await Video.findById(videoId)
    if (!originalVideo) {
        throw new ApiError(404,"not able to find the other videos of the user")
    }
    var ownerId = originalVideo.owner

    var otherVideos = await Video.find({
        owner: ownerId,
        _id:{$ne : videoId}
    })
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit))
   
    var otherVideoLength = await Video.countDocuments({
        owner: ownerId,
        _id:{$ne : videoId}
    })
    
    return res.status(200).json(new ApiResponse(200,{otherVideoLength ,  otherVideos},"other videos successfully fetched!"))
})
const getOtherVideos2 = asyncHandler(async (req, res) => {
    var { page = 1 , limit = 1} = req.query
    var ownerId = req?.params?.ownerId
  
    var totalDoc = await Video.countDocuments({owner : ownerId})

    var otherVideos = await Video.find({
        owner: new mongoose.Types.ObjectId(ownerId),
      
    }).skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit))
   
    if (otherVideos.length == 0) {
        throw res.status(200).json(new ApiResponse(200 ,[],"no other videos found or some internal error" ))
    }
    return res.status(200).json(new ApiResponse(200, {
      videos: otherVideos,
      totalPage: Math.ceil(totalDoc / limit)
    },"other videos successfully fetched!"))
})
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    //check if both title and description exist
    if (!(title && description)) {
        throw new ApiError(400,"both title and description is must for uploading the video")
    }
    //first lets take the data from the multer(local storage) and store in the cloud and then get the link first and be ready to store it in the db with other feilds like owner 
    
    var videoFileLocalLink =   req.files?.videoFile?.[0]?.path
    var thumbnailFileLocalLink = req.files?.thumbnail?.[0]?.path
    

    if (!(videoFileLocalLink && thumbnailFileLocalLink)) {
        throw new ApiError(400, "unable to receive the file locally")
    }

    var filetype1 = req.files?.videoFile[0]?.mimetype
    var filetype2 = req.files?.thumbnail[0]?.mimetype
    if (filetype1.startsWith('image/')) {
        throw new ApiError(400, "the uploaded file should be an video")
    }

    if (filetype2.startsWith('video/')) {
        throw new ApiError(400, "the thumbnail file should be an image")
    }

   var videoOnCloudinary = await uploadOnCloudinary(videoFileLocalLink)
    var thumbnailOnCloudinary = await uploadOnCloudinary(thumbnailFileLocalLink)

    if (!(videoOnCloudinary && thumbnailOnCloudinary)) {
        throw new ApiError(500, "purely the media was not able be uploaded on the cloud")
    }

    //now somehow we need to get the duration of the video and store it in a variable
    var videoDuration = videoOnCloudinary.duration

  
    //now we have everything ready
    var newVideo = await Video.create({

        title,
        description,
        videoFile: {
            url: videoOnCloudinary.url,
            public_id: videoOnCloudinary.public_id,
            resource_type:videoOnCloudinary.resource_type
        },
        thumbnail: {
            url: thumbnailOnCloudinary.url,
            public_id: thumbnailOnCloudinary.public_id,
            resource_type:thumbnailOnCloudinary.resource_type
        }, 
        duration: videoDuration,
        views: 0,
        isPublished: true,
        owner:req.user?._id

    })

    var videoTosend = {
        //we are converting this newVideo which is an mongoose object to the normal object so we can perform operations on that
        ...newVideo.toObject(),
            //in an js object key should be unique so using this property we are trying to override the things
            videoFile: {
            url: videoOnCloudinary.url,
            
            },
             thumbnail: {
            url: thumbnailOnCloudinary.url,
            
        },
         
    }

    return res.status(201).json(new ApiResponse(200,videoTosend,"video uploaded successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if (!videoId) {
        throw new ApiError(400,"not able to find the ID of the video")
    }

   var channel = await Video.aggregate([
       {
           //All pipeline stage names start with $.
           $match: {
               _id: new mongoose.Types.ObjectId(videoId)
           }
            
       }   ,
            //dollar lookup is used to use join (LEFT JOIN) 
           {
           $lookup: {
                from: "users",
                //we are storing the current document feild that we wanna match or using join actually
                let:{userId:"$owner"},
                pipeline: [{
                    $match: {
                        // (dollar)expr is used to match 2 feild not a feild to a particular value
                        $expr:{$eq:["$_id" , "$$userId"]}
                    }
                },{
                    $project: {
                        password: 0,
                        refreshToken: 0,
                        watchHistory: 0,
                        
                        }
                    }
            ],
                as:"creatorDetails"
               }
           }
        
    ])

    if (!channel?.length) {
       
       throw new ApiError(404,"not able to find the creator of the video")
    }
    return res.status(200).json(new ApiResponse(200,channel[0],"User channel is successfully fetched"))
})

const updateVideo = asyncHandler(async (req, res) => {
    //the first thing we need to check is : is the person has the right authority to change the details
    var checkUserId = req?.user?._id.toString()
    
    const { videoId } = req.params

    //1.first we need to find the video using the videoID and then check its value of the owner and compare it to this checkUserId
    var videoDocument = await Video.findById(videoId)
    if (!videoDocument) {
        throw new ApiError(400 , "not able to find the requested video")
    }
    //2.take the owner propery of that videoDocument
    var ownerIdString = videoDocument?.owner?.toString()
    //3.compare both the id
    if (!checkUserId == ownerIdString) {
        throw new ApiError(403,"you are not allowed to make the changes")
    }
    //now he is able to do the changes
    //TODO: update video details like title, description, thumbnail
    //so we assume we are getting the data from the body 
   

    var { title, description } = req.body

    var thumbnailPath = req.file?.path

    if (!title && !description && !thumbnailPath) {
      throw new ApiError(400,"no new data enterd!")
    }

    //check if the thumbnail is an image and not an video
    if (thumbnailPath) {
       if (!req.file?.mimetype.startsWith('image/')) {
        throw new ApiError(400,"need an image , check with the newly uploaded image")
    } 
    }
    
    //now specifically check for the thumbnail and if its there upload on the cloudinary
    var thumbnailOnCloudinary
    if (thumbnailPath) {
        thumbnailOnCloudinary = await uploadOnCloudinary(thumbnailPath)
        if (!thumbnailOnCloudinary) {
            throw new ApiError(500,"failed to upload the media on the cloud storage")
        }
       //deleting the old thumbnail on the cloud
     var deleteOldThumbnail = await deleteOnCloudinary(videoDocument.thumbnail.public_id , videoDocument.thumbnail.resource_type)
        if (!deleteOldThumbnail) {
            throw new ApiError(500 , "not able to delete the thumbnail on the cloud")
    }
    }

    var updatedData = {}
    if (title) updatedData.title = title
    if (description) updatedData.description = description
    if (thumbnailOnCloudinary) updatedData.thumbnail = thumbnailOnCloudinary
    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                ...updatedData 
            }
        },
        {new:true} //returns the updated document
    )
  
    if (!video) {
        throw new ApiError(500,"not able to update things on the DB , try again later!")
    }
    
    return res.status(200).json(new ApiResponse(200 , video , "update was successfull"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    //first check the user who is requesting is allowed to make this changes to the video
    var requestingUserId = req.user?._id.toString()
    var { videoId } = req.params
    //1.now get the owner of the video
    var videoDetails = await Video.findById(videoId)
    if (!videoDetails) {
        throw new ApiError(400 , "not able to find the requested video")
    }
    var actualOwnerId = videoDetails?.owner?.toString()

    if (!actualOwnerId == requestingUserId) {
        throw new ApiError(401,"you are not allowed to make this changes")
    }
    
    
    //we need to delete things on cloudinary also?????? now we will do that
    const deleteOldVideo = await deleteOnCloudinary(videoDetails.videoFile.public_id , videoDetails.videoFile.resource_type)
    const deleteOldThumbnail =  await deleteOnCloudinary(videoDetails.thumbnail.public_id , videoDetails.thumbnail.resource_type)
    if (!deleteOldVideo || !deleteOldThumbnail) {
        throw new ApiError(500 , "not able to delete the old video or the thumbnail on the cloud")
    }

    //now we can actually procced in deleting the video that is actually the link that it
    //TODO: delete video
    var deletedDocument = await Video.findByIdAndDelete(videoId)
    if (!deletedDocument) {
        throw new ApiError(500,"was not able to delete the document try again later!")
    }
    return res.status(200).json(new ApiResponse(200 , deletedDocument , "the document was successfully deleted"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //first of all is he has the right to do it check that
    var checkUserId = req?.user?._id.toString() //just the userId who is requesting
    //1.first we need to find the video using the videoID and then check its value of the owner and compare it to this checkUserId
    var videoDocument = await Video.findById(videoId)
    if (!videoDocument) {
        throw new ApiError(400 , "not able to find the requested video")
    }
    //2.take the owner propery of that videoDocument
    var ownerIdString = videoDocument?.owner?.toString()
    //3.compare both the id
    if (!checkUserId == ownerIdString) {
        throw new ApiError(403,"you are not allowed to make the changes")
    }
    
    
    //now he is able to make changes
   var toggle =  await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished:!videoDocument.isPublished
            }
        },
        {new:true}
    )
    
    if (!toggle) {
        throw new ApiError(500,"not able to make the requested changes , try again later!")
    }
    return res.status(200).json(new ApiResponse(201 , toggle , "request successfull"))
})

const timeCounter = asyncHandler(async (req, res) => {
    //let the time be in ms
//    console.log("in the backend")

    //first check who is watching it should be other than the owner itself
    //for that we need to find the video and then find the owner of the video
    var { videoId } = req.params
  

    var videoDetails = await Video.findById(videoId)
    if (!videoDetails) {
        throw new ApiError(404 , "Not able to find the video")
    }
   
    var ownerId = videoDetails.owner.toString()

    if (req.user._id.toString() != ownerId) {
      
            
            //add this to watch history
            //increment the count
         var updateWatchHistory = await User.findByIdAndUpdate(
                req.user._id,
             {
                    //it’s not recreating the array every time, just modifying it by inserting the new element when needed.
                    $addToSet: {
                     watchHistory: videoId
                    }
                }
            )

            var incrementViews = await Video.findByIdAndUpdate(
                new mongoose.Types.ObjectId(videoId),
                {
                    $inc: {
                        views: 1
                    }
                }
            )   
            
            if ((!updateWatchHistory) || (!incrementViews)) {
                throw new ApiError(400 , "some internal error in updating the details regarding the viewTime of the video watched")
            }
        
    }
    return res.status(200).json(new ApiResponse(200 , [] , "watch time processed"))
})
//this controller is for getting the views of the particular video
const getViews = asyncHandler(async(req,res) => {
    var videoId = req.params.videoId
    var findVideo = await Video.find({
        _id : new mongoose.Types.ObjectId(videoId)
    })
    if (!findVideo) {
        throw new ApiError(404 , "not able to find the video to get the views")
    }
    var views = findVideo[0].views 
    // console.log(views)
    return res.status(200).json(new ApiResponse(200 , views, "views for the video was successfully fetched"))
})


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    timeCounter,
    videosForHomepage,
    getOtherVideos,
    getViews,
    getOtherVideos2
}

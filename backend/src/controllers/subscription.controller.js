import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.model.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //find the owner of the videoId
    var findOwner = await Video.find({
        _id:new mongoose.Types.ObjectId(videoId)
    })
    if (findOwner.length == 0) {
        throw new ApiError(404 , "not able to add the subscription")
    }
    //check: a owner cannot be a subscriber of his own channel
    if (findOwner[0].owner.toString() == req?.user?._id.toString()) {
        throw new ApiError(403 , "an owner of the channel cannot be the subscriber of his own channel")
    }
    //CHECK :if the subscriber(requester) and channel requesting already exist - so that we can remove that document - meaning : user has unsubscribed
    var check = await Subscription.exists({
        subscriber: new mongoose.Types.ObjectId(req.user._id),
        channel:new mongoose.Types.ObjectId(findOwner[0].owner)
    })
    var result
    if (check) {
         result = await Subscription.deleteOne({
          subscriber:new mongoose.Types.ObjectId(req.user._id),
          channel:new mongoose.Types.ObjectId(findOwner[0].owner)
   })
    }
    
    if (check && result.deletedCount) {
        return res.status(200).json(new ApiResponse(200 , result , "unsubscribed"))
    }
    // TODO: toggle subscription
    //so here we are getting the channelID
    //here we need to create the subscriber actually
   var subscription =  await Subscription.create({
        subscriber: req?.user?._id,
        channel:new mongoose.Types.ObjectId(findOwner[0].owner)
   })
    
  
    
    if (!subscription) {
        throw new ApiError(500 , "some internal error , not able to add the subscription - please do try again later")
    }

    return res.status(200).json(new ApiResponse(200 , subscription , "channel subscribed"))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    //so who and all have subscriber to this channel that is (channelId) is what we want
    //in order to find the subscribers we just need to find the number of user id's present in the subscription collection
    var numOfSubscribers = await Subscription.countDocuments({ channel: new mongoose.Types.ObjectId(channelId) })

    return res.status(200).json(new ApiResponse(200 , numOfSubscribers , "number of channel subscribers found successfully!"))
})

// controller to return the requester's subscription to other channels
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // console.log(req.params)
    //check how many time the subscriberId exist in the subscription collection that will be the equal number of channel that i have subscribed
    //lets use aggregate function for this 
    var page = req.query.page || 1
    var limit = req.query.limit || 1
    var skip = (page - 1) * limit
    // console.log(channelId)
    var channelCount = await Subscription.countDocuments({
     subscriber: new mongoose.Types.ObjectId(channelId)
    }) 
    channelCount = Math.ceil(channelCount / limit)

   var channelInfo =  await Subscription.aggregate([
        {
            $match: {
                subscriber:new mongoose.Types.ObjectId(channelId)
            }
       },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channelInfo",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar:1
                        }
                    }
                ]
            }
       },
  
       {
           $addFields: {
                channelInfo:{$first:"$channelInfo"}
            }
       },
      
       {
           $skip:(skip)
       },
       {
           $limit:(limit)
       }
   ] )

   

    return res.status(200).json(new ApiResponse(200 ,{channelCount , channelInfo} , "number of channels subscribed successfully fetched!"))
        
})

//this controller is used to check whether the user is the subscriber of the video
const checkSubscribed = asyncHandler(async (req, res) => {
    // console.log("hello")
    var userId = req.user?._id
    var videoId = req.params.videoId
    // console.log(videoId)
    
    var findVideo = await Video.find({
       _id:new mongoose.Types.ObjectId(videoId)
    })
    // console.log(findVideo)
    if (findVideo.length == 0 ) {
        throw new ApiError(404 , "we are not able to find this channel , try again later" )
    }
    var check = await Subscription.exists({
        subscriber: new mongoose.Types.ObjectId(userId),
        channel:new mongoose.Types.ObjectId(findVideo[0].owner)
    })
   
    return res.status(200).json(new ApiResponse(200,check ? "true" : false  ,"details fetcehd successfully!" ))
})
export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
    checkSubscribed
}
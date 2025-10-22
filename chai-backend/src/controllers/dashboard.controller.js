import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import {User} from "../models/user.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    //whoever is requesting these deatils there data is only picked up from the data base and given back to them
    //first we will try to find the total subscribers
   
    var { id } = req.params
    var findOwner = await User.find({
        _id:new mongoose.Types.ObjectId(id)
    })
    // console.log(findOwner)
    var findSubscribers = await Subscription.find({
        channel:new mongoose.Types.ObjectId(id)
    })
    //total videos
    var findvideos = await Video.find({
        owner:new mongoose.Types.ObjectId(id)
    })
    //this actually does both finding total number of views as well as likes
    var find =  await Video.aggregate([
        {
            //now we are getting all the videos of the user
            $match: {
                owner:new mongoose.Types.ObjectId(id)
            }
            
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as:"likes"
            }
        },
        { //we are using this preserveNullAnd... because unwind is gonna remove those document whose like field is empty array
        //here we are using full fledge of unwind thats why as a locator we are using path keyword
            $unwind:{path:"$likes",preserveNullAndEmptyArrays:true}
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" },
                totalLikes:{ $sum : { $cond: [{$ifNull :["$likes" , false]} ,1,0] }}
            }
        }
       
    ])
    
    if (!find && !findSubscribers && !findvideos ) {
        throw new ApiError(500 , "some internal error , not able to fetch the complete data")
    }
    
    var date = new Date(findOwner[0].createdAt)
    var data = {
        username: findOwner[0].username,
        email: findOwner[0].email,
        creationDate:date.toLocaleDateString("en-GB"),
        totalNumberOfSub: findSubscribers.length,
        toalNumberOfVideos: findvideos.length,
        totalNumberOfViews: find[0]?.totalViews || 0,
        totalNumberOfLikes: find[0]?.totalLikes || 0,
        avatar: findOwner[0].avatar,
        coverImage:findOwner[0].coverImage
   }
 
   return res.status(200).json(new ApiResponse(200 , data , "your complete data was fetched!"))

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    var findVideos = await Video.find({ owner: new mongoose.Types.ObjectId(req?.user?._id) })
    if (!findVideos) {
        throw new ApiError(500 , "some internal error not able to find your videos ")
    }
    return res.status(200).json(new ApiResponse(200 , findVideos , "your videos was successfully fetched!"))
}) //done

export {
    getChannelStats, 
    getChannelVideos
    }
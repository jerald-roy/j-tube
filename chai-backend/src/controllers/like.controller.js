import mongoose, {isValidObjectId} from "mongoose"
import { Like } from "../models/like.model.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"
import {Tweet} from "../models/tweet.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    //first find if the videoId exists
    var findVideo = await Video.findById(videoId)
    if (!findVideo) {
        throw new ApiError(404 , "not able to find the requested video")
    }
    //2.check if this videoId already exist in the like collection of documents - not only the videoId should match but also the likedBy field
    var checkExist = await Like.find({ video: findVideo._id, likedBy: new mongoose.Types.ObjectId(req?.user?._id) })
    
    if (checkExist.length > 0) {
        //delete the existing document
        await checkExist[0].deleteOne()
        return res.status(200).json(new ApiResponse(200 , {check:false} , "the document was atually disliked!"))
    }

   var createLikeForVideo =  await Like.create({
        video: videoId,
        likedBy:req?.user?._id
   })
    
    if (!createLikeForVideo) {
       throw new ApiError(500 , "sorry some internal error not able to like the video")
    }
    
    return res.status(200).json(new ApiResponse(200, {check:true}, createLikeForVideo , "Video was successfully liked!"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    var findComment = await Comment.findById(commentId)
    if (!commentId) {
        throw new ApiError(404, "sry the comment was not found!")
    }
    
    //check if the request to like comment with the requested user id already is present inside the like document
    var checkComment = await Like.find({
        comment: findComment._id,
        likedBy:new mongoose.Types.ObjectId(req?.user?._id)
    })
    //the above find method is always going to return the array
    if (checkComment.length != 0) {
        //that means the comment has already been liked by the user and we should dislike it
        await checkComment[0].deleteOne()
       
        return res.status(200).json(new ApiResponse(200 , [] , "the comment was disliked"))
    } 
 
    var createLikeForComment = await Like.create({
        comment: commentId,
        likedBy:req?.user?._id 
    })

    if (!createLikeForComment) {
        throw new ApiError(500 , "some internal problem ! , not able to like the comment , please do try again later!")
    }

    return res.status(200).json(new ApiResponse(200 , createLikeForComment, "comment was successfully liked!"))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    //first we will check if the tweet exist
    var findTweet = await Tweet.findById(tweetId)
    if (!findTweet) {
        throw new ApiError(404,"not able to find the tweet!")
    }
    var checkLikeForTweet = await Like.find({
        tweet: tweetId,
        likedBy:req?.user?._id
    })

    if (checkLikeForTweet.length > 0) {
        //it means the the tweet has already been liked
        await checkLikeForTweet[0].deleteOne()
        return res.status(200).json(new ApiResponse(200 , checkLikeForTweet[0] , "the tweet was successfully deleted!"))
    }

    var createLikeForTweet = await Like.create({
        tweet: tweetId,
        likedBy:req?.user?._id
    })

    if (!createLikeForTweet) {
        throw new ApiError(500 , "not able to like the tweet")
    }

    return res.status(200).json(new ApiResponse(200 , createLikeForTweet , "the tweet was successfully liked!"))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    //whoever the user who is requesting we are just taking there req?.user?._id and seeing things inside the like Collection
    var findLikedVideos = await Like.find({
        video: { $exists: true },
        likedBy:req?.user?._id
    })
    if (!findLikedVideos) {
        throw new ApiError(500 , "some problem in searching for the liked videos , please try again later!")
    }

    return res.status(200).json(new ApiResponse(200 , findLikedVideos , "liked videos was successfully fetched"))
})

const getLikesForVideos = asyncHandler(async (req, res) => {
    //we are getting the videoId from req.params
    var videoId = req.params.videoId
    //we will try to find this id in the likes collection
    // console.log(videoId)
    var findLikes = await Like.countDocuments({
        video:new mongoose.Types.ObjectId(videoId)
    })
    return res.status(200).json(new ApiResponse(200 , findLikes , "total likes successfully fetched!"))
})
export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getLikesForVideos
}
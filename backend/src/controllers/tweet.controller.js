import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    //1.where do you think tweet is coming from -> its coming from JSON body
    var { content } = req.body
    
    if (!content) {
        throw new ApiError(404 , "there is no content in the tweet")
    }

   var createTweet =  await Tweet.create({
        content: content,
        owner:req?.user?._id
   })
    
    if (!createTweet) {
        throw new ApiError(500 , "unable to create the tweet , some internal error")
    }

    return res.status(200).json(new ApiResponse(200 , createTweet , "tweet created successfully!"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    // who ever is requesting their tweets is what we want to return back
    var {_id} = req?.user
    var findContent = await Tweet.find({ owner: new mongoose.Types.ObjectId(_id) })
    
    return res.status(200).json(new ApiResponse(200 , findContent , "all the tweets of the user is fetched successully!"))
})

const updateTweet = asyncHandler(async (req, res) => {
    var { tweetId } = req.params
    //we need to get the tweet from the body also
    var { content } = req.body
    if (!content) {
        throw new ApiError(404 , "should provide the content for the update of the tweet")
    }
    //TODO: update tweet
    //1.first we will find the tweet
    var findTweet = await Tweet.findById(tweetId)
    if (!findTweet) {
        throw new ApiError(404 , "not able to find the particular tweet")
    }
    //2.second we compare if its owner or not
    if (!findTweet.owner.toString() == req?.user?._id) {
        throw new ApiError(403 , "you are not allowed to do this operation!")
    }
    //3. then update the tweet
    //we already have the Object document so we once again does not need to fetch things out
    findTweet.content = content
    await findTweet.save()

    return res.status(200).json(new ApiResponse(200 , findTweet , "content of the tweet updated"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    var { tweetId } = req.params
    var findTweet = await Tweet.findById(tweetId)
    if (!findTweet) {
        throw new ApiError(404,"not able to find the tweet")
    }
    if (!findTweet.owner.toString() == req?.user?._id) {
        throw new ApiError(403,"you are not allowed to do this operation , only the onwer can")
    }

    await findTweet.deleteOne()

    return res.status(200).json(new ApiResponse(200 , "" , "tweet successfully deleted!"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}

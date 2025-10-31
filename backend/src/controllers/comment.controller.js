import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {Video} from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    
    const { page = 1, limit = 5 } = req.query
    
    var skip = parseInt((Number(page)) - 1) * parseInt(limit) 
   
    var totalCount = await Comment.countDocuments({
        video:new mongoose.Types.ObjectId(videoId)
    })
    var displayComments = await Comment.aggregate([
        {
        $match: {
            video:new mongoose.Types.ObjectId(videoId)
            }
        
        },
        //but we want owner to look different
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "comment_writer_details",
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
            $set: {
               comment_writer_details:{$first : "$comment_writer_details"}
           }
        },
         {
            $sort:({_id:-1})
        },
        {
            //this stage we will use for pagination
            $skip: skip
        },
        {
            $limit:parseInt(limit)
        },
       

    ])
    
    return res.status(200).json(new ApiResponse(200, {
        comments: displayComments,
        totalPages:Math.ceil(totalCount/limit)
    } , "data about the comments on the video was successfully fetched!"))
})//done

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    var { content } = req.body
    var { videoId } = req.params
    //first we will check with the content
    if (!content) {
        throw new ApiError(404,"no content for the comments were added!")
    }
   //next we are trying to find the video
    var findVideo = await Video.findById(videoId)
   
    if (!findVideo) {
        throw new ApiError(404, "not able to find the video!")
    }
    
    
   var createComment =  await Comment.create({
        content: content,
        video: videoId,
        owner: req?.user?._id
   })
    
    if (!createComment) {
        throw new ApiError(500 , "not able to create the comment please do try again later!")
    }

    return res.status(200).json(new ApiResponse(200 , createComment , "comment created successfully!"))
}) //done

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    //1.first check the comment exist
    //2.check if the requested person and the owner of the comment is same
    //we can only update the content of the comment
    var { commentId } = req.params
    var { content } = req.body
    if (!content) {
        throw new ApiError(404 , "updated comment was not found!")
    }
    var findComment = await Comment.findById(commentId)
    if (!findComment) {
        throw new ApiError(404 , "not able to find the comment to update!")
    }

    if (findComment.owner.toString() != req?.user?._id.toString()) {
        throw new ApiError(403 , "only the ownwer of the comment is able to do this operation")
    }
    findComment.content = content
   await findComment.save()
    return res.status(200).json(new ApiResponse(200 , findComment , "comment was updated successfully!"))
})//done

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    //1.check if the comment exist
    //2. check if its the owner and then delete
    var {commentId} = req.params
    var findComment = await Comment.findById(commentId)
    if (!findComment) {
        throw new ApiError(404 , "not able to find the comment!")
    }
    if (findComment.owner.toString() != req?.user?._id) {
        throw new ApiError(403 , "you are not allowed to do this operation")
    }
    
    await findComment.deleteOne()
    
    return res.status(200).json(new ApiResponse(200 , findComment , "comment was successfully deleted!"))

})//done

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }

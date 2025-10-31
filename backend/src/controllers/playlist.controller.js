import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description , scope} = req.body
    
    //TODO: create playlist
  var createdPlaylist =   await Playlist.create({
        name,
        description,
        owner: req?.user?._id,
        scope:scope // by default it will be private , you will get the route to change it back to public ok
  })
    
    
    if (!createdPlaylist) {
        throw new ApiError(500 , "some internal problem in creating the playlist , please do try again later")
    }

    return res.status(200).json(new ApiResponse(200 , createdPlaylist , "playlist created successfully!"))
}) //nothing to do with public or private here since we dont add actually the videos here

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { section } = req.params
    var userId = req.user._id  

    var foundPlaylists = await Playlist.find({
        owner: new mongoose.Types.ObjectId(userId),
        scope:section
     })
    
   

    return res.status(200).json(new ApiResponse(200 , foundPlaylists , "playlist returned back successfully!!"))
}) // we dont need private or public here since there will be no option of getting all the playlist of others irrespective of whether its private or public - done

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!playlistId) {
        throw new ApiError(400 , "please do provide the id of the playlist to find the playlist")
    }
    //TODO: get playlist by id
    //1. check if that playlist exist
    //2. check if he is the owner
    var getPlayList = await Playlist.findById(playlistId).populate("owner","username avatar")
    if (!getPlayList) {
        throw new ApiError("not able to find the playlist")
    }

   var checkUser =  new mongoose.Types.ObjectId(req?.user?._id).equals(getPlayList.owner._id) ? true : false //here true means the owner
    //now check if its public or private
    //who is the one who is requesting
 
    if (getPlayList.function == "private" && !checkUser) {
        throw new ApiError(403 , "you are not allowed to view this playlist!")
    }
    //now we will send back the playlist using the given id maybe here i should use aggregation pipeline since i also need to details of the owner - but we can also use populate() only

    return res.status(200).json(new ApiResponse(200 , getPlayList , "playlist found successfully!"))
    
}) // done - here public or private is available since users can request for the any single playlist (if its public) will be given back - not applicable if its the owner (the public or the private part)


const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    //first check if playListId exist
    var checkPlaylistId = await Playlist.findById(playlistId)
    var addVideoToPlaylist
    if (checkPlaylistId) {
        //check for the owner
        if (checkPlaylistId.owner.toString() == req?.user?._id) {
           
            if (checkPlaylistId.videos.length > 25) {
                throw new ApiError(507 , "max(25) of videos in the playlist exceeded!" )
            }
            //before adding the video to the playlist - i wanna check if the video is already there in the playlist
            if (checkPlaylistId.videos.includes(videoId)) {
                throw new ApiError(409 , "the video is already saved in the playlist!")
            }
            
            //now try to add the video to the playlist
          addVideoToPlaylist = await Playlist.findByIdAndUpdate(
                playlistId,
                {
                    $addToSet: {
                        videos:videoId
                    }
              },
              {
                    new:true
              }
            )
            if (!addVideoToPlaylist) {
                throw new ApiError(500, "not able to create the playlist , please do try again later")
            }
              
        
        } else {
            throw new ApiError(401 , "you are unauthorized to create this playlist")
        }
    } else {
        throw new ApiError(404 , "not able to find the requested playlist")
    }
    return res.status(200).json(new ApiResponse(200 ,addVideoToPlaylist  , "playlist successfully added!!"))
}) //done



const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    //1.whether the playlist exist
    var findPlaylist = await Playlist.findById(playlistId)
    if (!findPlaylist) {
        throw new ApiError(404 , "the requested playlist does not exist!")
    }
    //2.first check its the owner who is requesting
    if (!(new mongoose.Types.ObjectId(req?.user?._id).equals(findPlaylist.owner))) {
        throw new ApiError(403 , "only the owner of the playlist is able to do this action")
    }
   
    //3.whether the video exist
    if (findPlaylist.videos.includes(videoId)) {
        
        findPlaylist.videos = findPlaylist.videos.filter(item => !item.equals(videoId))
        await findPlaylist.save()
    } else {
        throw new ApiError(404 , "the requested video is not there in the playlist to be deleted")
    }

    return res.status(200).json(new ApiResponse(204 , "" , "video deleted successfully from the playlist!"))
}) //done

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    //1.first check if the playlist exist
    var checkPlaylist = await Playlist.findById(playlistId)
    if (!checkPlaylist) {
        throw new ApiError(404 , "the requested playlist cannot be found to be deleted!")
    }
    //2.check who is requesting , the owner?
    if (!checkPlaylist.owner.toString() == req?.user?._id) {
        throw new ApiError(403 , "FORBIDDEN , only owner of the playlist is allowed to do this operation")
    }
    //3.then delete the playlist
    await checkPlaylist.deleteOne()

    return res.status(200).json(new ApiResponse(200 , "" , "playlist was deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const { name, description } = req.body
    //first will check both the name and the description is provided by the user atleast one of them should be provided
    if (!name && !description) {
        throw new ApiError(400 , "no new data added!")
    }
    //TODO: update playlist
    //first check playlist exist
    var findPlaylist = await Playlist.findById(playlistId)//here we are working with a model 
    if (findPlaylist) {
        //we will check for the owner because owner can only update things
        if (findPlaylist.owner.toString() == req?.user?._id) {
            //now we will try to actually update things
            if (name) findPlaylist.name = name
            if (description) findPlaylist.description = description
            // all the changes above are just in memory until you write the below line 
            await findPlaylist.save() //here what you are having or working with is not a model but the instace 

        } else {
            throw new ApiError(403 , "only the onwer of the playlist is allowed to update the playlist")
        }
    } else {
        throw new ApiError(404 , "playlist not found")
    }

    return res.status(200).json(new ApiResponse(200 , findPlaylist , "update successfully done"))
}) //done

var changeFunctionOfPlaylist = asyncHandler(async (req, res) => {
    var { playlistId } = req.params
    //1.check if playlist exist
    //2.check if the user is the one who is requesting
    var findPlaylist = await Playlist.findById(playlistId)
    if (!findPlaylist) {
        throw new ApiError(404 , "not able to find the requested playlist")
    }
    if (!findPlaylist.owner.toString() == req?.user?._id) {
       throw new ApiError(403 , "only owner of the playlist is allwoed to do this operation")
    }
    //now we will actually try to change the function
    findPlaylist.function = findPlaylist.function == "private" ? "public" : "private"
    findPlaylist.save() // save always throws an error if anything happens so no need to exclusively check things
    return res.status(200).json(new ApiResponse(204 ,findPlaylist , "function of the playlist changed"))
})//done

//this controller is used for getting the particular playlist based upon the playlistId
var getParticularPlaylist = asyncHandler(async (req, res) => {
    var { playlistId } = req.params
 
    //just we need to find the playlist using the playlistId and return 
    var playlist = await Playlist.find({
        _id:new mongoose.Types.ObjectId(playlistId)
    }).populate('owner').populate('videos')
    if (playlist.length == 0) {
        throw new ApiError(404 , "not able to find the requested playlist")
    }
    return res.status(200).json(new ApiResponse(200 , playlist , "playlist was successfully fetched!"))
})
////this below controller is used for getting all the playlist irrespective of whether its private or public (used to add the video to the playlist)
var getVideosToPlaylist = asyncHandler(async (req, res) => {
    var { userId } = req.params
    var getPlayList = await Playlist.find({
        owner:new mongoose.Types.ObjectId(userId)
    })
    return res.status(200).json(new ApiResponse(200 , getPlayList , "users playlist was successfully fetched!"))
})
//this below controller is used for getting all the playlist (but its all should be public)
var getAllPublicPlaylist = asyncHandler(async (req, res) => {
    var page = Number(req.query.page) || 1
    // console.log(req.query.page)
    var limit = Number(req.query.limit) || 1
    var skip = (page - 1 ) * limit
    var findPlaylist = await Playlist.find({
        scope:"public"
    })
        .skip(skip)
        .limit(limit)
    var numberOfPlaylist = await Playlist.countDocuments({
        scope:"public"
    })
    numberOfPlaylist = Math.ceil(numberOfPlaylist / limit)
    return res.status(200).json(new ApiResponse(200 , {numberOfPlaylist , findPlaylist} , 'result was successfully fetched!'))
})
var getAllPublicPlaylistPerson = asyncHandler(async (req, res) => {
    var { id } = req.params
    var page = Number(req?.query?.page) || 1
    var limit = Number(req?.query?.limit) || 5
    var skip = (page - 1) * limit
    var playlistCount = await Playlist.countDocuments({
        owner: new mongoose.Types.ObjectId(id),
        scope:"public"
    })
    var findPlaylist = await Playlist.find({
        owner: new mongoose.Types.ObjectId(id),
        scope:"public"
    }).skip(skip).limit(limit)
    const totalPages = Math.ceil(playlistCount / limit);
    return res.status(200).json(new ApiResponse(200 ,{ totalPages ,  findPlaylist} , "playlist data was successfully retrived"))
})
export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
    changeFunctionOfPlaylist,
    getParticularPlaylist,
    getVideosToPlaylist,
    getAllPublicPlaylist,
    getAllPublicPlaylistPerson
}

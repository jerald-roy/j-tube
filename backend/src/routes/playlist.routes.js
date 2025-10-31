import { Router } from 'express';
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
    changeFunctionOfPlaylist,
    getParticularPlaylist,
    getVideosToPlaylist,
    getAllPublicPlaylist,
    getAllPublicPlaylistPerson
} from "../controllers/playlist.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createPlaylist) // done

router
    .route("/:playlistId") 
    .get(getPlaylistById) // done - here it matter public / private
    .patch(updatePlaylist) //done - does not matter its public / private
    .delete(deletePlaylist); //working here - does not matter its public / private

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist) //done - does not matter its public / private
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist); // done - here also does not matter its public / private

router.route("/getPlaylist/:section").get(getUserPlaylists); //done - this is used to get ALL THE PLAYLIST OF THE USER based upon the section whether its private or public
//based on the above route actually feels like any user can request from any users playlist - but we will not follow this instead - only we will send back the requesters playlist only

router.route("/change/function/:playlistId").patch(changeFunctionOfPlaylist) //done

router.route("/user/getParticularPlaylist/:playlistId").get(getParticularPlaylist)//this controller is used for getting the indivisual playlist by cliked on it

//this below route is used for getting all the playlist irrespective of whether its private or public (used to add the video to the playlist)
router.route("/getVideos/toAddVideo/:userId").get(getVideosToPlaylist)
//this below route is used for getting all the public playlist
router.route("/g/getPlaylist/public").get(getAllPublicPlaylist)
//this below route gets the public playlist same as above but only from the specific user
router.route("/getPlaylist/person/public/:id").get(getAllPublicPlaylistPerson)
export default router
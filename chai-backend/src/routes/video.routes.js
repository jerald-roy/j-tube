import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
    timeCounter,
    videosForHomepage,
    getOtherVideos,
    getViews,
    getOtherVideos2
} from "../controllers/video.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .get(getAllVideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        publishAVideo
    );

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);
//the below rotue is when user plays the start button to play the video 
router.route("/:videoId/watch").post(verifyJWT, timeCounter)
//this route is for the home page
router.route("/homePage/videos").get(videosForHomepage)
//this below route is for getting all(some) videos of the a particular user(while watching videos we will try to show the other videos of the user)
router.route("/otherVideos/:videoId").get(getOtherVideos) 
router.route("/checkUserVideos/:ownerId").get(getOtherVideos2) 
//this route is for getting the number of views for the video
router.route("/checkViews/:videoId").get(getViews)
export default router
import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
    checkSubscribed
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/c/:channelId")
    
    .get(getUserChannelSubscribers)
   
    
router.route("/toggleSubscription/:videoId").post(toggleSubscription)
//the below route is to return the requester who has subscribed to other channels
router.route("/u/:channelId").get(getSubscribedChannels)
router.route("/checkSubscribed/:videoId").get(checkSubscribed)

export default router
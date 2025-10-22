import mongoose, {Schema} from "mongoose";

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videos: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    //video in itself we have not classified as private or public everything is public only but instead we have created or classified playlist as the public or private actually!
    scope: {
        type:String,
        enum : ["public" , "private"]
    }
}, {timestamps: true})



export const Playlist = mongoose.model("Playlist", playlistSchema)
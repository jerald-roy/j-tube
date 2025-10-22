import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
//the above line talks about Express will automatically parse requests with Content-Type: application/json.So if you send JSON (with JSON.stringify), it will work. But if you send a file (FormData), Express won’t parse it, because that’s multipart/form-data, not JSON.
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
//  → Parses form x-www-form-urlencoded data.
// app.use(express.static("public"))
app.use(cookieParser())
// To parse cookies from the request headers and make them available on req.cookies.


//routes import
import userRouter from './routes/user.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter) //done
app.use("/api/v1/tweets", tweetRouter)//done
app.use("/api/v1/subscriptions", subscriptionRouter) //done
app.use("/api/v1/videos", videoRouter) // done
app.use("/api/v1/comments", commentRouter)//done
app.use("/api/v1/likes", likeRouter)//done
app.use("/api/v1/playlist", playlistRouter)//done
app.use("/api/v1/dashboard", dashboardRouter)

// http://localhost:8000/api/v1/users/register

export { app }
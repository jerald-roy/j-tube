import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import { ApiError } from "./ApiError.js";


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
         if (!localFilePath) return null
    //     console.log("HELLO")
    //    console.log(localFilePath)
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type:"auto",
            public_id: `file_${Date.now()}`,
            invalidate: true
        })
   
        // file has been uploaded successfull
        // console.log("file is uploaded on cloudinary ", response.url);
       
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        // fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
       console.log(`this error is something realted to the uploaded file on the cloudinary ` , error)
        return null;
    }
}

const deleteOnCloudinary = async (public_id , resource_type) =>{
    try {
        if (!public_id) return null

      var result =   await cloudinary.uploader.destroy(
                public_id,
            { resource_type: resource_type })
        
        return result
        }
        catch (err) {
        console.log(`this error is something realted to the uploaded file on the cloudinary ` , err)
        return null;
    }
}

export {uploadOnCloudinary , deleteOnCloudinary}
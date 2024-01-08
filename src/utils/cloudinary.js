const cloudinary = require('cloudinary').v2;
const fs = require("fs");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key:  process.env.CLOUDINARY_API_KEY,
    api_secret:  process.env.CLOUDINARY_API_SECRET,
});

exports.cloudinaryUpload = async(filepath) => {
    try {
        if(!filepath){
            return(`filepath does not found.`)
        }
        const response = await cloudinary.uploader.upload(filepath,{
            resource_type : 'auto'  
        });

        console.log(`File is uploaded successfully on cloudinary. : ${response}`);

        return response;

    } catch (error) {
        // remove the locally saved temperory file as the upload got failed.
        fs.unlinkSync(filepath);
        console.log(`error in cloudinaryUpload : ${error}`);
        return null;
    }
} 

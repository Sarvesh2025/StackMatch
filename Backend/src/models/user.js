const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required:true
        },
        lastName: {
            type:String
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim:true
            
        },
        password: {
            type: String,
            required:true
        },
        gender: {
            type: String,

            // by default validate function  only called when new insertion is done 
            validate(value) {
                if (!["male", "female", "others"].includes(value)) {
                    throw new Error("Gender data is not valid");
                }
            }
        },
        age:{
            type: String,
            min:18,
        },
        githubId: {
            type: String,
            required:true
        },
        skills: {
            type:[String]
        },
        photoUrl: {
            type: String,
            default:"https://www.kindpng.com/imgv/ioJmwwJ_dummy-profile-image-jpg-hd-png-download/"
        },
        about: {
            type: String,
            default:"This is default about of user",
        }
    }, {
        timestamps:true
    }
);

module.exports =mongoose.model("User",userSchema)
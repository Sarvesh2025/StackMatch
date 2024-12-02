const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required:true
        },
        lastName: {
            type:String
        },// tested 
        emailId: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
             validate(value) {
                 if (!validator.isEmail(value)) {
                     throw new Error("Not a valid Email");
                 }
            }
            
        }, // tested  // not working for unique constraint 
        password: {
            type: String,
            required: true,
            validate(value) {
                 if (!validator.isStrongPassword(value)) {
                     throw new Error("Please Enter a strong password");
                 }
            }
        }, // tested 
        gender: {
            type: String,

            // by default validate function  only called when new insertion is done 
            validate(value) {
                if (!["male", "female", "others"].includes(value)) {
                    throw new Error("Gender data is not valid");
                }
            }
        }, // tested
        age:{
            type: String,
            min: 18,
            max:1000
        }, // tested 
        githubId: {
            type: String,
            required: true,
             validate(value) {
                 if (value.length>15) {
                     throw new Error("Not a valid github ID");
                 }
            }
        }, // tested 
        skills: {
            type: [String],
             validate(value) {
                 if (value.length>10) {
                     throw new Error("Exceeded maximum number of skills");
                 }
            }
        }, // tested 
        photoUrl: {
            type: String,
            default: "https://www.kindpng.com/imgv/ioJmwwJ_dummy-profile-image-jpg-hd-png-download/",
            validate(value) {
                 if (!validator.isURL(value)) {
                     throw new Error("Not a valid Url");
                 }
            }
        },
        about: {
            type: String,
            default: "This is default about of user",
             validate(value) {
                 if (value.length>15) {
                     throw new Error("Not a valid github ID");
                 }
            }
            
        }
    }, {
        timestamps:true
    }
);

module.exports =mongoose.model("User",userSchema)
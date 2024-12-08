const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String
        },
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
        },
        password: {
            type: String,
            required: true,
            validate(value) {
                if (!validator.isStrongPassword(value)) {
                    throw new Error("Please Enter a strong password");
                }
            }
        },
        gender: {
            type: String,
            validate(value) {
                if (!["male", "female", "others"].includes(value)) {
                    throw new Error("Gender data is not valid");
                }
            }
        },
        age: {
            type: Number,
            min: 18,
            max: 1000
        },
        githubId: {
            type: String,
            required: true,
            validate(value) {
                if (value.length > 15) {
                    throw new Error("Not a valid github ID");
                }
            }
        },
        skills: {
            type: [String],
            validate(value) {
                if (value.length > 10) {
                    throw new Error("Exceeded maximum number of skills");
                }
            }
        },
        photoUrl: {
            type: String,
            default: "https://www.kindpng.com/imgv/ioJmwwJ_dummy-profile-image-jpg-hd-png-download/",
            validate(value) {
                if (!validator.isURL(value)) {
                    throw new Error("Not a valid URL");
                }
            }
        },
        about: {
            type: String,
            default: "This is the default about of user",
            validate(value) {
                if (value.length > 150) {
                    throw new Error("About section too long");
                }
            }
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('emailId')) {
        const existingUser = await mongoose.model('User').findOne({ emailId: user.emailId });
        if (existingUser) {
            throw new Error('Email already exists');
        }
    }
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});  // here issue can come 

userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('Email already exists'));
    } else {
        next(error);
    }
});

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "STACK@Match$790", {
        expiresIn: "24h",
    });
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const isValid = await bcrypt.compare(passwordInputByUser, user.password);
    return isValid;
};

module.exports = mongoose.model("User", userSchema);

const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token is not valid");
        }
        const decodedObject = jwt.verify(token, "STACK@Match$790");
        const { _id } = decodedObject;
        console.log(decodedObject);
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User  not found");
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(400).send("ERROR:" + err.message);
    }
};

module.exports = { userAuth };
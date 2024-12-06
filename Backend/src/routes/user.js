const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

const SAFE_DATA = "firstName lastName photoUrl age gender about skills";
userRouter.get("/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const ConnectionRequests = await ConnectionRequest.find({
            toUserID: loggedInUser._id,
            status: "interested",
        }).populate(
            "fromUSerId",
            SAFE_DATA
        );
        res.json({
            message: "Data fetched successfully",
            data: ConnectionRequests,
        });
    }
    catch (err) {
        req.status(400).send("ERROR: " + err.message);
    }

});

module.exports = userRouter;
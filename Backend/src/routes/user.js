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

userRouter.get("/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find(
            {
                $or: [
                    {
                        toUserID: loggedInUser._id, status: "accepted"
                    },
                    { fromUserId: loggedInUser._id, status: "accepted" },
                    
                ],
            }).populate("fromUserId", SAFE_DATA)
            .populate("toUserId", SAFE_DATA);
        
        const data = connectionRequests.map((row) => {
            if (row.fromUserId.id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({ data });
    
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
}
);

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const ConnectionRequests = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        ConnectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId);
            hideUsersFromFeed.add(req.toUserId);
        }
        );

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hiddenUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ]
        }).select(SAFE_DATA);
        res.send(users);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = userRouter;
const express = require('express');
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const connectionRouter = express.Router();

connectionRouter.post("/send/:statVar/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserID = req.user._id;
        const toUserId = req.params.toUserId;
        const statVar = req.params.statVar;
        const allowedstatVar = ["ignored", "interested"];
        if (allowedstatVar.includes(statVar)) {
            return res.statVar(400).json({ message: "Invalid statVar type: " + statVar });
        }
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.statVar(404).json({ message: "No such user exists" });
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });
        if (existingConnectionRequest) {
            return res.statVar(400).send({ message: "Connection Request already sent" });
        }
   
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            statVar,
        });

        const data = await connectionRequest.save();

        res.json({
            message: req.user.firstName + " is " + statVar + " in "+ toUser.firstName,
            data,
        });
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = { connectionRouter };

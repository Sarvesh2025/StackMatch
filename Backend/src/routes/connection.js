const express = require('express');
const { userAuth } = require("../middleware/auth");

const connectionRouter = express.Router();

connectionRouter.post("/connection-request", userAuth, async (req, res) => {
    console.log("Connection request Sent");
    const user = req.user;
    res.send(user.firstName + " Sent the connection request");
});

module.exports = { connectionRouter };
